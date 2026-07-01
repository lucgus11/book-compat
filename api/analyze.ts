import type { VercelRequest, VercelResponse } from '@vercel/node';

interface UserProfile {
  genres: string[];
  tropes: string[];
  redFlags: string[];
  favoriteAuthors: string[];
  favoriteBooks: string[];
}

interface IAResponse {
  compatibility: number;
  aperitif_summary: string;
  pros: string[];
  cons: string[];
  detected_title?: string;
  detected_author?: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Modèle par défaut : Qwen / GPT-OSS (surtout pas Llama, cf. dépréciation Groq au 18/08).
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

function buildSystemPrompt(): string {
  return `Tu es un critique littéraire chaleureux et perspicace, spécialisé dans le "matching" entre lecteurs et livres.
On te donne le profil de goûts d'un lecteur et le texte brut (OCR, potentiellement bruité/fautif) extrait de la couverture ou de la 4e de couverture d'un livre.

Ta mission :
1. Identifie du mieux que tu peux le titre et l'auteur réels du livre à partir du texte OCR fourni (corrige les fautes évidentes d'OCR).
2. Évalue la compatibilité entre ce livre et le profil du lecteur (0 à 100).
3. Rédige un résumé "apéritif" : court (3-4 phrases max), accrocheur, plus vendeur qu'une 4e de couverture classique — mais STRICTEMENT SANS AUCUN SPOIL (ni intrigue, ni fin, ni rebondissement, ni mort de personnage).
4. Liste des "pros" : pourquoi ce livre a des chances de plaire à CE lecteur précis, en te basant sur son profil (genres, tropes, auteurs/livres aimés).
5. Liste des "cons" : des réserves nuancées et honnêtes (ex: rythme lent, présence possible d'un red flag du lecteur, style particulier) — toujours sans spoiler.

Réponds STRICTEMENT en JSON valide, sans texte avant ou après, sans balises markdown, au format exact suivant :
{
  "compatibility": <nombre entier 0-100>,
  "aperitif_summary": "<string>",
  "pros": ["<string>", "..."],
  "cons": ["<string>", "..."],
  "detected_title": "<string>",
  "detected_author": "<string>"
}`;
}

function buildUserPrompt(profile: UserProfile, ocrText: string): string {
  return `PROFIL DU LECTEUR :
- Genres préférés : ${profile.genres.join(', ') || 'non renseigné'}
- Tropes / éléments favoris : ${profile.tropes.join(', ') || 'non renseigné'}
- Red flags (à éviter) : ${profile.redFlags.join(', ') || 'non renseigné'}
- Auteurs appréciés : ${profile.favoriteAuthors.join(', ') || 'non renseigné'}
- Livres adorés : ${profile.favoriteBooks.join(', ') || 'non renseigné'}

TEXTE EXTRAIT DE LA COUVERTURE (OCR, peut contenir des fautes) :
"""
${ocrText.slice(0, 3000) || '(aucun texte détecté)'}
"""

Réponds uniquement avec le JSON demandé.`;
}

function safeParseJSON(raw: string): IAResponse | null {
  // Retire d'éventuelles balises markdown ```json ... ```
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.compatibility === 'number' &&
      typeof parsed.aperitif_summary === 'string' &&
      Array.isArray(parsed.pros) &&
      Array.isArray(parsed.cons)
    ) {
      return {
        compatibility: Math.max(0, Math.min(100, Math.round(parsed.compatibility))),
        aperitif_summary: parsed.aperitif_summary,
        pros: parsed.pros,
        cons: parsed.cons,
        detected_title: parsed.detected_title || undefined,
        detected_author: parsed.detected_author || undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Configuration serveur incomplète (GROQ_API_KEY manquante)." });
    return;
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  const { profile, ocrText } = (req.body || {}) as {
    profile?: UserProfile;
    ocrText?: string;
  };

  if (!profile) {
    res.status(400).json({ error: 'Profil utilisateur manquant.' });
    return;
  }

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(profile, ocrText || '') },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      res.status(502).json({ error: `Erreur Groq (${groqRes.status}) : ${errText.slice(0, 300)}` });
      return;
    }

    const data = await groqRes.json();
    const content: string = data?.choices?.[0]?.message?.content || '';
    const result = safeParseJSON(content);

    if (!result) {
      res.status(502).json({ error: "Réponse IA invalide, réessaie." });
      return;
    }

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Erreur inconnue.' });
  }
}

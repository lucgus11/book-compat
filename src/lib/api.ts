import type { AnalyzeRequestBody, AnalyzeResponseBody, IAResponse, UserProfile } from '../types';

/**
 * Envoie le profil utilisateur + le texte OCR extrait de la couverture
 * à la fonction serverless Vercel (/api/analyze), qui elle-même appelle
 * Groq côté serveur (clé API jamais exposée au client).
 */
export async function analyzeBook(
  profile: UserProfile,
  ocrText: string
): Promise<IAResponse> {
  const body: AnalyzeRequestBody = { profile, ocrText };

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as AnalyzeResponseBody;

  if (!res.ok || !data.result) {
    throw new Error(data.error || "L'analyse a échoué. Réessaie dans un instant.");
  }

  return data.result;
}

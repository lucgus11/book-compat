# 📚 BookMatch — PWA de compatibilité littéraire

PWA React + TypeScript + Tailwind CSS qui permet de scanner la couverture d'un livre
et de découvrir, grâce à l'IA (Groq), s'il correspond à ton profil de lecteur — sans aucun spoil.

## ✨ Fonctionnalités

- **Profil littéraire** (genres, tropes, red flags, auteurs, livres aimés) — sauvegardé en `localStorage`, modifiable à tout moment dans l'onglet **Profil**.
- **Scan** : photo (caméra) ou upload (galerie) de la couverture / 4e de couverture.
- **OCR côté client** (Tesseract.js) : extraction du texte directement dans le navigateur, aucune image envoyée à l'IA.
- **Analyse IA** (Groq, modèle Qwen ou GPT-OSS — pas de Llama) : titre/auteur détectés, score de compatibilité, résumé "apéritif" sans spoil, pros/cons personnalisés.
- **Bibliothèque** : ajout en "Liste d'envies" ou "Déjà acheté", filtrage, suppression.
- Design minimaliste, chaleureux, inspiré d'un Goodreads moderne.

## 🏗️ Architecture

```
book-compat-pwa/
├── api/
│   └── analyze.ts          # Fonction serverless Vercel — proxy sécurisé vers Groq
├── public/
│   └── icons/               # Icônes PWA
├── src/
│   ├── components/
│   │   ├── Scanner.tsx           # Capture/upload + OCR + appel IA
│   │   ├── AnalysisResult.tsx    # Affichage résultat + jauge + boutons bibliothèque
│   │   ├── CompatibilityGauge.tsx
│   │   ├── Profile.tsx           # Onboarding + paramètres du profil
│   │   ├── TagInput.tsx          # Champ de saisie de tags réutilisable
│   │   ├── Library.tsx           # Bibliothèque filtrable
│   │   ├── BookCard.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── storage.ts       # Persistance localStorage (profil + livres)
│   │   ├── ocr.ts           # Extraction de texte via Tesseract.js
│   │   └── api.ts           # Appel front-end vers /api/analyze
│   ├── types/index.ts       # Interfaces TypeScript (Book, UserProfile, IAResponse…)
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts           # Config Vite + vite-plugin-pwa (manifest + service worker)
└── vercel.json
```

### 🔒 Pourquoi une fonction serverless (`api/analyze.ts`) ?

La clé API Groq **ne doit jamais** être exposée dans le bundle client (elle serait visible
dans le code source livré au navigateur). Le front-end appelle donc `/api/analyze`, une
fonction serverless Vercel qui, elle, détient la clé (`GROQ_API_KEY`, variable d'environnement
serveur, sans préfixe `VITE_`) et interroge l'API Groq.

### 🖼️ Pourquoi un OCR côté client plutôt qu'un modèle vision ?

Les modèles avec capacités vision disponibles sur Groq sont aujourd'hui basés sur Llama
(ex: Llama-4-Scout/Maverick). Comme demandé, ce projet évite Llama et utilise des modèles
texte (Qwen / GPT-OSS). L'extraction du texte de la couverture se fait donc directement dans
le navigateur avec **Tesseract.js**, puis c'est ce texte (potentiellement bruité) qui est
envoyé au modèle texte Groq, avec pour instruction de corriger les fautes d'OCR et d'identifier
le titre/auteur. C'est aussi plus économique et plus rapide.

## 🚀 Installation locale

```bash
npm install
cp .env.example .env
# Édite .env et renseigne ta clé Groq (console.groq.com/keys)
```

Comme le projet utilise une fonction serverless (`/api/analyze.ts`), utilise la CLI Vercel
pour le développement local (elle simule l'environnement serverless) :

```bash
npm install -g vercel
vercel dev
```

L'app sera disponible sur `http://localhost:3000` (ou le port indiqué).

> Si tu préfères tester uniquement l'UI sans les fonctions serverless, `npm run dev` fonctionne
> aussi, mais les appels à `/api/analyze` échoueront (404).

## ☁️ Déploiement sur Vercel

1. Pousse ce projet sur un repo GitHub.
2. Sur [vercel.com](https://vercel.com), clique sur **Add New → Project** et importe le repo.
3. Vercel détecte automatiquement Vite (grâce à `vercel.json`).
4. Dans **Settings → Environment Variables**, ajoute :
   - `GROQ_API_KEY` = ta clé API Groq
   - `GROQ_MODEL` = `openai/gpt-oss-120b` (ou `qwen/qwen3-32b`, etc.)
5. Déploie. C'est tout — la fonction `api/analyze.ts` est automatiquement reconnue par Vercel
   comme une fonction serverless.

## 🎨 Stack technique

- **React 18 + TypeScript** (`.tsx`, typage strict)
- **Tailwind CSS** (palette personnalisée "papier chaud" façon Goodreads moderne)
- **Vite** (build ultra-rapide)
- **vite-plugin-pwa** (génération automatique du manifest et du service worker, mise en cache offline)
- **Tesseract.js** (OCR client)
- **lucide-react** (icônes)
- **Groq API** (Qwen / GPT-OSS) via fonction serverless Vercel

## 📝 Notes

- Les données du profil et de la bibliothèque restent **100% locales** (`localStorage`) — rien
  n'est envoyé à un serveur applicatif, seul le texte OCR + le profil sont transmis à l'IA pour
  l'analyse (aucune image n'est envoyée).
- Le champ `GROQ_MODEL` permet de changer de modèle sans toucher au code, directement depuis les
  variables d'environnement Vercel.
- Pour ajouter une icône maskable plus soignée, remplace les fichiers dans `public/icons/`.

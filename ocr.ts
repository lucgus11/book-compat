import { createWorker } from 'tesseract.js';

/**
 * Extrait le texte brut d'une image (couverture / 4e de couverture)
 * directement dans le navigateur, sans dépendre d'un modèle vision côté IA.
 * Le texte OCR (souvent bruité) est ensuite nettoyé et interprété par le
 * modèle texte Groq (Qwen / GPT-OSS) côté serveur.
 */
export async function extractTextFromImage(
  imageDataUrl: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const worker = await createWorker('fra+eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(imageDataUrl);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}

/** Redimensionne une image (fichier ou dataURL) pour accélérer l'OCR et limiter la taille en mémoire. */
export function fileToResizedDataUrl(file: File, maxDim = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide.'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas non supporté.'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

import { useRef, useState } from 'react';
import { Camera, ImageUp, Loader2, RotateCcw, ScanText } from 'lucide-react';
import type { Book, UserProfile } from '../types';
import { extractTextFromImage, fileToResizedDataUrl } from '../lib/ocr';
import { analyzeBook } from '../lib/api';
import AnalysisResult from './AnalysisResult';

interface ScannerProps {
  profile: UserProfile;
  onSaveBook: (book: Book, status: Book['status']) => void;
}

type Stage = 'idle' | 'ocr' | 'analyzing' | 'done' | 'error';

export default function Scanner({ profile, onSaveBook }: ScannerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [savedStatus, setSavedStatus] = useState<Book['status'] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const profileIncomplete =
    profile.genres.length === 0 &&
    profile.tropes.length === 0 &&
    profile.favoriteBooks.length === 0;

  async function handleFile(file: File) {
    setError(null);
    setBook(null);
    setSavedStatus(undefined);
    setStage('ocr');
    setProgress(0);

    try {
      const resized = await fileToResizedDataUrl(file);
      setImageDataUrl(resized);

      const ocrText = await extractTextFromImage(resized, setProgress);

      setStage('analyzing');
      const result = await analyzeBook(profile, ocrText);

      const newBook: Book = {
        id: crypto.randomUUID(),
        title: result.detected_title || 'Titre non identifié',
        author: result.detected_author,
        imageDataUrl: resized,
        status: 'wishlist',
        addedAt: Date.now(),
        analysis: result,
      };

      setBook(newBook);
      setStage('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
      setStage('error');
    }
  }

  function reset() {
    setStage('idle');
    setImageDataUrl(null);
    setBook(null);
    setError(null);
    setSavedStatus(undefined);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  }

  function handleAddToLibrary(status: Book['status']) {
    if (!book) return;
    const updated = { ...book, status };
    onSaveBook(updated, status);
    setSavedStatus(status);
  }

  return (
    <div className="space-y-6">
      {stage === 'idle' && (
        <>
          {profileIncomplete && (
            <div className="rounded-xl2 bg-gold/15 border border-gold/40 text-ink/75 text-sm p-4">
              Ton profil littéraire est encore vide. Complète-le dans l'onglet{' '}
              <span className="font-medium">Profil</span> pour des analyses plus précises et
              personnalisées.
            </div>
          )}

          <div className="card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-clay-50 flex items-center justify-center">
              <ScanText size={28} className="text-clay-500" />
            </div>
            <h2 className="font-serif text-xl font-semibold">Scanne un livre</h2>
            <p className="text-ink/55 text-sm max-w-xs">
              Prends en photo la couverture ou la 4e de couverture. On te dit si ce livre est fait
              pour toi — sans aucun spoil.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-primary flex flex-col items-center justify-center gap-2 py-6"
            >
              <Camera size={24} />
              <span>Appareil photo</span>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="btn-secondary flex flex-col items-center justify-center gap-2 py-6"
            >
              <ImageUp size={24} />
              <span>Galerie</span>
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </>
      )}

      {(stage === 'ocr' || stage === 'analyzing') && (
        <div className="card p-8 flex flex-col items-center text-center gap-4">
          {imageDataUrl && (
            <img
              src={imageDataUrl}
              alt="Couverture scannée"
              className="w-28 h-36 object-cover rounded-lg shadow-soft"
            />
          )}
          <Loader2 size={28} className="text-clay-500 animate-spin" />
          <div>
            <p className="font-medium text-ink">
              {stage === 'ocr' ? 'Lecture de la couverture…' : 'Analyse en cours…'}
            </p>
            <p className="text-ink/50 text-sm mt-1">
              {stage === 'ocr'
                ? `Extraction du texte ${progress}%`
                : 'On compare avec ton profil littéraire'}
            </p>
          </div>
        </div>
      )}

      {stage === 'error' && (
        <div className="card p-8 flex flex-col items-center text-center gap-4">
          <p className="text-clay-600 font-medium">Oups, ça n'a pas fonctionné.</p>
          <p className="text-ink/55 text-sm">{error}</p>
          <button onClick={reset} className="btn-secondary flex items-center gap-2">
            <RotateCcw size={16} /> Réessayer
          </button>
        </div>
      )}

      {stage === 'done' && book && (
        <>
          <AnalysisResult book={book} onAddToLibrary={handleAddToLibrary} savedStatus={savedStatus} />
          <button
            onClick={reset}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Scanner un autre livre
          </button>
        </>
      )}
    </div>
  );
}

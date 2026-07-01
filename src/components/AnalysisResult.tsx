import { BookmarkPlus, CheckCircle2, ShoppingBag, XCircle } from 'lucide-react';
import type { Book } from '../types';
import CompatibilityGauge from './CompatibilityGauge';

interface AnalysisResultProps {
  book: Book;
  onAddToLibrary: (status: 'wishlist' | 'owned') => void;
  savedStatus?: Book['status'];
}

export default function AnalysisResult({ book, onAddToLibrary, savedStatus }: AnalysisResultProps) {
  const analysis = book.analysis;
  if (!analysis) return null;

  return (
    <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
      <div className="card p-6 flex flex-col items-center text-center gap-4">
        {book.imageDataUrl && (
          <img
            src={book.imageDataUrl}
            alt={book.title}
            className="w-24 h-32 object-cover rounded-lg shadow-soft -mt-2"
          />
        )}
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink leading-snug">
            {book.title}
          </h2>
          {book.author && <p className="text-ink/50 text-sm mt-0.5">{book.author}</p>}
        </div>

        <CompatibilityGauge value={analysis.compatibility} />
      </div>

      <div className="card p-6">
        <h3 className="uppercase tracking-wide text-xs font-semibold text-clay-600 mb-2">
          L'apéritif
        </h3>
        <p className="text-ink/85 leading-relaxed font-serif text-[17px]">
          {analysis.aperitif_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-sage-600 font-semibold text-sm mb-3">
            <CheckCircle2 size={16} /> Pour toi
          </h3>
          <ul className="space-y-2">
            {analysis.pros.map((p, i) => (
              <li key={i} className="text-sm text-ink/75 leading-relaxed flex gap-2">
                <span className="text-sage-500 mt-0.5">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-clay-600 font-semibold text-sm mb-3">
            <XCircle size={16} /> À nuancer
          </h3>
          <ul className="space-y-2">
            {analysis.cons.map((c, i) => (
              <li key={i} className="text-sm text-ink/75 leading-relaxed flex gap-2">
                <span className="text-clay-400 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onAddToLibrary('wishlist')}
          className={`flex-1 btn-secondary flex items-center justify-center gap-2 ${
            savedStatus === 'wishlist' ? 'ring-2 ring-clay-300' : ''
          }`}
        >
          <BookmarkPlus size={18} />
          Liste d'envies
        </button>
        <button
          onClick={() => onAddToLibrary('owned')}
          className={`flex-1 btn-primary flex items-center justify-center gap-2 ${
            savedStatus === 'owned' ? 'ring-2 ring-clay-700' : ''
          }`}
        >
          <ShoppingBag size={18} />
          Déjà acheté
        </button>
      </div>
    </div>
  );
}

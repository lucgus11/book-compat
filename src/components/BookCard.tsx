import { BookOpen, Trash2 } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string, status: Book['status']) => void;
}

export default function BookCard({ book, onRemove, onToggleStatus }: BookCardProps) {
  const compatibility = book.analysis?.compatibility;

  return (
    <div className="card p-4 flex gap-4">
      <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-paper flex items-center justify-center">
        {book.imageDataUrl ? (
          <img src={book.imageDataUrl} alt={book.title} className="w-16 h-24 object-cover" />
        ) : (
          <BookOpen size={20} className="text-ink/25" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif font-semibold text-ink text-[15px] leading-snug truncate">
              {book.title}
            </h3>
            {book.author && <p className="text-ink/50 text-xs mt-0.5 truncate">{book.author}</p>}
          </div>
          {typeof compatibility === 'number' && (
            <span className="shrink-0 text-xs font-semibold text-clay-600 bg-clay-50 rounded-full px-2 py-1">
              {compatibility}%
            </span>
          )}
        </div>

        {book.analysis?.aperitif_summary && (
          <p className="text-ink/55 text-xs mt-2 line-clamp-2">{book.analysis.aperitif_summary}</p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onToggleStatus(book.id, book.status === 'owned' ? 'wishlist' : 'owned')}
            className="text-xs font-medium rounded-full px-3 py-1.5 border border-ink/10 text-ink/60 hover:bg-paper transition-colors"
          >
            {book.status === 'owned' ? 'Marquer comme envie' : 'Marquer comme acheté'}
          </button>
          <button
            onClick={() => onRemove(book.id)}
            className="ml-auto text-ink/30 hover:text-clay-600 transition-colors"
            aria-label="Retirer de la bibliothèque"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

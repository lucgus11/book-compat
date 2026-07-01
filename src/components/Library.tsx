import { useState } from 'react';
import { LibraryBig } from 'lucide-react';
import type { Book, BookStatus } from '../types';
import BookCard from './BookCard';

interface LibraryProps {
  books: Book[];
  onRemove: (id: string) => void;
  onToggleStatus: (id: string, status: BookStatus) => void;
}

type Filter = 'all' | BookStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'wishlist', label: "Liste d'envies" },
  { id: 'owned', label: 'Déjà achetés' },
];

export default function Library({ books, onRemove, onToggleStatus }: LibraryProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = books.filter((b) => filter === 'all' || b.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Ma bibliothèque</h1>
        <p className="text-ink/50 text-sm mt-1">
          {books.length} livre{books.length !== 1 ? 's' : ''} enregistré{books.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-clay-500 text-cream'
                : 'bg-white text-ink/55 border border-ink/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 flex flex-col items-center text-center gap-3">
          <LibraryBig size={28} className="text-ink/20" />
          <p className="text-ink/50 text-sm max-w-[220px]">
            Aucun livre ici pour l'instant. Scanne une couverture pour commencer à remplir ta
            bibliothèque !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} onRemove={onRemove} onToggleStatus={onToggleStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import type { Book, BookStatus, TabId, UserProfile } from './types';
import { loadProfile, saveProfile, loadBooks, addBook, removeBook, updateBookStatus } from './lib/storage';
import Navbar from './components/Navbar';
import Scanner from './components/Scanner';
import Library from './components/Library';
import Profile from './components/Profile';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [activeTab, setActiveTab] = useState<TabId>(profile.onboarded ? 'scan' : 'profile');

  useEffect(() => {
    if (!profile.onboarded) setActiveTab('profile');
  }, [profile.onboarded]);

  function handleSaveProfile(next: UserProfile) {
    setProfile(next);
    saveProfile(next);
  }

  function handleSaveBook(book: Book, status: BookStatus) {
    const withStatus = { ...book, status };
    const existing = books.find((b) => b.id === book.id);
    const next = existing
      ? books.map((b) => (b.id === book.id ? withStatus : b))
      : addBook(withStatus);
    if (!existing) {
      setBooks(next);
    } else {
      setBooks(books.map((b) => (b.id === book.id ? withStatus : b)));
    }
  }

  function handleRemoveBook(id: string) {
    setBooks(removeBook(id));
  }

  function handleToggleStatus(id: string, status: BookStatus) {
    setBooks(updateBookStatus(id, status));
  }

  if (!profile.onboarded) {
    return (
      <div className="min-h-screen bg-cream">
        <main className="max-w-lg mx-auto px-4 pt-8 pb-10">
          <Profile profile={profile} onSave={handleSaveProfile} isOnboarding />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="max-w-lg mx-auto px-4 pt-6 pb-2">
        <h1 className="font-serif text-lg font-semibold text-ink/90 tracking-tight">
          BookMatch
        </h1>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-28 pt-2">
        {activeTab === 'scan' && <Scanner profile={profile} onSaveBook={handleSaveBook} />}
        {activeTab === 'library' && (
          <Library books={books} onRemove={handleRemoveBook} onToggleStatus={handleToggleStatus} />
        )}
        {activeTab === 'profile' && <Profile profile={profile} onSave={handleSaveProfile} />}
      </main>

      <Navbar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

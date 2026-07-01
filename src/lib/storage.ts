import type { Book, UserProfile } from '../types';

const PROFILE_KEY = 'bookmatch_profile_v1';
const BOOKS_KEY = 'bookmatch_books_v1';

export const emptyProfile: UserProfile = {
  genres: [],
  tropes: [],
  redFlags: [],
  favoriteAuthors: [],
  favoriteBooks: [],
  onboarded: false,
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw) as UserProfile;
    return { ...emptyProfile, ...parsed };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Book[];
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function addBook(book: Book): Book[] {
  const books = loadBooks();
  const next = [book, ...books];
  saveBooks(next);
  return next;
}

export function removeBook(id: string): Book[] {
  const next = loadBooks().filter((b) => b.id !== id);
  saveBooks(next);
  return next;
}

export function updateBookStatus(id: string, status: Book['status']): Book[] {
  const next = loadBooks().map((b) => (b.id === id ? { ...b, status } : b));
  saveBooks(next);
  return next;
}

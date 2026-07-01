/**
 * Profil littéraire de l'utilisateur, sauvegardé en localStorage.
 * Sert de base à l'analyse de compatibilité IA.
 */
export interface UserProfile {
  genres: string[];
  tropes: string[];
  redFlags: string[];
  favoriteAuthors: string[];
  favoriteBooks: string[];
  onboarded: boolean;
}

/** Réponse JSON stricte attendue de l'IA (Groq). */
export interface IAResponse {
  compatibility: number; // 0-100
  aperitif_summary: string;
  pros: string[];
  cons: string[];
  detected_title?: string;
  detected_author?: string;
}

export type BookStatus = 'wishlist' | 'owned';

/** Un livre scanné et éventuellement ajouté à la bibliothèque. */
export interface Book {
  id: string;
  title: string;
  author?: string;
  imageDataUrl?: string;
  status: BookStatus;
  addedAt: number;
  analysis?: IAResponse;
}

export type TabId = 'scan' | 'library' | 'profile';

/** Corps de requête envoyé à /api/analyze */
export interface AnalyzeRequestBody {
  profile: UserProfile;
  ocrText: string;
}

/** Corps de réponse renvoyé par /api/analyze */
export interface AnalyzeResponseBody {
  result?: IAResponse;
  error?: string;
}

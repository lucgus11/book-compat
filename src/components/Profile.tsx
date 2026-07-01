import { useEffect, useState } from 'react';
import { BookHeart, Check } from 'lucide-react';
import type { UserProfile } from '../types';
import TagInput from './TagInput';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOnboarding?: boolean;
}

export default function Profile({ profile, onSave, isOnboarding }: ProfileProps) {
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  // Sauvegarde automatique (debounce léger) à chaque modification.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (JSON.stringify(draft) !== JSON.stringify(profile)) {
        onSave(draft);
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  function handleFinishOnboarding() {
    onSave({ ...draft, onboarded: true });
    setJustSaved(true);
  }

  return (
    <div className="space-y-6 pb-4">
      {isOnboarding && (
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-full bg-clay-50 flex items-center justify-center mx-auto">
            <BookHeart size={26} className="text-clay-500" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Bienvenue sur BookMatch</h1>
          <p className="text-ink/55 text-sm max-w-xs mx-auto">
            Raconte-nous tes goûts de lecture pour des analyses vraiment personnalisées.
          </p>
        </div>
      )}

      <div className="card p-5 space-y-5">
        <TagInput
          label="Genres préférés"
          placeholder="Ex : Fantasy, Romantasy, Thriller…"
          values={draft.genres}
          onChange={(genres) => setDraft({ ...draft, genres })}
        />
        <TagInput
          label="Tropes / éléments favoris"
          placeholder="Ex : Ennemies to lovers, Voyage temporel…"
          values={draft.tropes}
          onChange={(tropes) => setDraft({ ...draft, tropes })}
        />
        <TagInput
          label="Red flags"
          placeholder="Ex : Triangle amoureux, Fin triste…"
          helperText="Ce que tu détestes trouver dans un livre."
          values={draft.redFlags}
          onChange={(redFlags) => setDraft({ ...draft, redFlags })}
        />
      </div>

      <div className="card p-5 space-y-5">
        <TagInput
          label="Auteurs appréciés"
          placeholder="Ex : Leigh Bardugo, Colleen Hoover…"
          values={draft.favoriteAuthors}
          onChange={(favoriteAuthors) => setDraft({ ...draft, favoriteAuthors })}
        />
        <TagInput
          label="Livres adorés"
          placeholder="Ex : Le Nom du Vent…"
          values={draft.favoriteBooks}
          onChange={(favoriteBooks) => setDraft({ ...draft, favoriteBooks })}
        />
      </div>

      {isOnboarding ? (
        <button onClick={handleFinishOnboarding} className="w-full btn-primary">
          Commencer à scanner mes livres
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-ink/40 text-xs">
          <Check size={14} className={justSaved ? 'text-sage-500' : ''} />
          Sauvegarde automatique activée
        </div>
      )}
    </div>
  );
}

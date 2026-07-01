import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  helperText?: string;
}

export default function TagInput({ label, placeholder, values, onChange, helperText }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, trimmed]);
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <div>
      <label className="block font-medium text-ink text-sm mb-1.5">{label}</label>
      {helperText && <p className="text-ink/45 text-xs mb-2">{helperText}</p>}
      <div className="flex gap-2">
        <input
          className="input-field"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button
          type="button"
          onClick={addTag}
          className="shrink-0 w-12 rounded-xl bg-clay-500 hover:bg-clay-600 text-cream flex items-center justify-center transition-colors"
          aria-label="Ajouter"
        >
          <Plus size={20} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-clay-500/60 hover:text-clay-700"
                aria-label={`Retirer ${tag}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import { BookMarked, ScanLine, UserRound } from 'lucide-react';
import type { TabId } from '../types';

interface NavbarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof ScanLine }[] = [
  { id: 'scan', label: 'Scanner', icon: ScanLine },
  { id: 'library', label: 'Bibliothèque', icon: BookMarked },
  { id: 'profile', label: 'Profil', icon: UserRound },
];

export default function Navbar({ activeTab, onChange }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-cream/90 backdrop-blur border-t border-ink/10 safe-bottom">
      <div className="max-w-lg mx-auto flex items-stretch justify-around">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? 'text-clay-500' : 'text-ink/40'}
              />
              <span
                className={`text-[11px] font-medium ${
                  active ? 'text-clay-600' : 'text-ink/40'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

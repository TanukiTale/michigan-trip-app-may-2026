import type { LucideIcon } from 'lucide-react';
import type { NavSection } from '../types/trip';

interface BottomNavItem {
  id: NavSection;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export function BottomNav({ items, activeSection, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-6xl px-3 pb-[calc(0.9rem+env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto flex max-w-xl items-center justify-between rounded-[1.8rem] border border-white/80 bg-white/88 px-2 py-2 shadow-board backdrop-blur-md">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1.2rem] px-2 py-2 text-[0.68rem] font-semibold transition ${
                active ? 'bg-sand text-ink shadow-soft' : 'text-driftwood'
              }`}
            >
              <Icon className={`h-[1.1rem] w-[1.1rem] ${active ? 'text-deepLake' : 'text-driftwood'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import React from 'react';
import { User, Code2, Briefcase, Mail } from 'lucide-react';

const tabs = [
  { id: 'hero',   label: 'Profile',    icon: User },
  { id: 'work',   label: 'Projects',   icon: Code2 },
  { id: 'career', label: 'Experience', icon: Briefcase },
  { id: 'about',  label: 'Contact',    icon: Mail },
];

export const MobileNav = ({ activeSection, onActivate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-background/95 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onActivate(id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-primary bg-primary/10'
                  : 'text-white/40'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-mono tracking-wider uppercase">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

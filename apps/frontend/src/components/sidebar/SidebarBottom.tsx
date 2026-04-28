'use client';

import { Search, Brain, Settings } from 'lucide-react';

const items = [
  { icon: Search, label: 'Search' },
  { icon: Brain, label: 'Memory' },
  { icon: Settings, label: 'Settings' },
];

export function SidebarBottom() {
  return (
    <div className="shrink-0 px-3 py-4 border-t border-[#1e1f24] flex items-center justify-around">
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          title={label}
          className="p-2 rounded-lg text-[#4b4d57] hover:text-[#9ca3af] hover:bg-white/5 transition-all duration-150"
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

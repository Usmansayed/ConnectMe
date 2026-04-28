'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppStore, type ProviderName } from '@/store/useAppStore';

const PROVIDERS: { name: ProviderName; label: string; emoji: string; desc: string }[] = [
  { name: 'chatgpt', label: 'ChatGPT', emoji: '🟢', desc: 'GPT-4o · Research · Canvas' },
  { name: 'claude', label: 'Claude', emoji: '🟠', desc: 'Sonnet · Opus · Artifacts' },
  { name: 'gemini', label: 'Gemini', emoji: '🔵', desc: 'Flash · Pro · Deep Research' },
];

interface Props {
  onClose: () => void;
}

export function ProviderSelector({ onClose }: Props) {
  const { selectedProvider, setProvider } = useAppStore();

  const select = (name: ProviderName) => {
    setProvider(name);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown panel */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[calc(100%+12px)] left-0 z-50 w-[260px] bg-[#111214] border border-[#26272b] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-xl"
      >
        <div className="px-2 py-2 space-y-0.5">
          <p className="text-[11px] text-[#4b4d57] px-3 py-1.5 font-medium tracking-wide uppercase">AI Provider</p>
          {PROVIDERS.map((p) => {
            const active = selectedProvider === p.name;
            return (
              <button
                key={p.name}
                onClick={() => select(p.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 ${
                  active ? 'bg-white/8 text-white' : 'text-[#9ca3af] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{p.label}</p>
                  <p className="text-[11px] text-[#4b4d57]">{p.desc}</p>
                </div>
                {active && <Check size={14} className="text-white/60 shrink-0" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

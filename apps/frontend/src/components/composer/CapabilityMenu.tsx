'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAppStore, type ProviderMode } from '@/store/useAppStore';

const CAPABILITIES: Record<string, { mode: ProviderMode; label: string; desc: string }[]> = {
  chatgpt: [
    { mode: 'thinking', label: 'Thinking', desc: 'Extended reasoning mode' },
    { mode: 'web_search', label: 'Web Search', desc: 'Live web browsing' },
    { mode: 'files', label: 'Files', desc: 'Upload and analyse files' },
    { mode: 'canvas', label: 'Canvas', desc: 'Collaborative writing' },
    { mode: 'default', label: 'Default', desc: 'Standard mode' },
  ],
  claude: [
    { mode: 'sonnet', label: 'Sonnet', desc: 'Fast & smart' },
    { mode: 'opus', label: 'Opus', desc: 'Most intelligent' },
    { mode: 'artifacts', label: 'Artifacts', desc: 'Visual outputs' },
    { mode: 'files', label: 'Files', desc: 'Upload documents' },
    { mode: 'default', label: 'Default', desc: 'Standard mode' },
  ],
  gemini: [
    { mode: 'thinking', label: 'Thinking', desc: 'Deep reasoning' },
    { mode: 'deep_research', label: 'Deep Research', desc: 'Multi-step research' },
    { mode: 'files', label: 'Files', desc: 'Upload documents' },
    { mode: 'web_search', label: 'Search', desc: 'Google Search grounding' },
    { mode: 'default', label: 'Default', desc: 'Standard mode' },
  ],
};

interface Props {
  onClose: () => void;
}

export function CapabilityMenu({ onClose }: Props) {
  const { selectedProvider, selectedMode, setMode } = useAppStore();
  const caps = CAPABILITIES[selectedProvider] ?? [];

  const select = (mode: ProviderMode) => {
    setMode(mode);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[calc(100%+12px)] left-0 z-50 w-[240px] bg-[#111214] border border-[#26272b] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        <div className="px-2 py-2 space-y-0.5">
          <p className="text-[11px] text-[#4b4d57] px-3 py-1.5 font-medium tracking-wide uppercase">
            {selectedProvider === 'chatgpt' ? 'ChatGPT' : selectedProvider === 'claude' ? 'Claude' : 'Gemini'} modes
          </p>
          {caps.map((cap) => {
            const active = selectedMode === cap.mode;
            return (
              <button
                key={cap.mode}
                onClick={() => select(cap.mode)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-100 ${
                  active ? 'bg-white/8 text-white' : 'text-[#9ca3af] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{cap.label}</p>
                  <p className="text-[11px] text-[#4b4d57]">{cap.desc}</p>
                </div>
                {active && <Check size={13} className="text-white/60 shrink-0" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

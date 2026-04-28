'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const suggestions = [
  'Help me think through a startup idea',
  'Write a compelling cold email',
  'Debug my code and explain the fix',
  'Summarize this article for me',
];

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-full px-8 pb-40"
    >
      <div className="w-10 h-10 rounded-full bg-[#17181b] border border-[#26272b] flex items-center justify-center mb-6">
        <Sparkles size={18} className="text-[#6b7280]" />
      </div>

      <h1 className="text-[1.75rem] font-semibold text-white/90 tracking-tight text-center mb-2">
        What are we building today?
      </h1>
      <p className="text-[14px] text-[#6b7280] text-center mb-10 max-w-sm leading-relaxed">
        Choose a workspace, pick your AI provider, and start a thread.
      </p>

      <div className="grid grid-cols-2 gap-2.5 max-w-[520px] w-full">
        {suggestions.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.02, backgroundColor: '#1e1f23' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="text-left px-4 py-3 rounded-xl bg-[#17181b] border border-[#26272b] text-[13px] text-[#9ca3af] hover:text-[#d1d5db] hover:border-[#36373e] transition-colors duration-150"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

'use client';

import { useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import { Composer } from '@/components/composer/Composer';
import { motion, AnimatePresence } from 'framer-motion';

export function ChatArea() {
  const { messages, streaming, selectedThread } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0b0b0c] relative">
      {/* Thread name header */}
      {selectedThread && (
        <div className="shrink-0 px-8 py-4 border-b border-[#1a1b1f]">
          <p className="text-[13px] text-[#4b4d57] font-medium tracking-wide">{selectedThread.name}</p>
        </div>
      )}

      {/* Messages scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !streaming ? (
          <EmptyState />
        ) : (
          <div className="max-w-[820px] mx-auto px-6 py-8 space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id ?? i} message={msg} />
              ))}
            </AnimatePresence>

            {/* Streaming typing indicator */}
            <AnimatePresence>
              {streaming && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1e1f23] border border-[#2d2e35] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px]">AI</span>
                  </div>
                  <div className="bg-[#17181b] border border-[#26272b] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="dot-pulse flex gap-1.5 items-center h-5">
                      <span /><span /><span />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Composer */}
      <div className="shrink-0 pb-6 px-4">
        <Composer />
      </div>
    </main>
  );
}

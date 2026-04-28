'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Columns2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';
import { ProviderSelector } from './ProviderSelector';
import { CapabilityMenu } from './CapabilityMenu';
import { AutoResizeTextarea } from './AutoResizeTextarea';

export function Composer() {
  const {
    selectedWorkspace, selectedThread,
    selectedProvider, selectedMode,
    compareMode, setCompareMode,
    compareProviders,
    streaming, setStreaming,
    addMessage, setMessages,
    messages,
  } = useAppStore();

  const [text, setText] = useState('');
  const [providerOpen, setProviderOpen] = useState(false);
  const [capabilityOpen, setCapabilityOpen] = useState(false);

  const canSend = text.trim().length > 0 && !streaming;

  const send = useCallback(async () => {
    if (!canSend || !selectedWorkspace || !selectedThread) return;
    const prompt = text.trim();
    setText('');
    setStreaming(true);

    // Optimistic user message
    const tempUserMsg = {
      id: `tmp-${Date.now()}`,
      thread_id: selectedThread.id,
      provider: selectedProvider,
      role: 'user' as const,
      content: prompt,
      created_at: new Date().toISOString(),
    };
    addMessage(tempUserMsg);

    try {
      if (compareMode) {
        const res = await api.post<{ results: { provider: string; message: string }[] }>('/chat/compare', {
          providers: compareProviders,
          prompt,
          workspaceId: selectedWorkspace.id,
          threadId: selectedThread.id,
        });
        res.results.forEach((r, i) => {
          addMessage({
            id: `cmp-${Date.now()}-${i}`,
            thread_id: selectedThread.id,
            provider: r.provider as any,
            role: 'assistant',
            content: r.message,
            created_at: new Date().toISOString(),
          });
        });
      } else {
        const res = await api.post<{ message: string; threadId: string; provider: string }>('/chat/send', {
          workspaceId: selectedWorkspace.id,
          threadId: selectedThread.id,
          provider: selectedProvider,
          mode: selectedMode,
          prompt,
        });
        // Reload messages from server to get real IDs
        const fresh = await api.get<any[]>(`/messages/${selectedThread.id}`);
        setMessages(fresh);
      }
    } catch (err) {
      addMessage({
        id: `err-${Date.now()}`,
        thread_id: selectedThread.id,
        provider: selectedProvider,
        role: 'assistant',
        content: '⚠️ Something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      });
    }

    setStreaming(false);
  }, [text, canSend, selectedWorkspace, selectedThread, selectedProvider, selectedMode, compareMode, compareProviders]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const placeholder = !selectedThread
    ? 'Select a workspace and thread to start...'
    : compareMode
    ? `Ask all ${compareProviders.join(', ')}...`
    : `Ask ${selectedProvider === 'chatgpt' ? 'ChatGPT' : selectedProvider === 'claude' ? 'Claude' : 'Gemini'}...`;

  return (
    <div className="relative max-w-[860px] mx-auto w-full">
      {/* Dropdowns rendered above */}
      <AnimatePresence>
        {providerOpen && (
          <ProviderSelector onClose={() => setProviderOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {capabilityOpen && (
          <CapabilityMenu onClose={() => setCapabilityOpen(false)} />
        )}
      </AnimatePresence>

      {/* Compare mode bar */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="mb-2 px-4 py-2.5 bg-[#13141a] border border-[#26272b] rounded-xl flex items-center gap-3 text-[12px]"
          >
            <span className="text-[#9ca3af]">Comparing:</span>
            {(['chatgpt', 'claude', 'gemini'] as const).map((p) => (
              <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareProviders.includes(p)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...compareProviders, p]
                      : compareProviders.filter((x) => x !== p);
                    useAppStore.getState().setCompareProviders(next);
                  }}
                  className="rounded border-[#36373e] bg-transparent accent-white"
                />
                <span className="text-[#c4c6ce] capitalize">{p}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Composer Glass Card */}
      <div className="relative bg-[#111214] border border-[#26272b] rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 focus-within:border-[#36373e]">
        {/* Top row: provider + capability + mode */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          {/* Provider pill */}
          <button
            onClick={() => { setProviderOpen(!providerOpen); setCapabilityOpen(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150 ${
              providerOpen
                ? 'bg-white/10 border-[#36373e] text-white'
                : 'bg-white/5 border-[#26272b] text-[#9ca3af] hover:text-white hover:bg-white/8 hover:border-[#36373e]'
            }`}
          >
            <span className="text-[10px]">
              {selectedProvider === 'chatgpt' ? '🟢' : selectedProvider === 'claude' ? '🟠' : '🔵'}
            </span>
            {selectedProvider === 'chatgpt' ? 'ChatGPT' : selectedProvider === 'claude' ? 'Claude' : 'Gemini'}
            <svg className="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Mode pill (if not default) */}
          <AnimatePresence>
            {selectedMode !== 'default' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => useAppStore.getState().setMode('default')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-[#36373e] text-[#9ca3af] hover:text-white hover:bg-white/8 transition-all"
              >
                {selectedMode} ✕
              </motion.button>
            )}
          </AnimatePresence>

          {/* Capability / + button */}
          <button
            onClick={() => { setCapabilityOpen(!capabilityOpen); setProviderOpen(false); }}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-150 ${
              capabilityOpen
                ? 'bg-white/10 border-[#36373e] text-white'
                : 'bg-transparent border-[#26272b] text-[#6b7280] hover:border-[#36373e] hover:text-[#9ca3af]'
            }`}
          >
            <span className="text-[14px] leading-none">+</span>
          </button>

          {/* Compare toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-150 ml-auto ${
              compareMode
                ? 'bg-white/10 border-[#36373e] text-white'
                : 'bg-transparent border-[#26272b] text-[#4b4d57] hover:text-[#9ca3af] hover:border-[#36373e]'
            }`}
          >
            <Columns2 size={11} /> Compare
          </button>
        </div>

        {/* Textarea */}
        <AutoResizeTextarea
          value={text}
          onChange={setText}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={streaming || !selectedThread}
        />

        {/* Bottom row: send */}
        <div className="flex items-center justify-end px-4 pb-3 pt-1">
          <AnimatePresence>
            {text.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={send}
                disabled={!canSend}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 disabled:opacity-40 transition-all duration-150 shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
              >
                <ArrowUp size={16} className="text-black" strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hint */}
      {!selectedThread && (
        <p className="text-center text-[11px] text-[#4b4d57] mt-2">
          Select or create a workspace + thread to begin
        </p>
      )}
    </div>
  );
}

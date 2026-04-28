import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/app.store.tsx';
import { api } from '../api/client';
import { Message, ProviderName } from '@connectme/shared-types';
import { Send, GitCompare, Bot, User } from 'lucide-react';

const providerColors: Record<ProviderName, string> = {
  chatgpt: 'bg-green-600',
  claude: 'bg-orange-600',
  gemini: 'bg-blue-600'
};

export function ChatPanel() {
  const { state, dispatch } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [compareResults, setCompareResults] = useState<{ provider: string; message: string }[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages when thread changes
  useEffect(() => {
    if (!state.selectedThread) { setLocalMessages([]); return; }
    api.get<Message[]>(`/messages/${state.selectedThread.id}`).then(setLocalMessages).catch(() => {});
  }, [state.selectedThread?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, compareResults]);

  const send = async () => {
    if (!prompt.trim() || !state.selectedWorkspace || !state.selectedThread) return;
    setSending(true);
    setCompareResults(null);
    const userPrompt = prompt.trim();
    setPrompt('');

    if (state.compareMode) {
      const res = await api.post<{ results: { provider: string; message: string }[] }>('/chat/compare', {
        providers: state.compareProviders,
        prompt: userPrompt,
        workspaceId: state.selectedWorkspace.id,
        threadId: state.selectedThread.id
      });
      setCompareResults(res.results);
    } else {
      await api.post<{ message: string; threadId: string; provider: string }>('/chat/send', {
        workspaceId: state.selectedWorkspace.id,
        threadId: state.selectedThread.id,
        provider: state.selectedProvider,
        prompt: userPrompt
      });
      // Reload messages
      const msgs = await api.get<Message[]>(`/messages/${state.selectedThread.id}`);
      setLocalMessages(msgs);
    }

    setSending(false);
  };

  if (!state.selectedWorkspace || !state.selectedThread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8">
        <Bot size={48} className="mb-4 opacity-30" />
        <h3 className="text-xl font-semibold text-gray-500 mb-2">No thread selected</h3>
        <p className="text-sm text-center max-w-xs">Select a workspace and thread from the sidebar to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div>
          <h3 className="text-white font-semibold">{state.selectedThread.name}</h3>
          <p className="text-xs text-gray-500">{state.selectedWorkspace.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Provider selector */}
          <select
            value={state.selectedProvider}
            onChange={(e) => dispatch({ type: 'SET_PROVIDER', provider: e.target.value as ProviderName })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="chatgpt">ChatGPT</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
          </select>
          {/* Compare mode toggle */}
          <button
            onClick={() => dispatch({ type: 'SET_COMPARE_MODE', enabled: !state.compareMode })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              state.compareMode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <GitCompare size={16} /> Compare
          </button>
        </div>
      </div>

      {/* Compare provider selector */}
      {state.compareMode && (
        <div className="px-6 py-2 border-b border-gray-800 bg-purple-900/20 flex items-center gap-3 text-sm">
          <span className="text-purple-300">Comparing:</span>
          {(['chatgpt', 'claude', 'gemini'] as ProviderName[]).map((p) => (
            <label key={p} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={state.compareProviders.includes(p)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...state.compareProviders, p]
                    : state.compareProviders.filter((x) => x !== p);
                  dispatch({ type: 'SET_COMPARE_PROVIDERS', providers: next });
                }}
                className="rounded"
              />
              <span className="text-gray-300 capitalize">{p}</span>
            </label>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {localMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${providerColors[msg.provider as ProviderName] || 'bg-gray-700'}`}>
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-tr-sm'
                : 'bg-gray-800 text-gray-200 rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' && (
                <p className="text-xs text-gray-500 mb-1 capitalize">{msg.provider}</p>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Compare results */}
        {compareResults && (
          <div className="grid grid-cols-1 gap-4">
            <p className="text-xs text-gray-500 text-center">— Compare Results —</p>
            {compareResults.map((r) => (
              <div key={r.provider} className="bg-gray-800 rounded-xl p-4">
                <div className={`inline-flex items-center gap-2 mb-2 px-2 py-1 rounded text-xs font-medium ${providerColors[r.provider as ProviderName] || 'bg-gray-700'} text-white`}>
                  <Bot size={12} /> {r.provider.toUpperCase()}
                </div>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{r.message}</p>
              </div>
            ))}
          </div>
        )}

        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Bot size={16} className="text-gray-400" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex gap-3">
          <input
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
            placeholder={state.compareMode ? `Ask all ${state.compareProviders.join(', ')}...` : `Ask ${state.selectedProvider}...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={sending}
          />
          <button
            onClick={send}
            disabled={sending || !prompt.trim()}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

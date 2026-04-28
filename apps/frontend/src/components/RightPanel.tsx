import React from 'react';
import { useAppStore } from '../store/app.store.tsx';
import { ProviderName, ProviderCapabilities } from '@connectme/shared-types';
import { Brain, Monitor, Cpu, CheckCircle, XCircle } from 'lucide-react';

const providerIcons: Record<ProviderName, string> = {
  chatgpt: '🤖',
  claude: '🟠',
  gemini: '💎'
};

export function RightPanel() {
  const { state } = useAppStore();
  const caps: ProviderCapabilities | null = state.providerCapabilities[state.selectedProvider];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-l border-gray-800 flex flex-col p-4 gap-4">
      {/* Provider Status */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Cpu size={12} /> Provider
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{providerIcons[state.selectedProvider]}</span>
          <span className="text-white font-medium capitalize">{state.selectedProvider}</span>
        </div>
        {caps && (
          <div className="flex items-center gap-1.5">
            {caps.loggedIn
              ? <><CheckCircle size={14} className="text-green-400" /><span className="text-green-400 text-xs">Connected</span></>
              : <><XCircle size={14} className="text-gray-500" /><span className="text-gray-500 text-xs">Not logged in</span></>
            }
          </div>
        )}
      </div>

      {/* Browser Status */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Monitor size={12} /> Browser
        </h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${state.browserConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className={`text-sm ${state.browserConnected ? 'text-green-400' : 'text-gray-500'}`}>
            {state.browserConnected ? 'Chromium running' : 'Offline (Phase 2)'}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">Playwright browser automation starts in Phase 2.</p>
      </div>

      {/* Memory Context */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain size={12} /> Memory
        </h4>
        <p className="text-xs text-gray-600">Memory context injection available in Phase 4.</p>
      </div>

      {/* Available Models */}
      {caps && caps.models.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Available Models</h4>
          <div className="space-y-1">
            {caps.models.slice(0, 4).map((m) => (
              <div key={m} className="text-xs text-gray-400 bg-gray-700/50 rounded px-2 py-1">{m}</div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

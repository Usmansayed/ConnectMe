import React, { useEffect } from 'react';
import { useAppStore } from '../store/app.store.tsx';
import { api } from '../api/client';
import { ProviderCapabilities, ProviderName } from '@connectme/shared-types';
import { Cpu, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const providers: ProviderName[] = ['chatgpt', 'claude', 'gemini'];

const providerColors: Record<ProviderName, string> = {
  chatgpt: 'text-green-400',
  claude: 'text-orange-400',
  gemini: 'text-blue-400'
};

export function ProvidersView() {
  const { state, dispatch } = useAppStore();

  const loadCapabilities = async (name: ProviderName) => {
    const caps = await api.get<ProviderCapabilities>(`/provider/${name}/capabilities`);
    dispatch({ type: 'SET_CAPABILITIES', provider: name, capabilities: caps });
  };

  useEffect(() => {
    providers.forEach(loadCapabilities);
  }, []);

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-1">Providers</h2>
      <p className="text-gray-400 text-sm mb-6">AI provider status and detected capabilities.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((name) => {
          const caps = state.providerCapabilities[name];
          return (
            <div key={name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu size={20} className={providerColors[name]} />
                  <h3 className={`text-lg font-bold capitalize ${providerColors[name]}`}>{name}</h3>
                </div>
                <button onClick={() => loadCapabilities(name)} className="p-1 text-gray-500 hover:text-white rounded transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>

              {!caps ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    {caps.loggedIn ? (
                      <><CheckCircle size={16} className="text-green-400" /><span className="text-green-400 text-sm">Logged in</span></>
                    ) : (
                      <><XCircle size={16} className="text-gray-500" /><span className="text-gray-500 text-sm">Not logged in</span></>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1.5">Models</p>
                    <div className="flex flex-wrap gap-1">
                      {caps.models.map((m) => (
                        <span key={m} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{m}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(caps.features).filter(([, v]) => v).map(([k]) => (
                        <span key={k} className="text-xs bg-purple-900/40 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

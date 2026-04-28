import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Setting } from '@connectme/shared-types';
import { Settings, Save } from 'lucide-react';

export function SettingsView() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const load = async () => {
    const data = await api.get<Setting[]>('/settings');
    setSettings(data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!key.trim()) return;
    await api.post('/settings', { key: key.trim(), value: value.trim() });
    setKey(''); setValue('');
    await load();
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
      <p className="text-gray-400 text-sm mb-6">Configure ConnectMe preferences.</p>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-6">
        <h3 className="text-white font-medium mb-3">Add / Update Setting</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} />
          <input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} />
        </div>
        <button onClick={save} disabled={!key.trim()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium">
          <Save size={14} /> Save
        </button>
      </div>

      <div className="space-y-2">
        {settings.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <Settings size={32} className="mx-auto mb-2 opacity-40" />
            <p>No settings saved yet.</p>
          </div>
        ) : (
          settings.map((s) => (
            <div key={s.key} className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3">
              <span className="text-purple-300 text-sm font-mono">{s.key}</span>
              <span className="text-gray-300 text-sm">{s.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

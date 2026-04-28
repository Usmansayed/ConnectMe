import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Log } from '@connectme/shared-types';
import { FileText, RefreshCw, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const typeColors: Record<string, string> = {
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400'
};

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info size={14} />,
  warn: <AlertTriangle size={14} />,
  error: <AlertCircle size={14} />
};

export function LogsView() {
  const [logs, setLogs] = useState<Log[]>([]);

  const load = async () => {
    const data = await api.get<Log[]>('/logs');
    setLogs(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Logs</h2>
          <p className="text-gray-400 text-sm">System activity and events.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <p>No logs yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-0.5 ${typeColors[log.type] || 'text-gray-400'}`}>{typeIcons[log.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 break-words">{log.message}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${typeColors[log.type] || 'text-gray-400'} bg-gray-800`}>{log.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

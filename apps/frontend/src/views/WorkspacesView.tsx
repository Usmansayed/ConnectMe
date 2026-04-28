import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/app.store.tsx';
import { api } from '../api/client';
import { Workspace } from '@connectme/shared-types';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';

export function WorkspacesView() {
  const { state, dispatch } = useAppStore();
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const wss = await api.get<Workspace[]>('/workspaces');
    dispatch({ type: 'SET_WORKSPACES', workspaces: wss });
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    await api.post('/workspaces', { name: newName.trim() });
    setNewName('');
    await load();
    setLoading(false);
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.delete(`/workspaces/${id}`);
    await load();
  };

  const select = (ws: Workspace) => {
    dispatch({ type: 'SET_SELECTED_WORKSPACE', workspace: ws });
    dispatch({ type: 'SET_VIEW', view: 'threads' });
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-1">Workspaces</h2>
      <p className="text-gray-400 text-sm mb-6">Organize your AI sessions by project or topic.</p>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          placeholder="New workspace name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
        />
        <button
          onClick={create}
          disabled={loading || !newName.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
        >
          <Plus size={18} /> Create
        </button>
      </div>

      <div className="space-y-2">
        {state.workspaces.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>No workspaces yet. Create your first one above.</p>
          </div>
        )}
        {state.workspaces.map((ws) => (
          <div
            key={ws.id}
            onClick={() => select(ws)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
              state.selectedWorkspace?.id === ws.id
                ? 'bg-purple-900/30 border-purple-600'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen size={20} className="text-purple-400" />
              <div>
                <p className="text-white font-medium">{ws.name}</p>
                <p className="text-xs text-gray-500">{new Date(ws.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={(e) => remove(ws.id, e)} className="p-1.5 text-gray-500 hover:text-red-400 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

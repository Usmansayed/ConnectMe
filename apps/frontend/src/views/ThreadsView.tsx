import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/app.store.tsx';
import { api } from '../api/client';
import { Thread } from '@connectme/shared-types';
import { Plus, MessageSquare, Trash2, ArrowLeft } from 'lucide-react';

export function ThreadsView() {
  const { state, dispatch } = useAppStore();
  const [newName, setNewName] = useState('');

  const load = async () => {
    if (!state.selectedWorkspace) return;
    const threads = await api.get<Thread[]>(`/threads/${state.selectedWorkspace.id}`);
    dispatch({ type: 'SET_THREADS', threads });
  };

  useEffect(() => { load(); }, [state.selectedWorkspace?.id]);

  const create = async () => {
    if (!newName.trim() || !state.selectedWorkspace) return;
    await api.post('/threads', { workspaceId: state.selectedWorkspace.id, name: newName.trim() });
    setNewName('');
    await load();
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.delete(`/threads/${id}`);
    await load();
  };

  const select = (thread: Thread) => {
    dispatch({ type: 'SET_SELECTED_THREAD', thread });
    dispatch({ type: 'SET_VIEW', view: 'threads' });
  };

  if (!state.selectedWorkspace) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-gray-500">
        <MessageSquare size={40} className="mb-3 opacity-40" />
        <p>Select a workspace first.</p>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'workspaces' })} className="mt-3 text-purple-400 hover:text-purple-300 flex items-center gap-1">
          <ArrowLeft size={16} /> Go to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'workspaces' })} className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-2xl font-bold text-white">Threads</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6">Workspace: <span className="text-purple-300">{state.selectedWorkspace.name}</span></p>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          placeholder="New thread name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
        />
        <button onClick={create} disabled={!newName.trim()} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-medium">
          <Plus size={18} /> Create
        </button>
      </div>

      <div className="space-y-2">
        {state.threads.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
            <p>No threads yet. Start a conversation above.</p>
          </div>
        )}
        {state.threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => select(thread)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
              state.selectedThread?.id === thread.id
                ? 'bg-purple-900/30 border-purple-600'
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-purple-400" />
              <div>
                <p className="text-white font-medium">{thread.name}</p>
                <p className="text-xs text-gray-500">{new Date(thread.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={(e) => remove(thread.id, e)} className="p-1.5 text-gray-500 hover:text-red-400 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

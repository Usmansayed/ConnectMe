import React from 'react';
import { useAppStore } from '../store/app.store.tsx';
import {
  FolderOpen, MessageSquare, Cpu, Brain, FileText, Settings, Zap
} from 'lucide-react';

const navItems = [
  { id: 'workspaces', label: 'Workspaces', icon: FolderOpen },
  { id: 'threads', label: 'Threads', icon: MessageSquare },
  { id: 'providers', label: 'Providers', icon: Cpu },
  { id: 'memory', label: 'Memory Search', icon: Brain },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const { state, dispatch } = useAppStore();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Zap className="text-purple-400" size={22} />
          <span className="text-xl font-bold text-white">ConnectMe</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Local AI Workspace</p>
      </div>

      {/* Active workspace badge */}
      {state.selectedWorkspace && (
        <div className="px-4 py-2 mx-3 mt-3 rounded-lg bg-purple-900/30 border border-purple-700/40">
          <p className="text-xs text-purple-300 font-medium truncate">{state.selectedWorkspace.name}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_VIEW', view: id })}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              state.currentView === id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${state.browserConnected ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span className="text-xs text-gray-500">
            {state.browserConnected ? 'Browser connected' : 'Browser offline'}
          </span>
        </div>
      </div>
    </aside>
  );
}

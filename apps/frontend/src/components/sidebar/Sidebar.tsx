'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';
import { WorkspaceRow } from './WorkspaceRow';
import { SidebarBottom } from './SidebarBottom';
import type { Workspace } from '@/store/useAppStore';

export function Sidebar() {
  const {
    workspaces, setWorkspaces,
    newWorkspaceInputOpen, setNewWorkspaceInputOpen,
    selectedWorkspace, setSelectedWorkspace,
    expandedWorkspaceId, setExpandedWorkspaceId,
    threads, setThreads, setSelectedThread,
  } = useAppStore();

  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadWorkspaces = async () => {
    try {
      const data = await api.get<Workspace[]>('/workspaces');
      setWorkspaces(data);
    } catch {}
  };

  useEffect(() => { loadWorkspaces(); }, []);

  useEffect(() => {
    if (newWorkspaceInputOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [newWorkspaceInputOpen]);

  const createWorkspace = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const ws = await api.post<Workspace>('/workspaces', { name: newName.trim() });
      setNewName('');
      setNewWorkspaceInputOpen(false);
      await loadWorkspaces();
      setSelectedWorkspace(ws);
      setExpandedWorkspaceId(ws.id);
    } catch {}
    setCreating(false);
  };

  const cancel = () => {
    setNewName('');
    setNewWorkspaceInputOpen(false);
  };

  return (
    <aside className="flex flex-col h-screen w-[260px] shrink-0 bg-[#111214] border-r border-[#26272b]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
          <span className="text-[15px] font-semibold tracking-tight text-white/90">Workspace OS</span>
        </div>
      </div>

      {/* New Workspace CTA */}
      <div className="px-3 mb-3">
        <AnimatePresence mode="wait">
          {newWorkspaceInputOpen ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createWorkspace();
                  if (e.key === 'Escape') cancel();
                }}
                placeholder="Workspace name..."
                className="flex-1 bg-[#1c1d20] border border-[#32333a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#4b4d57] focus:outline-none focus:border-[#46474f] transition-colors"
              />
              <button
                onClick={createWorkspace}
                disabled={!newName.trim() || creating}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 transition-colors"
              >
                <Check size={14} className="text-white" />
              </button>
              <button onClick={cancel} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X size={14} className="text-[#9ca3af]" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onClick={() => setNewWorkspaceInputOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[#9ca3af] hover:text-white hover:bg-white/5 border border-[#26272b] hover:border-[#36373e] transition-all duration-150 group"
            >
              <Plus size={14} className="text-[#6b7280] group-hover:text-white transition-colors" />
              New Workspace
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 border-t border-[#1e1f24]" />

      {/* Workspace List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        <AnimatePresence>
          {workspaces.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-[#4b4d57] px-3 py-4 text-center"
            >
              No workspaces yet
            </motion.p>
          )}
          {workspaces.map((ws) => (
            <WorkspaceRow
              key={ws.id}
              workspace={ws}
              onDeleted={loadWorkspaces}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <SidebarBottom />
    </aside>
  );
}

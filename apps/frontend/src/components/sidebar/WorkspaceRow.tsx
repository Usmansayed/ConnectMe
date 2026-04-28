'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Trash2, Pencil, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';
import { ThreadList } from './ThreadList';
import type { Workspace } from '@/store/useAppStore';

interface Props {
  workspace: Workspace;
  onDeleted: () => void;
}

export function WorkspaceRow({ workspace, onDeleted }: Props) {
  const {
    selectedWorkspace, setSelectedWorkspace,
    expandedWorkspaceId, setExpandedWorkspaceId,
    threads, setThreads, setSelectedThread,
  } = useAppStore();

  const isExpanded = expandedWorkspaceId === workspace.id;
  const isSelected = selectedWorkspace?.id === workspace.id;
  const [hovered, setHovered] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(workspace.name);
  const renameRef = useRef<HTMLInputElement>(null);

  const loadThreads = async () => {
    try {
      const data = await api.get<{ id: string; workspace_id: string; name: string; created_at: string }[]>(
        `/threads/${workspace.id}`
      );
      setThreads(data);
    } catch {}
  };

  const handleSelect = async () => {
    if (renaming) return;
    const alreadyExpanded = expandedWorkspaceId === workspace.id;
    setExpandedWorkspaceId(alreadyExpanded ? null : workspace.id);
    if (!alreadyExpanded) {
      setSelectedWorkspace(workspace);
      await loadThreads();
    } else {
      setSelectedWorkspace(null);
    }
  };

  const createThread = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setExpandedWorkspaceId(workspace.id);
    const thread = await api.post<{ id: string; workspace_id: string; name: string; created_at: string }>(
      '/threads',
      { workspaceId: workspace.id, name: 'New thread' }
    );
    await loadThreads();
    setSelectedThread(thread);
  };

  const deleteWorkspace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await api.delete(`/workspaces/${workspace.id}`);
    if (selectedWorkspace?.id === workspace.id) {
      setSelectedWorkspace(null);
      setSelectedThread(null);
    }
    onDeleted();
  };

  const startRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenaming(true);
    setNewName(workspace.name);
    setTimeout(() => renameRef.current?.select(), 30);
  };

  const confirmRename = async () => {
    if (newName.trim() && newName.trim() !== workspace.name) {
      await api.put(`/workspaces/${workspace.id}`, { name: newName.trim() });
      onDeleted(); // reload
    }
    setRenaming(false);
  };

  useEffect(() => {
    if (isExpanded && isSelected) loadThreads();
  }, [isExpanded]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.18 }}
    >
      {/* Row */}
      <div
        className={`flex items-center gap-1.5 px-2 py-2 rounded-lg cursor-pointer group transition-colors duration-100 ${
          isSelected ? 'bg-white/8 text-white' : 'text-[#9ca3af] hover:bg-white/4 hover:text-[#d1d5db]'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleSelect}
      >
        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          <ChevronRight size={13} className={isSelected ? 'text-white/60' : 'text-[#4b4d57]'} />
        </motion.div>

        {/* Name */}
        {renaming ? (
          <input
            ref={renameRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmRename();
              if (e.key === 'Escape') setRenaming(false);
            }}
            onBlur={confirmRename}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-[#1c1d20] border border-[#32333a] rounded px-2 py-0.5 text-[13px] text-white focus:outline-none focus:border-[#46474f] min-w-0"
          />
        ) : (
          <span className="flex-1 text-[13px] font-medium truncate">{workspace.name}</span>
        )}

        {/* Actions (visible on hover) */}
        <AnimatePresence>
          {hovered && !renaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
              className="flex items-center gap-0.5 shrink-0"
            >
              <button
                onClick={createThread}
                className="p-1 rounded hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                title="New thread"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={startRename}
                className="p-1 rounded hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                title="Rename"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={deleteWorkspace}
                className="p-1 rounded hover:bg-red-500/20 text-[#6b7280] hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thread list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ThreadList workspaceId={workspace.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

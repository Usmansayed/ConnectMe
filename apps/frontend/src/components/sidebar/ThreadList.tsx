'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Pencil } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api';

interface Thread {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

interface Props {
  workspaceId: string;
}

export function ThreadList({ workspaceId }: Props) {
  const { threads, setThreads, selectedThread, setSelectedThread, setMessages } = useAppStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const wsThreads = threads.filter((t) => t.workspace_id === workspaceId);

  useEffect(() => {
    api.get<Thread[]>(`/threads/${workspaceId}`).then(setThreads).catch(() => {});
  }, [workspaceId]);

  const selectThread = async (thread: Thread) => {
    if (renamingId) return;
    setSelectedThread(thread);
    try {
      const msgs = await api.get<any[]>(`/messages/${thread.id}`);
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
  };

  const deleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.delete(`/threads/${id}`);
    if (selectedThread?.id === id) {
      setSelectedThread(null);
      setMessages([]);
    }
    const data = await api.get<Thread[]>(`/threads/${workspaceId}`);
    setThreads(data);
  };

  const startRename = (thread: Thread, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(thread.id);
    setRenameValue(thread.name);
    setTimeout(() => inputRef.current?.select(), 30);
  };

  const confirmRename = async (threadId: string) => {
    if (renameValue.trim()) {
      await api.put(`/threads/${threadId}`, { name: renameValue.trim() }).catch(() => {});
      const data = await api.get<Thread[]>(`/threads/${workspaceId}`);
      setThreads(data);
    }
    setRenamingId(null);
  };

  if (wsThreads.length === 0) {
    return (
      <p className="text-[11px] text-[#4b4d57] pl-7 pr-3 py-1.5">No threads yet</p>
    );
  }

  return (
    <div className="pl-3 pr-1 py-1 space-y-0.5">
      {wsThreads.map((thread) => {
        const isSelected = selectedThread?.id === thread.id;
        const isHovered = hoveredId === thread.id;
        const isRenaming = renamingId === thread.id;

        return (
          <motion.div
            key={thread.id}
            layout
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group transition-colors duration-100 ${
              isSelected
                ? 'bg-white/8 text-white'
                : 'text-[#6b7280] hover:bg-white/4 hover:text-[#c4c6ce]'
            }`}
            onMouseEnter={() => setHoveredId(thread.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => selectThread(thread)}
          >
            <MessageSquare size={12} className="shrink-0 opacity-50" />

            {isRenaming ? (
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename(thread.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                onBlur={() => confirmRename(thread.id)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-[#1c1d20] border border-[#32333a] rounded px-1.5 py-0.5 text-[12px] text-white focus:outline-none min-w-0"
              />
            ) : (
              <span className="flex-1 text-[12px] truncate">{thread.name}</span>
            )}

            <AnimatePresence>
              {isHovered && !isRenaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="flex items-center gap-0.5 shrink-0"
                >
                  <button
                    onClick={(e) => startRename(thread, e)}
                    className="p-1 rounded hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={(e) => deleteThread(thread.id, e)}
                    className="p-1 rounded hover:bg-red-500/20 text-[#6b7280] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

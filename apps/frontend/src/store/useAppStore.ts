import { create } from 'zustand';

export type ProviderName = 'chatgpt' | 'claude' | 'gemini';

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  provider: ProviderName;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export type ProviderMode =
  | 'default'
  | 'thinking'
  | 'web_search'
  | 'files'
  | 'canvas'
  | 'deep_research'
  | 'artifacts'
  | 'sonnet'
  | 'opus';

interface AppState {
  // Workspaces
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  expandedWorkspaceId: string | null;

  // Threads
  threads: Thread[];
  selectedThread: Thread | null;

  // Messages
  messages: Message[];
  streaming: boolean;

  // Provider
  selectedProvider: ProviderName;
  selectedMode: ProviderMode;

  // Compare
  compareMode: boolean;
  compareProviders: ProviderName[];

  // UI
  sidebarOpen: boolean;
  newWorkspaceInputOpen: boolean;

  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setSelectedWorkspace: (ws: Workspace | null) => void;
  setExpandedWorkspaceId: (id: string | null) => void;
  setThreads: (threads: Thread[]) => void;
  setSelectedThread: (thread: Thread | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (msg: Message) => void;
  setStreaming: (v: boolean) => void;
  setProvider: (p: ProviderName) => void;
  setMode: (m: ProviderMode) => void;
  setCompareMode: (v: boolean) => void;
  setCompareProviders: (ps: ProviderName[]) => void;
  setSidebarOpen: (v: boolean) => void;
  setNewWorkspaceInputOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  workspaces: [],
  selectedWorkspace: null,
  expandedWorkspaceId: null,
  threads: [],
  selectedThread: null,
  messages: [],
  streaming: false,
  selectedProvider: 'chatgpt',
  selectedMode: 'default',
  compareMode: false,
  compareProviders: ['chatgpt', 'claude'],
  sidebarOpen: true,
  newWorkspaceInputOpen: false,

  setWorkspaces: (workspaces) => set({ workspaces }),
  setSelectedWorkspace: (ws) =>
    set({ selectedWorkspace: ws, selectedThread: null, messages: [] }),
  setExpandedWorkspaceId: (id) => set({ expandedWorkspaceId: id }),
  setThreads: (threads) => set({ threads }),
  setSelectedThread: (thread) => set({ selectedThread: thread }),
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setStreaming: (v) => set({ streaming: v }),
  setProvider: (p) => set({ selectedProvider: p, selectedMode: 'default' }),
  setMode: (m) => set({ selectedMode: m }),
  setCompareMode: (v) => set({ compareMode: v }),
  setCompareProviders: (ps) => set({ compareProviders: ps }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setNewWorkspaceInputOpen: (v) => set({ newWorkspaceInputOpen: v }),
}));

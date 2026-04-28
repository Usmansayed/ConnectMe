import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Workspace, Thread, Message, ProviderCapabilities, ProviderName } from '@connectme/shared-types';

type View = 'workspaces' | 'threads' | 'providers' | 'memory' | 'logs' | 'settings';

interface AppState {
  currentView: View;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  threads: Thread[];
  selectedThread: Thread | null;
  messages: Message[];
  selectedProvider: ProviderName;
  providerCapabilities: Record<ProviderName, ProviderCapabilities | null>;
  compareMode: boolean;
  compareProviders: ProviderName[];
  isLoading: boolean;
  browserConnected: boolean;
}

type Action =
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SET_WORKSPACES'; workspaces: Workspace[] }
  | { type: 'SET_SELECTED_WORKSPACE'; workspace: Workspace | null }
  | { type: 'SET_THREADS'; threads: Thread[] }
  | { type: 'SET_SELECTED_THREAD'; thread: Thread | null }
  | { type: 'SET_MESSAGES'; messages: Message[] }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_PROVIDER'; provider: ProviderName }
  | { type: 'SET_CAPABILITIES'; provider: ProviderName; capabilities: ProviderCapabilities }
  | { type: 'SET_COMPARE_MODE'; enabled: boolean }
  | { type: 'SET_COMPARE_PROVIDERS'; providers: ProviderName[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_BROWSER_CONNECTED'; connected: boolean };

const initialState: AppState = {
  currentView: 'workspaces',
  workspaces: [],
  selectedWorkspace: null,
  threads: [],
  selectedThread: null,
  messages: [],
  selectedProvider: 'chatgpt',
  providerCapabilities: { chatgpt: null, claude: null, gemini: null },
  compareMode: false,
  compareProviders: ['chatgpt', 'claude'],
  isLoading: false,
  browserConnected: false
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW': return { ...state, currentView: action.view };
    case 'SET_WORKSPACES': return { ...state, workspaces: action.workspaces };
    case 'SET_SELECTED_WORKSPACE': return { ...state, selectedWorkspace: action.workspace, selectedThread: null, messages: [] };
    case 'SET_THREADS': return { ...state, threads: action.threads };
    case 'SET_SELECTED_THREAD': return { ...state, selectedThread: action.thread };
    case 'SET_MESSAGES': return { ...state, messages: action.messages };
    case 'ADD_MESSAGE': return { ...state, messages: [...state.messages, action.message] };
    case 'SET_PROVIDER': return { ...state, selectedProvider: action.provider };
    case 'SET_CAPABILITIES': return { ...state, providerCapabilities: { ...state.providerCapabilities, [action.provider]: action.capabilities } };
    case 'SET_COMPARE_MODE': return { ...state, compareMode: action.enabled };
    case 'SET_COMPARE_PROVIDERS': return { ...state, compareProviders: action.providers };
    case 'SET_LOADING': return { ...state, isLoading: action.loading };
    case 'SET_BROWSER_CONNECTED': return { ...state, browserConnected: action.connected };
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be inside AppProvider');
  return ctx;
}

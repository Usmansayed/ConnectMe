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
  provider: 'chatgpt' | 'claude' | 'gemini';
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Log {
  id: string;
  type: 'info' | 'error' | 'warn';
  message: string;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

export type ProviderName = 'chatgpt' | 'claude' | 'gemini';

export interface ProviderCapabilities {
  loggedIn: boolean;
  models: string[];
  tools: string[];
  features: {
    research?: boolean;
    files?: boolean;
    canvas?: boolean;
    thinking?: boolean;
    deepResearch?: boolean;
    artifacts?: boolean;
  };
}

export interface ChatSendRequest {
  workspaceId: string;
  threadId: string;
  provider: ProviderName;
  mode?: string;
  prompt: string;
}

export interface ChatCompareRequest {
  providers: ProviderName[];
  prompt: string;
  workspaceId: string;
  threadId: string;
}

export interface MemoryItem {
  id: string;
  workspace_id: string;
  content: string;
  embedding?: number[];
  created_at: string;
}

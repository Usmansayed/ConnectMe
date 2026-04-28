import React from 'react';
import { AppProvider, useAppStore } from './store/app.store.tsx';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { RightPanel } from './components/RightPanel';
import { WorkspacesView } from './views/WorkspacesView';
import { ThreadsView } from './views/ThreadsView';
import { ProvidersView } from './views/ProvidersView';
import { MemoryView } from './views/MemoryView';
import { LogsView } from './views/LogsView';
import { SettingsView } from './views/SettingsView';

function MainContent() {
  const { state } = useAppStore();

  const renderView = () => {
    switch (state.currentView) {
      case 'workspaces': return <WorkspacesView />;
      case 'threads': return <ThreadsView />;
      case 'providers': return <ProvidersView />;
      case 'memory': return <MemoryView />;
      case 'logs': return <LogsView />;
      case 'settings': return <SettingsView />;
      default: return <WorkspacesView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-y-auto">
            {renderView()}
          </div>
          <ChatPanel />
        </div>
      </main>
      <RightPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

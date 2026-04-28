import React, { useState } from 'react';
import { Brain, Search } from 'lucide-react';

export function MemoryView() {
  const [query, setQuery] = useState('');
  const [results] = useState<string[]>([]);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-1">Memory Search</h2>
      <p className="text-gray-400 text-sm mb-6">Search across all your AI conversations and extracted facts.</p>

      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            placeholder="Search memories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
          Search
        </button>
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Brain size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg mb-1">Memory coming in Phase 4</p>
          <p className="text-sm">After Phase 4, memories from all providers are searchable here.</p>
        </div>
      )}
    </div>
  );
}

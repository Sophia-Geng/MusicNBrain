import React from 'react';
import ChatInterface from './components/ChatInterface';

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shadow-sm">
        <span className="text-2xl">🎵</span>
        <div>
          <h1 className="text-lg font-semibold text-slate-800">MusicNBrain</h1>
          <p className="text-xs text-slate-500">Concert Program Assistant</p>
        </div>
      </header>

      {/* Chat Area - Full width, like Gemini */}
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}

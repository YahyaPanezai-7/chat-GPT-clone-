
import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col border border-gray-700 rounded-2xl shadow-2xl bg-gray-800/50 backdrop-blur-sm">
        <header className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-200">Gemini Conversational AI</h1>
          <div className="flex items-center space-x-2">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-green-400">Online</span>
          </div>
        </header>
        <ChatInterface />
      </div>
       <footer className="text-center p-4 text-xs text-gray-500">
          Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default App;

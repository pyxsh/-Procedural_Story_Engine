import React from 'react';
import { StoryProvider } from './context/StoryContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import StoryWorkspace from './components/workspace/StoryWorkspace';
import { ScrollIcon } from 'lucide-react';

function App() {
  return (
    <StoryProvider>
      <div className="min-h-screen bg-midnight-950 text-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4">
            <StoryWorkspace />
          </main>
        </div>
        
        {/* Welcome overlay for first-time users */}
        <div className="fixed inset-0 bg-gradient-to-br from-midnight-900/95 to-midnight-950/95 flex items-center justify-center z-50" id="welcome-overlay">
          <div className="max-w-2xl mx-auto p-8 text-center">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-story-600 text-white">
              <ScrollIcon size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-story-100">Procedural Story Engine</h1>
            <p className="text-xl md:text-2xl mb-8 text-story-200">Craft dynamic, branching narratives with characters that evolve, worlds that respond, and plots that adapt.</p>
            <button 
              className="px-8 py-3 bg-story-600 hover:bg-story-500 text-white rounded-md text-lg transition-all duration-300 shadow-lg hover:shadow-story-500/30"
              onClick={() => {
                const overlay = document.getElementById('welcome-overlay');
                if (overlay) {
                  overlay.classList.add('opacity-0');
                  setTimeout(() => {
                    overlay.style.display = 'none';
                  }, 500);
                }
              }}
            >
              Begin Your Story
            </button>
          </div>
        </div>
      </div>
    </StoryProvider>
  );
}

export default App;
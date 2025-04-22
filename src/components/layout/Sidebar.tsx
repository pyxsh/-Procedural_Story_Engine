import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { 
  BookText, 
  Sparkles, 
  Brush, 
  Github, 
  Palette, 
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

const genres = [
  { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
  { id: 'sci-fi', name: 'Science Fiction', icon: '🚀' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'romance', name: 'Romance', icon: '❤️' },
  { id: 'mystery', name: 'Mystery', icon: '🔍' },
  { id: 'thriller', name: 'Thriller', icon: '🔪' },
  { id: 'western', name: 'Western', icon: '🤠' },
  { id: 'historical', name: 'Historical', icon: '📜' }
];

const themes = [
  { id: 'redemption', name: 'Redemption', description: 'Character journey from sin to salvation' },
  { id: 'coming-of-age', name: 'Coming of Age', description: 'Growth from innocence to maturity' },
  { id: 'power-corruption', name: 'Power & Corruption', description: 'Exploration of how power changes people' },
  { id: 'survival', name: 'Survival', description: 'Overcoming overwhelming odds to survive' },
  { id: 'revenge', name: 'Revenge', description: 'Pursuit of vengeance and its consequences' },
  { id: 'love-sacrifice', name: 'Love & Sacrifice', description: 'What we give up for those we care about' },
  { id: 'human-vs-nature', name: 'Human vs. Nature', description: 'Struggle against natural forces' },
  { id: 'order-vs-chaos', name: 'Order vs. Chaos', description: 'Balance between structure and freedom' },
];

const Sidebar: React.FC = () => {
  const { state, dispatch } = useStory();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (isCollapsed) {
    return (
      <div className="w-12 bg-midnight-900 flex flex-col items-center py-4 border-r border-midnight-800">
        <button 
          className="p-2 rounded-full hover:bg-midnight-800 text-gray-400 hover:text-white mb-6"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight size={20} />
        </button>
        <div className="flex flex-col space-y-4 items-center">
          <SidebarIconButton icon={<BookText size={20} />} label="Stories" />
          <SidebarIconButton icon={<Sparkles size={20} />} label="Templates" />
          <SidebarIconButton icon={<Brush size={20} />} label="Themes" />
          <SidebarIconButton icon={<Github size={20} />} label="Resources" />
          <SidebarIconButton icon={<Palette size={20} />} label="Settings" />
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-midnight-900 flex-shrink-0 border-r border-midnight-800 overflow-y-auto">
      <div className="p-4 flex justify-between items-center border-b border-midnight-800">
        <h2 className="font-semibold text-lg">Story Options</h2>
        <button 
          className="p-1 rounded-full hover:bg-midnight-800 text-gray-400 hover:text-white"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-story-300 mb-2 flex items-center">
          <Palette size={16} className="mr-1" /> Select Genre
        </h3>
        <div className="space-y-1 mb-6">
          {genres.map(genre => (
            <button
              key={genre.id}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center text-sm ${
                state.activeGenre === genre.id 
                  ? 'bg-story-600/20 text-story-300' 
                  : 'hover:bg-midnight-800 text-gray-300 hover:text-white'
              }`}
              onClick={() => dispatch({ type: 'SET_GENRE', genre: genre.id as any })}
            >
              <span className="mr-2">{genre.icon}</span>
              {genre.name}
            </button>
          ))}
        </div>
        
        <h3 className="font-medium text-story-300 mb-2 flex items-center">
          <Lightbulb size={16} className="mr-1" /> Story Themes
        </h3>
        <div className="space-y-1 mb-6">
          {themes.slice(0, 5).map(theme => (
            <div
              key={theme.id}
              className="flex items-center px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                id={`theme-${theme.id}`}
                className="mr-2 rounded-sm"
                onChange={() => {
                  // Logic to add/remove theme
                }}
              />
              <label htmlFor={`theme-${theme.id}`} className="text-gray-300 cursor-pointer">
                {theme.name}
              </label>
            </div>
          ))}
          <button className="w-full text-left px-3 py-1 text-story-400 text-sm hover:text-story-300">
            + Show more themes
          </button>
        </div>
        
        <div className="bg-midnight-800/50 rounded-md p-3 border border-midnight-700">
          <h3 className="font-medium text-story-300 mb-2 flex items-center">
            <Sparkles size={16} className="mr-1" /> Story Template
          </h3>
          <select className="w-full bg-midnight-950 border border-midnight-600 rounded px-2 py-1 text-sm text-gray-200">
            <option>Hero's Journey</option>
            <option>Three-Act Structure</option>
            <option>Five-Act Structure</option>
            <option>Save the Cat</option>
            <option>Custom Structure</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

interface SidebarIconButtonProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarIconButton: React.FC<SidebarIconButtonProps> = ({ icon, label }) => {
  return (
    <button 
      className="p-2 rounded-full hover:bg-midnight-800 text-gray-400 hover:text-white tooltip"
      data-tooltip={label}
    >
      {icon}
    </button>
  );
};

export default Sidebar;
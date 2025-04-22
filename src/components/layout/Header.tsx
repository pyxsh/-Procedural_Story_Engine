import React from 'react';
import { useStory } from '../../context/StoryContext';
import { 
  BookOpen, 
  Users, 
  Map, 
  GitBranch, 
  Wand2, 
  Save, 
  FileDown, 
  FileUp
} from 'lucide-react';

const Header: React.FC = () => {
  const { state, dispatch } = useStory();
  
  const handleExport = () => {
    const storyData = JSON.stringify(state, null, 2);
    const blob = new Blob([storyData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-engine-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedState = JSON.parse(event.target?.result as string);
            // You might want to validate the imported data here
            Object.entries(importedState).forEach(([key, value]) => {
              if (key in state) {
                // @ts-ignore - We're dynamically accessing properties
                dispatch({ type: `SET_${key.toUpperCase()}`, [key]: value });
              }
            });
          } catch (error) {
            console.error('Failed to parse imported file:', error);
            alert('Failed to import story. The file may be corrupted.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="bg-midnight-900 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="text-story-500 mr-2" size={28} />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-white">Procedural Story Engine</h1>
          </div>
          
          <nav className="mt-3 md:mt-0">
            <ul className="flex space-x-1 md:space-x-3">
              <NavItem 
                icon={<Users size={18} />} 
                label="Characters" 
                isActive={state.currentStep === 'characters'}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', step: 'characters' })}
              />
              <NavItem 
                icon={<Map size={18} />} 
                label="World" 
                isActive={state.currentStep === 'world'}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', step: 'world' })}
              />
              <NavItem 
                icon={<GitBranch size={18} />} 
                label="Plot" 
                isActive={state.currentStep === 'plot'}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', step: 'plot' })}
              />
              <NavItem 
                icon={<Wand2 size={18} />} 
                label="Generate" 
                isActive={state.currentStep === 'generate'}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', step: 'generate' })}
              />
              <NavItem 
                icon={<BookOpen size={18} />} 
                label="View Story" 
                isActive={state.currentStep === 'view'}
                onClick={() => dispatch({ type: 'SET_CURRENT_STEP', step: 'view' })}
              />
            </ul>
          </nav>
          
          <div className="mt-3 md:mt-0 flex space-x-2">
            <button 
              className="p-2 text-sm flex items-center text-gray-300 hover:text-white hover:bg-midnight-800 rounded-md transition-colors"
              onClick={handleExport}
            >
              <FileDown size={16} className="mr-1" /> Export
            </button>
            <button 
              className="p-2 text-sm flex items-center text-gray-300 hover:text-white hover:bg-midnight-800 rounded-md transition-colors"
              onClick={handleImport}
            >
              <FileUp size={16} className="mr-1" /> Import
            </button>
            <button 
              className="p-2 text-sm flex items-center text-white bg-story-600 hover:bg-story-500 rounded-md transition-colors"
            >
              <Save size={16} className="mr-1" /> Save
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <li>
      <button 
        className={`p-2 text-sm rounded-md flex items-center transition-colors ${
          isActive 
            ? 'bg-midnight-800 text-white' 
            : 'text-gray-300 hover:text-white hover:bg-midnight-800'
        }`}
        onClick={onClick}
      >
        <span className="mr-1">{icon}</span>
        <span className="hidden md:inline">{label}</span>
      </button>
    </li>
  );
};

export default Header;
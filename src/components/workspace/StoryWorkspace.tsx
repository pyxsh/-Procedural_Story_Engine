import React from 'react';
import { useStory } from '../../context/StoryContext';
import CharacterPanel from '../story/CharacterPanel';
import WorldPanel from '../story/WorldPanel';
import PlotPanel from '../story/PlotPanel';
import StoryGenerator from '../story/StoryGenerator';
import StoryViewer from '../story/StoryViewer';

const StoryWorkspace: React.FC = () => {
  const { state } = useStory();

  return (
    <div className="bg-midnight-800/30 rounded-lg shadow-lg min-h-full border border-midnight-700 overflow-hidden">
      {state.currentStep === 'characters' && <CharacterPanel />}
      {state.currentStep === 'world' && <WorldPanel />}
      {state.currentStep === 'plot' && <PlotPanel />}
      {state.currentStep === 'generate' && <StoryGenerator />}
      {state.currentStep === 'view' && <StoryViewer />}
    </div>
  );
};

export default StoryWorkspace;
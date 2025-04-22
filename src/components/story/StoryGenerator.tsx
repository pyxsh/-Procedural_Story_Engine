import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Wand2, Sparkles, AlertTriangle } from 'lucide-react';
import { StoryNode, StoryBranch } from '../../types/storyTypes';
import { v4 as uuidv4 } from '../utils/uuid';

const StoryGenerator: React.FC = () => {
  const { state, dispatch } = useStory();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    complexity: 'medium',
    includeChoices: true,
    tonalConsistency: 'high',
    characterFocus: [] as string[],
    length: 'medium',
  });
  
  // Validation checks
  const validationIssues = [
    state.characters.length === 0 ? "No characters have been created" : null,
    state.settings.length === 0 ? "No world settings have been defined" : null,
    state.plots.length === 0 ? "No plots have been created" : null,
    !state.activeGenre ? "No genre has been selected" : null,
  ].filter(Boolean);
  
  const handleGenerationOptionsChange = (key: string, value: any) => {
    setGenerationOptions({
      ...generationOptions,
      [key]: value,
    });
  };
  
  const handleCharacterFocusToggle = (characterId: string) => {
    if (generationOptions.characterFocus.includes(characterId)) {
      handleGenerationOptionsChange(
        'characterFocus', 
        generationOptions.characterFocus.filter(id => id !== characterId)
      );
    } else {
      handleGenerationOptionsChange(
        'characterFocus',
        [...generationOptions.characterFocus, characterId]
      );
    }
  };
  
  const generateStory = () => {
    if (validationIssues.length > 0) return;
    
    setIsGenerating(true);
    
    // Simulate story generation process
    setTimeout(() => {
      const nodes: StoryNode[] = [];
      const branches: StoryBranch[] = [];
      
      // For this demo, we'll create a simplified story structure
      // In a real application, this would involve more sophisticated generation logic
      
      // Create an introduction node
      const introNode: StoryNode = {
        id: uuidv4(),
        title: 'Introduction',
        content: `The air in ${state.settings[0]?.name || 'the land'} was thick with tension. ${
          state.characters.find(c => c.role === 'protagonist')?.name || 'The hero'
        } could sense that something momentous was about to occur.`,
        characters: state.characters.filter(c => c.role === 'protagonist').map(c => c.id),
      };
      nodes.push(introNode);
      
      // Create plot-based nodes
      state.plots.forEach(plot => {
        plot.beats.forEach(beat => {
          // Select random characters for this beat
          const involvedCharacters = state.characters
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * state.characters.length) + 1)
            .map(c => c.id);
            
          const node: StoryNode = {
            id: uuidv4(),
            title: beat.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            content: beat.description,
            characters: involvedCharacters,
          };
          
          nodes.push(node);
          
          // Create branches between nodes
          if (nodes.length > 1) {
            const fromNode = nodes[nodes.length - 2];
            const toNode = nodes[nodes.length - 1];
            
            const branch: StoryBranch = {
              id: uuidv4(),
              fromNodeId: fromNode.id,
              toNodeId: toNode.id,
              condition: 'default',
              description: `Continuing from ${fromNode.title}`,
            };
            
            branches.push(branch);
          }
        });
      });
      
      // Add choices to some nodes if the option is enabled
      if (generationOptions.includeChoices) {
        const candidateNodes = nodes.filter(node => 
          !nodes.some(n => n.id !== node.id && branches.some(b => b.fromNodeId === node.id && b.toNodeId === n.id))
        );
        
        // Add choices to 2-3 random nodes
        const choiceCount = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < Math.min(choiceCount, candidateNodes.length); i++) {
          const sourceNode = candidateNodes[i];
          
          // Create 2 choice nodes
          const choice1Node: StoryNode = {
            id: uuidv4(),
            title: `Choice 1 from ${sourceNode.title}`,
            content: `Option 1: ${
              state.characters.find(c => c.role === 'protagonist')?.name || 'The hero'
            } decided to take the high road.`,
            characters: sourceNode.characters,
          };
          
          const choice2Node: StoryNode = {
            id: uuidv4(),
            title: `Choice 2 from ${sourceNode.title}`,
            content: `Option 2: ${
              state.characters.find(c => c.role === 'protagonist')?.name || 'The hero'
            } chose the path of greater resistance.`,
            characters: sourceNode.characters,
          };
          
          nodes.push(choice1Node, choice2Node);
          
          // Create branches for these choices
          const branch1: StoryBranch = {
            id: uuidv4(),
            fromNodeId: sourceNode.id,
            toNodeId: choice1Node.id,
            condition: 'choice_1',
            description: 'Take the high road',
          };
          
          const branch2: StoryBranch = {
            id: uuidv4(),
            fromNodeId: sourceNode.id,
            toNodeId: choice2Node.id,
            condition: 'choice_2',
            description: 'Choose resistance',
          };
          
          branches.push(branch1, branch2);
          
          // Add choices to the source node
          sourceNode.choices = [branch1.id, branch2.id];
        }
      }
      
      // Update the story context with generated nodes and branches
      nodes.forEach(node => {
        dispatch({ type: 'ADD_NODE', node });
      });
      
      branches.forEach(branch => {
        dispatch({ type: 'ADD_BRANCH', branch });
      });
      
      // Generate a text representation of the story
      const story = generateStoryText(nodes, branches);
      dispatch({ type: 'SET_GENERATED_STORY', story });
      
      setIsGenerating(false);
      dispatch({ type: 'SET_CURRENT_STEP', step: 'view' });
    }, 2000);
  };
  
  const generateStoryText = (nodes: StoryNode[], branches: StoryBranch[]): string => {
    // This is a simplified story generation
    // In a real application, this would be much more sophisticated
    
    let story = `# ${state.plots[0]?.title || 'The Adventure Begins'}\n\n`;
    story += `*A ${state.activeGenre} tale set in ${state.settings[0]?.name || 'a mysterious world'}*\n\n`;
    
    // Add an introduction
    story += `## Introduction\n\n`;
    
    if (state.settings[0]) {
      story += `In the world of ${state.settings[0].name}, ${state.settings[0].description}\n\n`;
    }
    
    // Add character introductions
    story += `## Characters\n\n`;
    
    state.characters.forEach(character => {
      story += `**${character.name}** - ${character.background}\n\n`;
      
      if (character.traits.length > 0) {
        story += `*Traits:* ${character.traits.map(t => t.name).join(', ')}\n\n`;
      }
      
      if (character.goals.length > 0) {
        story += `*Goals:* ${character.goals.map(g => g.description).join(', ')}\n\n`;
      }
    });
    
    // Add the main narrative
    story += `## The Story\n\n`;
    
    const linearNodes = createLinearPath(nodes, branches);
    linearNodes.forEach(node => {
      story += `### ${node.title}\n\n`;
      story += `${node.content}\n\n`;
      
      // Add character involvement
      const charactersInScene = state.characters.filter(c => node.characters.includes(c.id));
      if (charactersInScene.length > 0) {
        story += `*Present:* ${charactersInScene.map(c => c.name).join(', ')}\n\n`;
      }
      
      // Add choices if they exist
      if (node.choices && node.choices.length > 0) {
        story += `*Choices:*\n\n`;
        
        node.choices.forEach(choiceId => {
          const branch = branches.find(b => b.id === choiceId);
          if (branch) {
            story += `- ${branch.description}\n`;
          }
        });
        
        story += `\n`;
      }
    });
    
    // Add a conclusion
    story += `## Conclusion\n\n`;
    story += `And thus, the story of ${
      state.characters.find(c => c.role === 'protagonist')?.name || 'the hero'
    } in ${state.settings[0]?.name || 'this world'} continues to unfold...\n\n`;
    
    return story;
  };
  
  const createLinearPath = (nodes: StoryNode[], branches: StoryBranch[]): StoryNode[] => {
    // For simplicity, create a linear path through the story
    // In a real app, this would handle the branching structure properly
    
    if (nodes.length === 0) return [];
    
    const result: StoryNode[] = [nodes[0]]; // Start with the first node
    let currentNode = nodes[0];
    
    // Create a basic path by following "default" branches
    while (true) {
      const outgoingBranches = branches.filter(
        b => b.fromNodeId === currentNode.id && b.condition === 'default'
      );
      
      if (outgoingBranches.length === 0) break;
      
      const nextBranch = outgoingBranches[0];
      const nextNode = nodes.find(n => n.id === nextBranch.toNodeId);
      
      if (!nextNode || result.some(n => n.id === nextNode.id)) break; // Avoid cycles
      
      result.push(nextNode);
      currentNode = nextNode;
    }
    
    return result;
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-story-100">Story Generator</h2>
      </div>
      
      {validationIssues.length > 0 ? (
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="text-red-400 mr-2 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-red-300 mb-2">Missing Requirements</h3>
              <ul className="list-disc pl-5 text-red-200 space-y-1">
                {validationIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-midnight-900 rounded-lg border border-midnight-700 p-4">
          <h3 className="text-lg font-medium mb-4 text-story-200 flex items-center">
            <Wand2 size={18} className="mr-2 text-story-500" />
            Generation Options
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Story Complexity</label>
              <select
                value={generationOptions.complexity}
                onChange={(e) => handleGenerationOptionsChange('complexity', e.target.value)}
                className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              >
                <option value="low">Simple - Linear storyline with minimal branches</option>
                <option value="medium">Medium - Multiple branches with several decision points</option>
                <option value="high">Complex - Extensively branching narrative with many paths</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Story Length</label>
              <select
                value={generationOptions.length}
                onChange={(e) => handleGenerationOptionsChange('length', e.target.value)}
                className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              >
                <option value="short">Short - Brief vignette or short story</option>
                <option value="medium">Medium - Novella-length narrative</option>
                <option value="long">Long - Full novel-length story</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tonal Consistency</label>
              <select
                value={generationOptions.tonalConsistency}
                onChange={(e) => handleGenerationOptionsChange('tonalConsistency', e.target.value)}
                className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              >
                <option value="low">Varied - Dramatic shifts in tone throughout the story</option>
                <option value="medium">Moderate - Some tonal variation while maintaining coherence</option>
                <option value="high">Consistent - Uniform tone throughout the narrative</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeChoices"
                checked={generationOptions.includeChoices}
                onChange={(e) => handleGenerationOptionsChange('includeChoices', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeChoices" className="text-sm text-gray-300">
                Include choice points (for interactive stories)
              </label>
            </div>
            
            {state.characters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Character Focus</label>
                <p className="text-xs text-gray-500 mb-2">
                  Select characters to emphasize in the story (leave empty to include all equally)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {state.characters.map(character => (
                    <div key={character.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`char-${character.id}`}
                        checked={generationOptions.characterFocus.includes(character.id)}
                        onChange={() => handleCharacterFocusToggle(character.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`char-${character.id}`} className="text-sm text-gray-300">
                        {character.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-midnight-900 rounded-lg border border-midnight-700 p-4">
          <h3 className="text-lg font-medium mb-4 text-story-200 flex items-center">
            <Sparkles size={18} className="mr-2 text-story-500" />
            Story Preview
          </h3>
          
          <div className="space-y-4">
            {state.characters.length > 0 && state.settings.length > 0 && state.plots.length > 0 ? (
              <>
                <div className="bg-midnight-950/50 rounded-lg p-4 border border-midnight-800">
                  <h4 className="font-medium mb-2">Story Elements Summary</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Genre:</span> {state.activeGenre || 'Not selected'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Setting:</span> {state.settings[0]?.name || 'None'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Main Plot:</span> {state.plots[0]?.title || 'None'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Protagonist:</span> {
                          state.characters.find(c => c.role === 'protagonist')?.name || 'None'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Antagonist:</span> {
                          state.characters.find(c => c.role === 'antagonist')?.name || 'None'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Characters:</span> {state.characters.length}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">
                        <span className="text-story-400">Plot Points:</span> {
                          state.plots.reduce((sum, plot) => sum + plot.beats.length, 0)
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    className={`px-6 py-3 bg-story-600 hover:bg-story-500 text-white rounded-md flex items-center justify-center mx-auto transition-all duration-300 ${
                      isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    onClick={generateStory}
                    disabled={isGenerating || validationIssues.length > 0}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating Story...
                      </>
                    ) : (
                      <>
                        <Wand2 size={18} className="mr-2" /> Generate Story
                      </>
                    )}
                  </button>
                  
                  {isGenerating && (
                    <div className="mt-4 text-sm text-gray-400">
                      <p>Weaving narrative elements together...</p>
                      <div className="w-full bg-midnight-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-story-600 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-midnight-950/30 rounded border border-dashed border-midnight-800">
                <Sparkles size={28} className="mx-auto text-gray-600 mb-2" />
                <p className="text-gray-400">Complete previous steps to generate a story</p>
                <p className="text-sm text-gray-500 mt-1">
                  Create characters, world, and plot elements before generating
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
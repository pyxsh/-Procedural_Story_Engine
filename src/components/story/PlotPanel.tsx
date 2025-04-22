import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { 
  GitBranch, 
  Plus, 
  BookText, 
  Edit2, 
  Trash2, 
  FilePlus,
  Send
} from 'lucide-react';
import { Plot, StoryBeat } from '../../types/storyTypes';
import { v4 as uuidv4 } from '../utils/uuid';

const plotArcs = [
  { id: 'rags_to_riches', name: 'Rags to Riches', description: 'A character rises from poverty or obscurity to success and recognition' },
  { id: 'tragedy', name: 'Tragedy', description: 'A character falls from a position of status, often due to a fatal flaw' },
  { id: 'rebirth', name: 'Rebirth', description: 'A character undergoes a transformative experience that changes them for the better' },
  { id: 'overcoming_monster', name: 'Overcoming the Monster', description: 'A hero confronts and defeats a threatening force (monster, villain, etc.)' },
  { id: 'quest', name: 'The Quest', description: 'A hero journeys to obtain an object or reach a location, facing challenges along the way' },
  { id: 'voyage_return', name: 'Voyage and Return', description: 'A protagonist goes to a strange land, faces challenges, and returns changed' },
];

const storyBeatTypes = [
  { id: 'inciting_incident', name: 'Inciting Incident', description: 'The event that sets the story in motion' },
  { id: 'rising_action', name: 'Rising Action', description: 'Complications and obstacles that build tension' },
  { id: 'climax', name: 'Climax', description: 'The highest point of tension and turning point of the story' },
  { id: 'falling_action', name: 'Falling Action', description: 'Events following the climax, leading to resolution' },
  { id: 'resolution', name: 'Resolution', description: 'The conclusion that ties up story threads' },
];

const PlotPanel: React.FC = () => {
  const { state, dispatch } = useStory();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);
  
  const createEmptyPlot = (): Plot => ({
    id: uuidv4(),
    title: '',
    arc: 'quest',
    beats: [],
    description: '',
  });
  
  const [plotData, setPlotData] = useState<Plot>(createEmptyPlot());
  const [newBeat, setNewBeat] = useState<StoryBeat>({
    id: uuidv4(),
    type: 'inciting_incident',
    description: '',
  });
  
  const handleAddBeat = () => {
    if (newBeat.description.trim()) {
      setPlotData({
        ...plotData,
        beats: [...plotData.beats, { ...newBeat, id: uuidv4() }]
      });
      setNewBeat({
        id: uuidv4(),
        type: 'rising_action', // Default to rising action after first beat
        description: '',
      });
    }
  };
  
  const handleRemoveBeat = (id: string) => {
    setPlotData({
      ...plotData,
      beats: plotData.beats.filter(beat => beat.id !== id)
    });
  };
  
  const handleSavePlot = () => {
    if (plotData.title.trim() && plotData.beats.length > 0) {
      if (editingPlotId) {
        dispatch({ type: 'UPDATE_PLOT', id: editingPlotId, updates: plotData });
      } else {
        dispatch({ type: 'ADD_PLOT', plot: plotData });
      }
      setPlotData(createEmptyPlot());
      setIsCreating(false);
      setEditingPlotId(null);
    }
  };
  
  const handleEditPlot = (plot: Plot) => {
    setPlotData(plot);
    setEditingPlotId(plot.id);
    setIsCreating(true);
  };
  
  const handleDeletePlot = (id: string) => {
    dispatch({ type: 'REMOVE_PLOT', id });
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-story-100">Plot Development</h2>
        <button 
          className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md flex items-center transition-colors"
          onClick={() => {
            setPlotData(createEmptyPlot());
            setEditingPlotId(null);
            setIsCreating(true);
          }}
        >
          <Plus size={16} className="mr-1" /> New Plot
        </button>
      </div>
      
      {state.plots.length === 0 && !isCreating ? (
        <div className="text-center py-10">
          <div className="bg-midnight-900/50 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
            <GitBranch size={32} className="text-story-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Plots Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-4">
            Create narrative arcs with key story beats to form the backbone of your story.
          </p>
          <button 
            className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md inline-flex items-center transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <FilePlus size={16} className="mr-1" /> Create First Plot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {isCreating && (
            <div className="bg-midnight-900 rounded-lg border border-midnight-700 p-4">
              <h3 className="text-xl font-medium mb-4 border-b border-midnight-700 pb-2">
                {editingPlotId ? 'Edit Plot' : 'Create New Plot'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Plot Title</label>
                    <input
                      type="text"
                      value={plotData.title}
                      onChange={(e) => setPlotData({ ...plotData, title: e.target.value })}
                      className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
                      placeholder="e.g., The Fall of Ironhaven"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Plot Arc</label>
                    <select
                      value={plotData.arc}
                      onChange={(e) => setPlotData({ ...plotData, arc: e.target.value as any })}
                      className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
                    >
                      {plotArcs.map(arc => (
                        <option key={arc.id} value={arc.id}>{arc.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {plotArcs.find(arc => arc.id === plotData.arc)?.description}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Plot Description</label>
                  <textarea
                    value={plotData.description}
                    onChange={(e) => setPlotData({ ...plotData, description: e.target.value })}
                    className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white h-20"
                    placeholder="Describe the overall plot, character arcs, and themes"
                  />
                </div>
                
                <div className="border-t border-midnight-700 pt-4">
                  <h4 className="text-md font-medium mb-3">Story Beats</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                    <div className="md:col-span-1">
                      <select
                        value={newBeat.type}
                        onChange={(e) => setNewBeat({ ...newBeat, type: e.target.value as any })}
                        className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white text-sm"
                      >
                        {storyBeatTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-3 flex">
                      <input
                        type="text"
                        value={newBeat.description}
                        onChange={(e) => setNewBeat({ ...newBeat, description: e.target.value })}
                        placeholder="Describe this story beat"
                        className="flex-1 bg-midnight-950 border border-midnight-700 rounded-l p-2 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddBeat()}
                      />
                      <button 
                        type="button"
                        onClick={handleAddBeat}
                        className="px-3 py-2 bg-story-700 hover:bg-story-600 text-white rounded-r flex items-center"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    {storyBeatTypes.find(type => type.id === newBeat.type)?.description}
                  </div>
                  
                  {plotData.beats.length > 0 ? (
                    <div className="relative">
                      {/* Vertical timeline line */}
                      <div className="absolute top-0 bottom-0 left-[1.25rem] w-0.5 bg-midnight-700"></div>
                      
                      <div className="space-y-4">
                        {plotData.beats.map((beat, index) => (
                          <div key={beat.id} className="relative pl-10">
                            {/* Timeline node */}
                            <div className="absolute left-0 w-6 h-6 rounded-full bg-midnight-800 border-2 border-story-600 flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            
                            <div className="bg-midnight-800 rounded p-3 ml-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-story-300">
                                  {storyBeatTypes.find(type => type.id === beat.type)?.name}
                                </span>
                                <button 
                                  onClick={() => handleRemoveBeat(beat.id)}
                                  className="text-gray-500 hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <p className="text-gray-300 mt-1">{beat.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-midnight-950/30 rounded border border-dashed border-midnight-800">
                      <BookText size={24} className="mx-auto text-gray-600 mb-2" />
                      <p className="text-gray-500">No story beats added yet</p>
                      <p className="text-sm text-gray-600 mt-1">Add key moments to build your plot</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-2 border-t border-midnight-700 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setPlotData(createEmptyPlot());
                      setEditingPlotId(null);
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-midnight-700 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePlot}
                    disabled={!plotData.title.trim() || plotData.beats.length === 0}
                    className={`px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md transition-colors ${
                      (!plotData.title.trim() || plotData.beats.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {editingPlotId ? 'Update Plot' : 'Save Plot'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {state.plots.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Your Plots</h3>
              
              {state.plots.map(plot => (
                <div 
                  key={plot.id} 
                  className="bg-midnight-900 rounded-lg border border-midnight-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-midnight-700 flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium text-story-100">{plot.title}</h4>
                      <span className="text-sm text-gray-400">
                        {plotArcs.find(arc => arc.id === plot.arc)?.name} • {plot.beats.length} beats
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPlot(plot)}
                        className="p-1 text-gray-400 hover:text-story-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePlot(plot.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-midnight-950/50">
                    {plot.description && (
                      <p className="text-gray-400 mb-4">{plot.description}</p>
                    )}
                    
                    <div className="relative">
                      {/* Vertical timeline line */}
                      <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-midnight-700"></div>
                      
                      <div className="space-y-4 pl-10">
                        {plot.beats.map((beat, index) => (
                          <div key={beat.id} className="relative">
                            {/* Timeline node */}
                            <div className="absolute left-[-1.5rem] top-0 w-5 h-5 rounded-full bg-midnight-800 border border-story-600"></div>
                            
                            <div>
                              <span className="text-sm font-medium text-story-300 block">
                                {storyBeatTypes.find(type => type.id === beat.type)?.name}
                              </span>
                              <p className="text-gray-400 text-sm">{beat.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlotPanel;
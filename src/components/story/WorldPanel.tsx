import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Map, Plus, GlobeIcon, Edit2, Trash2, Mountain as Mountains, Building, Trees as Tree } from 'lucide-react';
import { Setting } from '../../types/storyTypes';
import { v4 as uuidv4 } from '../utils/uuid';

interface LocationFormData {
  id: string;
  name: string;
  description: string;
}

const WorldPanel: React.FC = () => {
  const { state, dispatch } = useStory();
  const [settingData, setSettingData] = useState<Setting>({
    id: uuidv4(),
    name: '',
    description: '',
    rules: [],
    locations: [],
  });
  const [newRule, setNewRule] = useState('');
  const [newLocation, setNewLocation] = useState<LocationFormData>({ 
    id: uuidv4(), 
    name: '', 
    description: '',
  });
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  
  const handleAddRule = () => {
    if (newRule.trim()) {
      setSettingData({
        ...settingData,
        rules: [...settingData.rules, newRule.trim()]
      });
      setNewRule('');
    }
  };
  
  const handleRemoveRule = (index: number) => {
    setSettingData({
      ...settingData,
      rules: settingData.rules.filter((_, i) => i !== index)
    });
  };
  
  const handleAddLocation = () => {
    if (newLocation.name.trim()) {
      setSettingData({
        ...settingData,
        locations: [...settingData.locations, { ...newLocation }]
      });
      setNewLocation({ id: uuidv4(), name: '', description: '' });
    }
  };
  
  const handleEditLocation = (location: LocationFormData) => {
    setNewLocation(location);
    setEditingLocationId(location.id);
  };
  
  const handleUpdateLocation = () => {
    if (editingLocationId && newLocation.name.trim()) {
      setSettingData({
        ...settingData,
        locations: settingData.locations.map(loc => 
          loc.id === editingLocationId ? { ...newLocation } : loc
        )
      });
      setNewLocation({ id: uuidv4(), name: '', description: '' });
      setEditingLocationId(null);
    }
  };
  
  const handleRemoveLocation = (id: string) => {
    setSettingData({
      ...settingData,
      locations: settingData.locations.filter(loc => loc.id !== id)
    });
  };
  
  const handleSaveSetting = () => {
    if (settingData.name.trim()) {
      dispatch({ type: 'SET_SETTING', setting: settingData });
      // After saving, we could reset the form or keep it for editing
    }
  };
  
  const getRandomLocationIcon = () => {
    const icons = [<Mountains size={16} />, <Building size={16} />, <Tree size={16} />];
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-story-100">World Building</h2>
        <button 
          className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md flex items-center transition-colors"
          onClick={handleSaveSetting}
          disabled={!settingData.name.trim()}
        >
          <Plus size={16} className="mr-1" /> Save World
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-midnight-900 rounded-lg border border-midnight-700 p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center text-story-200">
            <GlobeIcon size={18} className="mr-2 text-story-500" />
            World Setting
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">World Name</label>
              <input
                type="text"
                value={settingData.name}
                onChange={(e) => setSettingData({ ...settingData, name: e.target.value })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
                placeholder="e.g., Ironhaven, New Terra, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={settingData.description}
                onChange={(e) => setSettingData({ ...settingData, description: e.target.value })}
                className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white h-32"
                placeholder="Describe your world, its history, dominant cultures, technology, magic, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">World Rules</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="flex-1 bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
                  placeholder="e.g., Magic requires a physical toll, Faster-than-light travel is possible"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                />
                <button 
                  type="button"
                  onClick={handleAddRule}
                  className="px-3 py-2 bg-story-700 hover:bg-story-600 text-white rounded"
                >
                  Add
                </button>
              </div>
              
              {settingData.rules.length > 0 ? (
                <ul className="bg-midnight-950/50 rounded p-2 space-y-2">
                  {settingData.rules.map((rule, index) => (
                    <li key={index} className="flex justify-between items-center text-sm text-gray-300 p-2 border-b border-midnight-800 last:border-0">
                      <span>{rule}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveRule(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No world rules defined yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-midnight-900 rounded-lg border border-midnight-700 p-4">
          <h3 className="text-lg font-medium mb-4 flex items-center text-story-200">
            <Map size={18} className="mr-2 text-story-500" />
            Locations
          </h3>
          
          <div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {editingLocationId ? 'Update Location' : 'Add Location'}
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white mb-2"
                  placeholder="Location name"
                />
                <textarea
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                  className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white h-20"
                  placeholder="Describe this location, its significance, and any notable features"
                />
              </div>
              
              <div className="flex justify-end">
                {editingLocationId ? (
                  <div className="space-x-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setNewLocation({ id: uuidv4(), name: '', description: '' });
                        setEditingLocationId(null);
                      }}
                      className="px-3 py-1 text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleUpdateLocation}
                      className="px-3 py-1 bg-story-700 hover:bg-story-600 text-white rounded"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={handleAddLocation}
                    className="px-3 py-1 bg-story-700 hover:bg-story-600 text-white rounded"
                  >
                    Add Location
                  </button>
                )}
              </div>
            </div>
            
            <div className="border-t border-midnight-700 pt-4">
              <h4 className="text-md font-medium mb-2 text-gray-300">Location Map</h4>
              
              {settingData.locations.length > 0 ? (
                <div className="bg-midnight-950/50 p-2 rounded space-y-2">
                  {settingData.locations.map(location => (
                    <div 
                      key={location.id} 
                      className="p-3 border border-midnight-700 rounded bg-midnight-800/50 hover:bg-midnight-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <span className="p-2 bg-story-900/60 rounded-full mr-2 text-story-400">
                            {getRandomLocationIcon()}
                          </span>
                          <h5 className="font-medium">{location.name}</h5>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditLocation(location)}
                            className="p-1 text-gray-400 hover:text-story-300"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleRemoveLocation(location.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {location.description && (
                        <p className="mt-2 text-sm text-gray-400 pl-10">
                          {location.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-midnight-950/30 rounded border border-dashed border-midnight-800">
                  <Map size={28} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-500">No locations added yet</p>
                  <p className="text-sm text-gray-600 mt-1">Add key locations to your world</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* World preview */}
      {settingData.name && (
        <div className="mt-6 p-4 bg-story-900/10 border border-story-900/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-story-300">World Preview</h3>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mb-2 text-gray-300">
              <strong className="text-story-300">{settingData.name}</strong> - {settingData.description}
            </p>
            
            {settingData.rules.length > 0 && (
              <div className="mb-2">
                <p className="font-medium text-gray-300">World Rules:</p>
                <ul className="list-disc pl-5 text-gray-400">
                  {settingData.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {settingData.locations.length > 0 && (
              <div>
                <p className="font-medium text-gray-300">Notable Locations:</p>
                <ul className="list-disc pl-5 text-gray-400">
                  {settingData.locations.map(location => (
                    <li key={location.id}>
                      <strong>{location.name}</strong>: {location.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldPanel;
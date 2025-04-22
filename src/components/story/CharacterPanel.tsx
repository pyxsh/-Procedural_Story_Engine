import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Plus, User, Edit2, Trash2, UserPlus, Heart, Frown, Target } from 'lucide-react';
import { Character, Trait, Goal, Flaw } from '../../types/storyTypes';
import { v4 as uuidv4 } from '../utils/uuid';

const archetypes = [
  'Hero', 'Mentor', 'Ally', 'Herald', 'Trickster', 'Shapeshifter', 
  'Guardian', 'Shadow', 'Innocent', 'Orphan', 'Warrior', 'Caregiver',
  'Explorer', 'Creator', 'Ruler', 'Magician', 'Lover', 'Sage', 'Jester'
];

const CharacterPanel: React.FC = () => {
  const { state, dispatch } = useStory();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  
  const handleCreateCharacter = (character: Character) => {
    dispatch({ type: 'ADD_CHARACTER', character });
    setIsCreating(false);
  };
  
  const handleUpdateCharacter = (id: string, updates: Partial<Character>) => {
    dispatch({ type: 'UPDATE_CHARACTER', id, updates });
    setEditingCharacterId(null);
  };
  
  const handleDeleteCharacter = (id: string) => {
    dispatch({ type: 'REMOVE_CHARACTER', id });
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-story-100">Character Creation</h2>
        <button 
          className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md flex items-center transition-colors"
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} className="mr-1" /> New Character
        </button>
      </div>
      
      {state.characters.length === 0 && !isCreating ? (
        <div className="text-center py-10">
          <div className="bg-midnight-900/50 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
            <User size={32} className="text-story-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Characters Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-4">
            Create characters with distinct traits, goals, and flaws to populate your story.
          </p>
          <button 
            className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md inline-flex items-center transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <UserPlus size={16} className="mr-1" /> Create First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isCreating && (
            <CharacterForm 
              onSubmit={handleCreateCharacter}
              onCancel={() => setIsCreating(false)}
            />
          )}
          
          {state.characters.map(character => (
            editingCharacterId === character.id ? (
              <CharacterForm 
                key={character.id}
                initialCharacter={character}
                onSubmit={(updatedCharacter) => handleUpdateCharacter(character.id, updatedCharacter)}
                onCancel={() => setEditingCharacterId(null)}
              />
            ) : (
              <CharacterCard 
                key={character.id}
                character={character}
                onEdit={() => setEditingCharacterId(character.id)}
                onDelete={() => handleDeleteCharacter(character.id)}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

interface CharacterFormProps {
  initialCharacter?: Character;
  onSubmit: (character: Character) => void;
  onCancel: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ initialCharacter, onSubmit, onCancel }) => {
  const [character, setCharacter] = useState<Character>(
    initialCharacter || {
      id: uuidv4(),
      name: '',
      role: 'protagonist',
      archetype: '',
      traits: [],
      goals: [],
      flaws: [],
      relationships: [],
      background: ''
    }
  );
  
  const [newTrait, setNewTrait] = useState({ name: '', level: 'medium' as const });
  const [newGoal, setNewGoal] = useState({ description: '', motivation: '', urgency: 'medium' as const });
  const [newFlaw, setNewFlaw] = useState({ description: '', severity: 'medium' as const, impact: '' });
  
  const handleAddTrait = () => {
    if (newTrait.name.trim()) {
      setCharacter({
        ...character,
        traits: [...character.traits, { id: uuidv4(), ...newTrait }]
      });
      setNewTrait({ name: '', level: 'medium' });
    }
  };
  
  const handleAddGoal = () => {
    if (newGoal.description.trim()) {
      setCharacter({
        ...character,
        goals: [...character.goals, { id: uuidv4(), ...newGoal }]
      });
      setNewGoal({ description: '', motivation: '', urgency: 'medium' });
    }
  };
  
  const handleAddFlaw = () => {
    if (newFlaw.description.trim()) {
      setCharacter({
        ...character,
        flaws: [...character.flaws, { id: uuidv4(), ...newFlaw }]
      });
      setNewFlaw({ description: '', severity: 'medium', impact: '' });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(character);
  };
  
  return (
    <div className="bg-midnight-900 rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3 border border-midnight-700">
      <h3 className="text-xl font-medium mb-4 border-b border-midnight-700 pb-2">
        {initialCharacter ? 'Edit Character' : 'Create New Character'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              value={character.role}
              onChange={(e) => setCharacter({ ...character, role: e.target.value as any })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            >
              <option value="protagonist">Protagonist</option>
              <option value="antagonist">Antagonist</option>
              <option value="supporting">Supporting</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Archetype</label>
            <select
              value={character.archetype}
              onChange={(e) => setCharacter({ ...character, archetype: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            >
              <option value="">Select an Archetype</option>
              {archetypes.map(archetype => (
                <option key={archetype} value={archetype}>{archetype}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Background</label>
            <textarea
              value={character.background}
              onChange={(e) => setCharacter({ ...character, background: e.target.value })}
              className="w-full bg-midnight-950 border border-midnight-700 rounded p-2 text-white h-20"
            />
          </div>
        </div>
        
        <div className="border-t border-midnight-700 pt-4 mt-4">
          <h4 className="text-md font-medium flex items-center mb-2">
            <Heart size={16} className="mr-1 text-story-500" /> Character Traits
          </h4>
          
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTrait.name}
                onChange={(e) => setNewTrait({ ...newTrait, name: e.target.value })}
                placeholder="Trait name (e.g., Brave, Cunning)"
                className="flex-1 bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              />
              <select
                value={newTrait.level}
                onChange={(e) => setNewTrait({ ...newTrait, level: e.target.value as any })}
                className="bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button 
                type="button"
                onClick={handleAddTrait}
                className="px-3 py-2 bg-story-700 hover:bg-story-600 text-white rounded"
              >
                Add
              </button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {character.traits.map((trait) => (
                <div key={trait.id} className="bg-midnight-700 px-3 py-1 rounded-full text-sm flex items-center">
                  {trait.name}
                  <span className={`ml-1 h-2 w-2 rounded-full ${
                    trait.level === 'high' ? 'bg-green-500' : 
                    trait.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <button 
                    type="button"
                    onClick={() => setCharacter({
                      ...character,
                      traits: character.traits.filter(t => t.id !== trait.id)
                    })}
                    className="ml-2 text-gray-400 hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-midnight-700 pt-4">
          <h4 className="text-md font-medium flex items-center mb-2">
            <Target size={16} className="mr-1 text-story-500" /> Character Goals
          </h4>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Goal description"
              className="bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            />
            <input
              type="text"
              value={newGoal.motivation}
              onChange={(e) => setNewGoal({ ...newGoal, motivation: e.target.value })}
              placeholder="Motivation"
              className="bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            />
            <div className="flex">
              <select
                value={newGoal.urgency}
                onChange={(e) => setNewGoal({ ...newGoal, urgency: e.target.value as any })}
                className="bg-midnight-950 border border-midnight-700 rounded-l p-2 text-white flex-1"
              >
                <option value="low">Low Urgency</option>
                <option value="medium">Medium Urgency</option>
                <option value="high">High Urgency</option>
              </select>
              <button 
                type="button"
                onClick={handleAddGoal}
                className="px-3 py-2 bg-story-700 hover:bg-story-600 text-white rounded-r"
              >
                Add
              </button>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              {character.goals.length > 0 ? (
                <div className="bg-midnight-800 rounded p-2 mt-2">
                  {character.goals.map((goal) => (
                    <div key={goal.id} className="border-b border-midnight-700 last:border-0 py-2 flex justify-between">
                      <div>
                        <div className="font-medium">{goal.description}</div>
                        <div className="text-sm text-gray-400">Motivation: {goal.motivation}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-0.5 rounded-full ${
                            goal.urgency === 'high' ? 'bg-red-900/50 text-red-300' : 
                            goal.urgency === 'medium' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {goal.urgency} urgency
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setCharacter({
                          ...character,
                          goals: character.goals.filter(g => g.id !== goal.id)
                        })}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="border-t border-midnight-700 pt-4">
          <h4 className="text-md font-medium flex items-center mb-2">
            <Frown size={16} className="mr-1 text-story-500" /> Character Flaws
          </h4>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newFlaw.description}
              onChange={(e) => setNewFlaw({ ...newFlaw, description: e.target.value })}
              placeholder="Flaw description"
              className="bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            />
            <input
              type="text"
              value={newFlaw.impact}
              onChange={(e) => setNewFlaw({ ...newFlaw, impact: e.target.value })}
              placeholder="Impact on story"
              className="bg-midnight-950 border border-midnight-700 rounded p-2 text-white"
            />
            <div className="flex">
              <select
                value={newFlaw.severity}
                onChange={(e) => setNewFlaw({ ...newFlaw, severity: e.target.value as any })}
                className="bg-midnight-950 border border-midnight-700 rounded-l p-2 text-white flex-1"
              >
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
              </select>
              <button 
                type="button"
                onClick={handleAddFlaw}
                className="px-3 py-2 bg-story-700 hover:bg-story-600 text-white rounded-r"
              >
                Add
              </button>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              {character.flaws.length > 0 ? (
                <div className="bg-midnight-800 rounded p-2 mt-2">
                  {character.flaws.map((flaw) => (
                    <div key={flaw.id} className="border-b border-midnight-700 last:border-0 py-2 flex justify-between">
                      <div>
                        <div className="font-medium">{flaw.description}</div>
                        <div className="text-sm text-gray-400">Impact: {flaw.impact}</div>
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-0.5 rounded-full ${
                            flaw.severity === 'high' ? 'bg-red-900/50 text-red-300' : 
                            flaw.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {flaw.severity} severity
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setCharacter({
                          ...character,
                          flaws: character.flaws.filter(f => f.id !== flaw.id)
                        })}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2 border-t border-midnight-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-midnight-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md transition-colors"
          >
            {initialCharacter ? 'Update Character' : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface CharacterCardProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const roleColor = {
    protagonist: 'bg-blue-900/50 text-blue-300',
    antagonist: 'bg-red-900/50 text-red-300',
    supporting: 'bg-purple-900/50 text-purple-300',
    mentor: 'bg-green-900/50 text-green-300',
  }[character.role];
  
  return (
    <div className="bg-midnight-900 rounded-lg border border-midnight-700 overflow-hidden transition-all duration-300">
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-story-100">{character.name}</h3>
          <div className="flex space-x-1">
            <button 
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-story-300"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex mt-2 space-x-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${roleColor}`}>
            {character.role.charAt(0).toUpperCase() + character.role.slice(1)}
          </span>
          {character.archetype && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-midnight-700 text-gray-300">
              {character.archetype}
            </span>
          )}
        </div>
        
        {character.background && (
          <p className="mt-2 text-sm text-gray-400">
            {character.background.length > 100 && !isExpanded
              ? `${character.background.substring(0, 100)}...`
              : character.background}
          </p>
        )}
        
        <div className="mt-3">
          <button 
            className="text-sm text-story-400 hover:text-story-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-midnight-950 border-t border-midnight-700 p-4">
          {character.traits.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Traits</h4>
              <div className="flex flex-wrap gap-1">
                {character.traits.map(trait => (
                  <span key={trait.id} className="px-2 py-0.5 text-xs rounded-full bg-midnight-700 flex items-center">
                    {trait.name}
                    <span className={`ml-1 h-2 w-2 rounded-full ${
                      trait.level === 'high' ? 'bg-green-500' : 
                      trait.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {character.goals.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Goals</h4>
              <ul className="text-sm space-y-1">
                {character.goals.map(goal => (
                  <li key={goal.id} className="text-gray-400">
                    {goal.description} <span className="text-xs text-story-400">({goal.motivation})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {character.flaws.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Flaws</h4>
              <ul className="text-sm space-y-1">
                {character.flaws.map(flaw => (
                  <li key={flaw.id} className="text-gray-400">
                    {flaw.description} <span className="text-xs text-story-400">({flaw.impact})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterPanel;
// Basic Types
export type TraitLevel = 'low' | 'medium' | 'high';

export type Trait = {
  id: string;
  name: string;
  level: TraitLevel;
};

export type Goal = {
  id: string;
  description: string;
  motivation: string;
  urgency: TraitLevel;
};

export type Flaw = {
  id: string;
  description: string;
  severity: TraitLevel;
  impact: string;
};

export type Relationship = {
  id: string;
  targetCharacterId: string;
  type: 'ally' | 'enemy' | 'neutral' | 'family' | 'romantic';
  strength: TraitLevel;
  description: string;
};

// Character System
export type Character = {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'mentor';
  archetype: string;
  traits: Trait[];
  goals: Goal[];
  flaws: Flaw[];
  relationships: Relationship[];
  background: string;
};

// World & Theme
export type Setting = {
  id: string;
  name: string;
  description: string;
  rules: string[];
  locations: {
    id: string;
    name: string;
    description: string;
  }[];
};

export type StoryTheme = {
  id: string;
  name: string;
  description: string;
  mood: 'dark' | 'uplifting' | 'melancholic' | 'hopeful' | 'tense';
};

export type Genre = 
  | 'fantasy' 
  | 'sci-fi' 
  | 'horror' 
  | 'romance' 
  | 'mystery' 
  | 'thriller' 
  | 'western' 
  | 'historical';

// Plot Generation
export type StoryBeat = {
  id: string;
  type: 'inciting_incident' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  description: string;
};

export type Plot = {
  id: string;
  title: string;
  arc: 'rags_to_riches' | 'tragedy' | 'rebirth' | 'overcoming_monster' | 'quest' | 'voyage_return';
  beats: StoryBeat[];
  description: string;
};

export type StoryEvent = {
  id: string;
  description: string;
  characters: string[]; // Character IDs involved
  location: string;
  consequences: string[];
};

// Story Structure
export type StoryNode = {
  id: string;
  title: string;
  content: string;
  characters: string[]; // Character IDs involved
  choices?: string[]; // IDs of branches from this node
};

export type StoryBranch = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  condition: string;
  description: string;
};

// Final Story Output
export type GeneratedStory = {
  title: string;
  genre: Genre;
  themes: StoryTheme[];
  characters: Character[];
  setting: Setting;
  nodes: StoryNode[];
  branches: StoryBranch[];
};
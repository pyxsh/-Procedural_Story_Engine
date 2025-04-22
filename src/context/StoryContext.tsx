import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Character, 
  Plot, 
  Setting, 
  StoryTheme, 
  StoryNode,
  StoryBranch,
  Genre,
  StoryEvent
} from '../types/storyTypes';

interface StoryState {
  characters: Character[];
  plots: Plot[];
  settings: Setting[];
  themes: StoryTheme[];
  nodes: StoryNode[];
  branches: StoryBranch[];
  events: StoryEvent[];
  activeGenre: Genre | null;
  generatedStory: string | null;
  currentStep: 'characters' | 'world' | 'plot' | 'generate' | 'view';
}

type StoryAction = 
  | { type: 'ADD_CHARACTER'; character: Character }
  | { type: 'UPDATE_CHARACTER'; id: string; updates: Partial<Character> }
  | { type: 'REMOVE_CHARACTER'; id: string }
  | { type: 'ADD_PLOT'; plot: Plot }
  | { type: 'UPDATE_PLOT'; id: string; updates: Partial<Plot> }
  | { type: 'REMOVE_PLOT'; id: string }
  | { type: 'SET_SETTING'; setting: Setting }
  | { type: 'ADD_THEME'; theme: StoryTheme }
  | { type: 'REMOVE_THEME'; id: string }
  | { type: 'SET_GENRE'; genre: Genre }
  | { type: 'ADD_NODE'; node: StoryNode }
  | { type: 'ADD_BRANCH'; branch: StoryBranch }
  | { type: 'SET_GENERATED_STORY'; story: string }
  | { type: 'SET_CURRENT_STEP'; step: StoryState['currentStep'] }
  | { type: 'RESET_STORY' };

const initialState: StoryState = {
  characters: [],
  plots: [],
  settings: [],
  themes: [],
  nodes: [],
  branches: [],
  events: [],
  activeGenre: null,
  generatedStory: null,
  currentStep: 'characters',
};

function storyReducer(state: StoryState, action: StoryAction): StoryState {
  switch (action.type) {
    case 'ADD_CHARACTER':
      return { ...state, characters: [...state.characters, action.character] };
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char => 
          char.id === action.id ? { ...char, ...action.updates } : char
        )
      };
    case 'REMOVE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(char => char.id !== action.id)
      };
    case 'ADD_PLOT':
      return { ...state, plots: [...state.plots, action.plot] };
    case 'UPDATE_PLOT':
      return {
        ...state,
        plots: state.plots.map(plot => 
          plot.id === action.id ? { ...plot, ...action.updates } : plot
        )
      };
    case 'REMOVE_PLOT':
      return {
        ...state,
        plots: state.plots.filter(plot => plot.id !== action.id)
      };
    case 'SET_SETTING':
      return { ...state, settings: [...state.settings, action.setting] };
    case 'ADD_THEME':
      return { ...state, themes: [...state.themes, action.theme] };
    case 'REMOVE_THEME':
      return {
        ...state,
        themes: state.themes.filter(theme => theme.id !== action.id)
      };
    case 'SET_GENRE':
      return { ...state, activeGenre: action.genre };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.node] };
    case 'ADD_BRANCH':
      return { ...state, branches: [...state.branches, action.branch] };
    case 'SET_GENERATED_STORY':
      return { ...state, generatedStory: action.story };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.step };
    case 'RESET_STORY':
      return initialState;
    default:
      return state;
  }
}

interface StoryContextType {
  state: StoryState;
  dispatch: React.Dispatch<StoryAction>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storyReducer, initialState);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      {children}
    </StoryContext.Provider>
  );
}
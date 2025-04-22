import React, { useState, useEffect } from 'react';
import { useStory } from '../../context/StoryContext';
import { Book, Download, Copy, Share2, FileText, GitBranch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const StoryViewer: React.FC = () => {
  const { state } = useStory();
  const [viewMode, setViewMode] = useState<'text' | 'graph'>('text');
  const [graphLoaded, setGraphLoaded] = useState(false);
  
  // Mock function for rendering the graph
  // In a real application, this would use a graph visualization library like D3 or Vis.js
  useEffect(() => {
    if (viewMode === 'graph' && state.nodes.length > 0 && !graphLoaded) {
      setTimeout(() => {
        const graphContainer = document.getElementById('story-graph-container');
        if (graphContainer) {
          renderMockGraph(graphContainer);
          setGraphLoaded(true);
        }
      }, 500);
    }
  }, [viewMode, state.nodes, graphLoaded]);
  
  const renderMockGraph = (container: HTMLElement) => {
    // In a real app, this would be replaced with actual graph rendering code
    // This is just a placeholder to demonstrate the UI concept
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.style.overflow = 'visible';
    
    // Generate mock nodes and connections based on state
    const nodeRadius = 20;
    const horizontalSpacing = 120;
    const verticalSpacing = 100;
    
    state.nodes.forEach((node, index) => {
      // Determine position - create a tree-like layout
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      const cx = 100 + col * horizontalSpacing;
      const cy = 50 + row * verticalSpacing;
      
      // Create node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', nodeRadius.toString());
      circle.setAttribute('fill', '#6249d1');
      circle.setAttribute('stroke', '#ffc107');
      circle.setAttribute('stroke-width', '2');
      
      // Create node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', cx.toString());
      text.setAttribute('y', cy.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-size', '10');
      text.textContent = (index + 1).toString();
      
      svg.appendChild(circle);
      svg.appendChild(text);
      
      // Create label below
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', cx.toString());
      label.setAttribute('y', (cy + nodeRadius + 15).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#e0e7ff');
      label.setAttribute('font-size', '12');
      label.textContent = node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title;
      
      svg.appendChild(label);
      
      // Draw connections between nodes (branches)
      state.branches.forEach(branch => {
        if (branch.fromNodeId === node.id) {
          const toNodeIndex = state.nodes.findIndex(n => n.id === branch.toNodeId);
          if (toNodeIndex >= 0) {
            const toRow = Math.floor(toNodeIndex / 3);
            const toCol = toNodeIndex % 3;
            
            const toCx = 100 + toCol * horizontalSpacing;
            const toCy = 50 + toRow * verticalSpacing;
            
            // Create connection line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', cx.toString());
            line.setAttribute('y1', cy.toString());
            line.setAttribute('x2', toCx.toString());
            line.setAttribute('y2', toCy.toString());
            line.setAttribute('stroke', '#ffc107');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-opacity', '0.6');
            
            // Add arrow markers or decorations as needed
            // This is a simplified version
            
            svg.insertBefore(line, svg.firstChild); // Add lines before nodes for proper layering
          }
        }
      });
    });
    
    container.appendChild(svg);
  };
  
  const handleDownload = () => {
    if (!state.generatedStory) return;
    
    const blob = new Blob([state.generatedStory], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-story.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopy = () => {
    if (!state.generatedStory) return;
    
    navigator.clipboard.writeText(state.generatedStory).then(
      () => {
        alert('Story copied to clipboard!');
      },
      () => {
        alert('Failed to copy story to clipboard');
      }
    );
  };
  
  if (!state.generatedStory && state.nodes.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-midnight-900/50 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
            <Book size={32} className="text-story-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No Story Generated Yet</h3>
          <p className="text-gray-400 mb-6">
            Complete the previous steps and use the Story Generator to create your narrative.
          </p>
          <button 
            className="px-4 py-2 bg-story-600 hover:bg-story-500 text-white rounded-md inline-flex items-center transition-colors"
            onClick={() => {
              // Navigate to generator step
              const { dispatch } = useStory();
              dispatch({ type: 'SET_CURRENT_STEP', step: 'generate' });
            }}
          >
            Go to Generator
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-semibold text-story-100">Your Generated Story</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1.5 bg-midnight-800 hover:bg-midnight-700 text-white rounded-md flex items-center transition-colors"
            onClick={handleCopy}
          >
            <Copy size={16} className="mr-1" /> Copy
          </button>
          <button 
            className="px-3 py-1.5 bg-midnight-800 hover:bg-midnight-700 text-white rounded-md flex items-center transition-colors"
            onClick={handleDownload}
          >
            <Download size={16} className="mr-1" /> Download
          </button>
          <button 
            className="px-3 py-1.5 bg-story-600 hover:bg-story-500 text-white rounded-md flex items-center transition-colors"
          >
            <Share2 size={16} className="mr-1" /> Share
          </button>
        </div>
      </div>
      
      <div className="bg-midnight-900 rounded-lg border border-midnight-700 overflow-hidden">
        <div className="border-b border-midnight-700 p-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-story-100">
              {state.plots[0]?.title || 'Generated Story'}
            </h3>
          </div>
          <div className="flex rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 flex items-center text-sm ${
                viewMode === 'text' 
                  ? 'bg-story-600 text-white' 
                  : 'bg-midnight-800 text-gray-300 hover:bg-midnight-700'
              }`}
              onClick={() => setViewMode('text')}
            >
              <FileText size={14} className="mr-1" /> Text
            </button>
            <button 
              className={`px-3 py-1.5 flex items-center text-sm ${
                viewMode === 'graph' 
                  ? 'bg-story-600 text-white' 
                  : 'bg-midnight-800 text-gray-300 hover:bg-midnight-700'
              }`}
              onClick={() => setViewMode('graph')}
            >
              <GitBranch size={14} className="mr-1" /> Graph
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {viewMode === 'text' && state.generatedStory ? (
            <div className="bg-midnight-950 p-4 rounded-lg border border-midnight-800 prose prose-invert max-w-none">
              <ReactMarkdown>{state.generatedStory}</ReactMarkdown>
            </div>
          ) : viewMode === 'graph' ? (
            <div className="bg-midnight-950 p-4 rounded-lg border border-midnight-800">
              <div id="story-graph-container" className="min-h-[400px] flex items-center justify-center">
                {!graphLoaded && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-story-500 border-t-transparent rounded-full mb-2 mx-auto"></div>
                    <p className="text-gray-400">Rendering story graph...</p>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-400 p-3 bg-midnight-900/50 rounded">
                <p>
                  <strong className="text-story-300">Story Structure:</strong> This visualization represents the branching narrative structure of your story. Each node is a story beat, and connections show the possible paths through the narrative.
                </p>
                <p className="mt-2">
                  <strong className="text-story-300">Note:</strong> In a full implementation, this graph would be interactive, allowing you to click on nodes to view and edit content.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
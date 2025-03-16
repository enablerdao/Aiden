import { useState, useEffect, useRef } from 'react';
import Split from 'react-split';
import { ChatInterface } from './ChatInterface';
import { CodeWorkspace } from './CodeWorkspace';
import { ThemeToggle } from './ui/theme-toggle';
import { useIsMobile } from '../hooks/use-mobile';

export function SplitPaneLayout() {
  const [sizes, setSizes] = useState([40, 60]);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'chat' | 'code'>('chat');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle swipe navigation for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;
    
    let startX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const threshold = 50; // Minimum distance to be considered a swipe
      
      if (Math.abs(diffX) < threshold) return; // Not a swipe
      
      if (diffX > 0 && mobileView === 'chat') {
        // Swipe left - go to code workspace
        setMobileView('code');
      } else if (diffX < 0 && mobileView === 'code') {
        // Swipe right - go to chat
        setMobileView('chat');
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, mobileView]);
  
  // Save split sizes to localStorage
  useEffect(() => {
    const savedSizes = localStorage.getItem('split-sizes');
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes));
    }
  }, []);
  
  const handleDragEnd = (newSizes: number[]) => {
    localStorage.setItem('split-sizes', JSON.stringify(newSizes));
    setSizes(newSizes);
  };
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Aiden AI System</h1>
          {!isMobile && (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm rounded-md bg-secondary text-secondary-foreground">Standard</button>
              <button className="px-3 py-1 text-sm rounded-md hover:bg-secondary hover:text-secondary-foreground">Diff</button>
            </div>
          )}
        </div>
        <ThemeToggle />
      </header>
      
      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden" ref={containerRef}>
          <div className="flex-1 overflow-hidden">
            {mobileView === 'chat' && <ChatInterface />}
            {mobileView === 'code' && <CodeWorkspace />}
          </div>
          <div className="h-12 border-t border-border flex items-center justify-center gap-4">
            <button 
              className={`px-4 py-2 text-sm rounded-md ${mobileView === 'chat' ? 'bg-secondary text-secondary-foreground' : 'bg-background'}`}
              onClick={() => setMobileView('chat')}
            >
              Chat
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${mobileView === 'code' ? 'bg-secondary text-secondary-foreground' : 'bg-background'}`}
              onClick={() => setMobileView('code')}
            >
              Workspace
            </button>
          </div>
        </div>
      ) : (
        <Split 
          sizes={sizes}
          minSize={300}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className="flex flex-1 overflow-hidden"
          onDragEnd={handleDragEnd}
        >
          <ChatInterface />
          <CodeWorkspace />
        </Split>
      )}
    </div>
  );
}

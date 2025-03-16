import { useState, useEffect } from 'react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

export function useSwipe(elementRef: React.RefObject<HTMLElement>) {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;
      
      // Minimum distance required to be considered a swipe
      const minDistance = 50;
      
      if (Math.abs(diffX) < minDistance && Math.abs(diffY) < minDistance) {
        // Not a swipe, just a tap
        setSwipeDirection(null);
        return;
      }
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        setSwipeDirection(diffX > 0 ? 'left' : 'right');
      } else {
        // Vertical swipe
        setSwipeDirection(diffY > 0 ? 'up' : 'down');
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef]);
  
  return swipeDirection;
}

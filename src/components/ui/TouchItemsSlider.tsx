// components/ui/TouchItemsSlider.tsx

import { For, createSignal, onCleanup, JSX, Show } from "solid-js";
import { Motion } from "solid-motionone";
import { animations } from "~/utils/animations";

type Props<T> = {
  items: T[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  renderItem: (item: T, index: number) => JSX.Element;
  onAccept?: () => void;
  dotsPosition?: "top" | "bottom";
};

export function TouchItemsSlider<T>(props: Props<T>) {
  let containerRef: HTMLDivElement | undefined;
  
  const [touchStart, setTouchStart] = createSignal<number | null>(null);
  const [dragOffset, setDragOffset] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isAnimating, setIsAnimating] = createSignal(false);

  const snapToIndex = (index: number) => {
    if (index === props.currentIndex) {
      // Reset animation
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
      return;
    }
    
    setIsAnimating(true);
    props.onIndexChange(index);
    setDragOffset(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (isAnimating()) return;
    e.preventDefault();
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging() || !touchStart() || isAnimating()) return;
    e.preventDefault();
    
    const currentX = e.touches[0].clientX;
    let delta = currentX - touchStart()!;
    
    // Add resistance at edges
    if (props.currentIndex === 0 && delta > 0) {
      delta = delta * 0.3; // Resistance when trying to go past first
    } else if (props.currentIndex === props.items.length - 1 && delta < 0) {
      delta = delta * 0.3; // Resistance when trying to go past last
    }
    
    setDragOffset(delta);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging() || !touchStart() || isAnimating()) {
      setIsDragging(false);
      setTouchStart(null);
      setDragOffset(0);
      return;
    }
    
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStart()!;
    const threshold = window.innerWidth * 0.2; // 20% of screen width
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0 && props.currentIndex > 0) {
        // Swipe right -> previous
        snapToIndex(props.currentIndex - 1);
      } else if (delta < 0 && props.currentIndex < props.items.length - 1) {
        // Swipe left -> next
        snapToIndex(props.currentIndex + 1);
      } else {
        // Didn't meet threshold, reset
        setIsAnimating(true);
        setDragOffset(0);
        setTimeout(() => setIsAnimating(false), 300);
      }
    } else {
      // Didn't meet threshold, reset
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
    
    setIsDragging(false);
    setTouchStart(null);
  };

  // Clean up
  onCleanup(() => {
    setIsDragging(false);
  });

  const getItemStyle = (index: number) => {
    if (!isDragging() && !isAnimating() && dragOffset() === 0) {
      return {
        transform: `translateX(0px)`,
        transition: "none",
        zIndex: index === props.currentIndex ? 10 : 5,
        opacity: index === props.currentIndex ? 1 : 0,
        pointerEvents: index === props.currentIndex ? "auto" : "none" as const,
      };
    }
    
    // During drag/animation
    if (index === props.currentIndex) {
      return {
        transform: `translateX(${dragOffset()}px)`,
        transition: isAnimating() ? "transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" : "none",
        zIndex: 10,
        opacity: 1,
        pointerEvents: "auto" as const,
      };
    }
    
    // Next item (sliding in from right)
    if (index === props.currentIndex + 1 && dragOffset() < 0) {
      const offset = window.innerWidth + dragOffset();
      return {
        transform: `translateX(${offset}px)`,
        transition: isAnimating() ? "transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" : "none",
        zIndex: 9,
        opacity: 1,
        pointerEvents: isAnimating() ? "none" : "auto" as const,
      };
    }
    
    // Previous item (sliding in from left)
    if (index === props.currentIndex - 1 && dragOffset() > 0) {
      const offset = -window.innerWidth + dragOffset();
      return {
        transform: `translateX(${offset}px)`,
        transition: isAnimating() ? "transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)" : "none",
        zIndex: 9,
        opacity: 1,
        pointerEvents: isAnimating() ? "none" : "auto" as const,
      };
    }
    
    // Hidden items
    return {
      transform: `translateX(${index < props.currentIndex ? -window.innerWidth : window.innerWidth}px)`,
      transition: "none",
      zIndex: 5,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  const handleClick = (index: number) => {
    if (isDragging() || isAnimating()) return;
    
    if (index === props.currentIndex && props.onAccept) {
      props.onAccept();
    } else if (index !== props.currentIndex) {
      snapToIndex(index);
    }
  };

  return (
    <Motion
      {...animations.zoomInLight}
      class="fixed inset-0 bg-black/60"
    >

    {/* Number indicator */}  
    <div class="absolute top-4 left-0 right-0 flex justify-center z-20">
      <div class="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-lg font-light">
        {props.currentIndex + 1}/{props.items.length}
      </div>
    </div>



      {/* Swipe container */}
      <div
        ref={containerRef}
        class="relative w-full h-full overflow-hidden touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
          <For each={props.items}>
            {(item, index) => (
              <div
                onClick={() => handleClick(index())}
                class="absolute inset-0 flex items-center justify-center p-2"
                style={getItemStyle(index())}
              >
                  {props.renderItem(item, index())}
              </div>
            )}
          </For>
      </div>

    </Motion>
  );
}
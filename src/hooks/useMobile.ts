// hooks/useMobile.ts
import { createSignal, onCleanup, onMount } from 'solid-js';

export function useMobile(breakpoint = 800) {
    const [isMobile, setIsMobile] = createSignal(false);
    const [isTablet, setIsTablet] = createSignal(false);
    
    const checkScreenSize = () => {
        const width = window.innerWidth;
        setIsMobile(width < breakpoint);
        setIsTablet(width >= breakpoint && width < 1024);
    };
    
    onMount(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        onCleanup(() => window.removeEventListener('resize', checkScreenSize));
    });
    
    return { isMobile, isTablet };
}
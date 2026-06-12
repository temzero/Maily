// stores/device.store.ts
import { createSignal, onCleanup } from 'solid-js';

const [isMobile, setIsMobile] = createSignal(
    typeof window !== 'undefined' ? window.innerWidth < 800 : false
);
const [isTablet, setIsTablet] = createSignal(
    typeof window !== 'undefined' ? window.innerWidth >= 800 && window.innerWidth < 1024 : false
);
const [isDesktop, setIsDesktop] = createSignal(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
);

export function initDeviceStore() {
    if (typeof window === 'undefined') return;
    
    const checkDevice = () => {
        const width = window.innerWidth;
        setIsMobile(width < 800);
        setIsTablet(width >= 800 && width < 1024);
        setIsDesktop(width >= 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    onCleanup(() => window.removeEventListener('resize', checkDevice));
}

export function useDevice() {
    return {
        isMobile,
        isTablet,
        isDesktop
    };
}
import { JSX } from 'solid-js';

// Returns the open (expanded) transform: centered, shorter edge fills viewport
export const getZoomInTransform = (element?: HTMLElement | null, scale?: number): string => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    console.log('vh',vh)
    console.log('vw', vw)

    if (!element) {
        return `translate(${vw / 2}px, ${vh / 2}px) scale(1)`;
    }

    const rect = element.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    if (elementWidth === 0 || elementHeight === 0) {
        return 'scale(1)';
    }

    const scaleX = vw / elementWidth;
    const scaleY = vh / elementHeight;
    const resolvedScale = scale ?? Math.min(scaleX, scaleY);

    const translateX = (vw / 2) - (elementWidth / 2) * resolvedScale;
    const translateY = (vh / 2) - (elementHeight / 2) * resolvedScale;

    console.log('translateX', translateX)
    console.log('translateY', translateY)
    console.log('resolvedScale', resolvedScale)

    return `translate(${translateX}px, ${translateY}px) scale(${resolvedScale})`;
};

// Returns the initial (closed) transform + size to mimic the source element
export const getZoomOutTransform = (element: HTMLElement | null): string => {
    const rect = element?.getBoundingClientRect();

    if (!element || !rect || rect.width === 0) {
        return `translate(${window.innerWidth / 2}px, ${window.innerHeight}px) scale(0)`;
    }

    // Normal case: source exists
    const elementWidth = rect.width;
    const elementHeight = rect.height;
    const sourceCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const translateX = sourceCenter.x - elementWidth / 2;
    const translateY = sourceCenter.y - elementHeight / 2;

    return `translate(${translateX}px, ${translateY}px) scale(1)`;
};

export const getZoomTransformStyles = (
    sourceElementId: string,
    isOpen: boolean,
    scale?: number,
    duration?: number,
    easing?: string
): JSX.CSSProperties => {
    let sourceElement = document.getElementById(sourceElementId);
    const transitionDuration = duration ?? 400;
    const transitionEasing = easing ?? 'cubic-bezier(0.42, 0, 0.58, 1)';

    return {
        position: 'fixed',
        top: '0',
        left: '0',
        // opacity: scale ? 1 : (isOpen ? 0 : 1),
        transform: isOpen
            ? getZoomInTransform(sourceElement, scale)
            : getZoomOutTransform(sourceElement),
        transition: `transform ${transitionDuration}ms ${transitionEasing}, opacity ${transitionDuration}ms`,
        // 'transform-origin': '0 0',
        'transform-origin': 'center center',
    };
};

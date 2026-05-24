import { JSX } from 'solid-js';

export const getZoomAnimationStyle = (
    sourceElementId: string,
    isOpen: boolean,
    scale?: number,
    duration?: number,
    easing?: string
): JSX.CSSProperties => {
    let sourceElement = document.getElementById(sourceElementId);
    const transitionDuration = duration ?? 400;
    const transitionEasing = easing ?? 'cubic-bezier(0.4, 0, 0.2, 1)';

    const rect = sourceElement?.getBoundingClientRect();

    let finalScale = scale;
    if (!finalScale && rect && isOpen) {
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        finalScale = Math.max(scaleX, scaleY); // Use the smaller scale to fit entirely
    }

    return {
        position: 'fixed',
        top: isOpen ? '50%' : `${rect?.top}px`,
        left: isOpen ? '50%' : `${rect?.left}px`,
        transform: isOpen
            ? `translate(-50%, -50%) scale(${finalScale})`
            : 'translate(0, 0) scale(1)',
        opacity: scale ? 1 : isOpen ? 0 : 1,
        transition: `all ${transitionDuration}ms ${transitionEasing}`,
        'transform-origin': 'center',
    };

    // Smooth zoom animation style
    // return {
    //     position: 'fixed',
    //     top: isOpen ? '50%' : `${rect?.top}px`,
    //     left: isOpen ? '50%' : `${rect?.left}px`,
    //     transform: isOpen
    //         ? 'translate(-50%, -50%)' // Center the element
    //         : 'translate(0, 0)',
    //     scale: isOpen ? finalScale : 1,
    //     opacity: scale ? 1 : isOpen ? 0 : 1,
    //     transition: `all ${transitionDuration}ms ${transitionEasing}`,
    //     'transform-origin': 'top left',
    // };
};
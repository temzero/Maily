import { JSX } from 'solid-js';
import { easings } from '~/constants/easings';

export const getZoomAnimationStyle = (
    sourceElementId: string,
    isOpen: boolean,
    scale?: number,
    duration?: number,
    easing?: string
): JSX.CSSProperties => {
    let sourceElement = document.getElementById(sourceElementId);
    const transitionDuration = duration ?? 400;
    const transitionEasing = easing ?? easings.smooth;

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

// export const getMobileZoomAnimationStyle = (
//     sourceElementId: string,
//     isOpen: boolean,
//     scale?: number,
//     duration?: number,
//     easing?: string
// ): JSX.CSSProperties => {
//     let sourceElement = document.getElementById(sourceElementId);
//     const transitionDuration = duration ?? 400;
//     const transitionEasing = easing ?? easings.smooth;

//     const rect = sourceElement?.getBoundingClientRect();

//     let finalScale = scale;
//     if (!finalScale && rect && isOpen) {
//         const scaleX = window.innerWidth / rect.width;
//         const scaleY = window.innerHeight / rect.height;
//         finalScale = Math.max(scaleX, scaleY); // Use the smaller scale to fit entirely
//     }

//     return {
//         position: 'fixed',
//         top: isOpen ? '50%' : `${rect?.top}px`,
//         left: isOpen ? '50%' : `${rect?.left}px`,
//         transform: isOpen
//             ? `translate(-50%, -50%) scale(${finalScale})`
//             : 'translate(0, 0) scale(1)',
//         opacity: scale ? 1 : isOpen ? 0 : 1,
//         transition: `all ${transitionDuration}ms ${transitionEasing}`,
//         'transform-origin': 'center',
//     };
// };

// Phase 1: Move up
export const getMoveUpStyle = (
    sourceElementId: string,
    duration?: number,
    easing?: string
): JSX.CSSProperties => {
    const element = document.getElementById(sourceElementId);
    const rect = element?.getBoundingClientRect();
    const moveUpDistance = window.innerHeight * 0.2;
    
    return {
        position: 'fixed',
        top: `${(rect?.top ?? 0) - moveUpDistance}px`,
        left: `${rect?.left}px`,
        transform: 'scale(1)',
        'transform-origin': 'top left',
        transition: `all ${(duration ?? 400) / 2}ms ${easing ?? easings.smooth}`,
    };
};

// Phase 2: Zoom out
export const getZoomOutStyle = (
    scale: number
): JSX.CSSProperties => {
    return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        'transform-origin': 'center',
        transition: `all ${200}ms ${easings.smooth}`,
    };
};
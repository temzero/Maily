import { JSX } from 'solid-js';
import { easings } from '~/constants/easings';

export const getZoomAnimationStyle = (
    sourceElementId: string,
    isOpen: boolean,
    scale?: number,
    duration?: number,
    easing?: string,
    isMobile?: () => boolean
): JSX.CSSProperties => {
    let sourceElement = document.getElementById(sourceElementId);
    const transitionDuration = duration ?? 500;
    const transitionEasing = easing ?? easings.smooth;

    const rect = sourceElement?.getBoundingClientRect();
    let computedWidth, computedHeight;
    if (sourceElement) {
        const computedStyle = window.getComputedStyle(sourceElement);
        computedWidth = computedStyle.width;
        computedHeight = computedStyle.height;
    }

    let finalScale = scale;
    if (!finalScale && rect && isOpen) {
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        finalScale = Math.max(scaleX, scaleY);
    }

    if (isOpen) {
        return {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${finalScale})`,
            opacity: scale ? 1 : 0,
            transition: `all ${transitionDuration}ms ${transitionEasing}`,
            'transform-origin': 'center',
        };
    } else {
        return {
            position: 'fixed',
            top: `${rect?.top}px`,
            left: `${rect?.left}px`,
            'padding-bottom': `${isMobile?.() ? computedWidth : computedHeight}`,
            // 'padding-bottom': `${moveUpDistance}px`,
            transform: 'translate(0, 0) scale(1)',
            opacity: 1,
            transition: `all ${transitionDuration}ms ${transitionEasing}`,
            'transform-origin': 'center',
        };
    }
};
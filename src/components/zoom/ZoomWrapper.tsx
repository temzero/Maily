// components/zoomable/ZoomWrapper.tsx
import { onMount, onCleanup, createSignal, JSX, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';

interface ZoomOptions {
    scale?: number;
    duration?: number;
    easing?: string;
    overlayColor?: string;
    backdropBlur?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    lockScroll?: boolean;
    isZoomCursor?: boolean;
    zIndex?: number;
    isFullscreen?: boolean; // Add fullscreen option
}

interface ZoomWrapperProps {
    isZoom: boolean;
    options?: ZoomOptions;
    onZoomStart?: (element: HTMLElement) => void;
    onZoomEnd?: (element: HTMLElement) => void;
    onRestoreStart?: (element: HTMLElement) => void;
    onRestoreEnd?: (element: HTMLElement) => void;
    children: JSX.Element;
}

const defaultZoomOptions: Required<ZoomOptions> = {
    scale: 2.5,
    duration: 450,
    easing: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
    overlayColor: 'rgba(0,0,0,0.75)',
    backdropBlur: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
    isZoomCursor: false,
    zIndex: 10000,
    isFullscreen: false,
};

// Helper function to get current scale of an element
// Simpler approach - check for scale classes
// Helper function to get current scale of an element
const getCurrentScale = (element: HTMLElement): number => {
    const transform = window.getComputedStyle(element).transform;
    if (transform === 'none') return 1;

    // Parse matrix: matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
    const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
    if (matrixMatch) {
        const values = matrixMatch[1].split(',').map(parseFloat);
        // For scale, values[0] is scaleX and values[3] is scaleY
        // They should be equal for uniform scaling
        const scaleX = Math.abs(values[0]);
        const scaleY = Math.abs(values[3]);
        // Return the average (or either one if they're equal)
        return (scaleX + scaleY) / 2;
    }

    // Handle matrix3d just in case
    const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
    if (matrix3dMatch) {
        const values = matrix3dMatch[1].split(',').map(parseFloat);
        // For matrix3d, scale is sqrt(m00^2 + m01^2 + m02^2)
        const scaleX = Math.sqrt(
            Math.pow(values[0], 2) + Math.pow(values[1], 2) + Math.pow(values[2], 2)
        );
        return scaleX;
    }

    return 1;
};

export function ZoomWrapper(props: ZoomWrapperProps) {
    let containerRef: HTMLDivElement | undefined;
    let zoomedContentRef: HTMLDivElement | undefined;
    let originalRect: DOMRect | null = null;
    let originalScrollLock = false;

    const options = { ...defaultZoomOptions, ...props.options };
    const [isZoomedState, setIsZoomedState] = createSignal(false);
    const [shouldRenderPortal, setShouldRenderPortal] = createSignal(false);

    const zoomIn = () => {
        if (!containerRef) return;

        // Store original position
        originalRect = containerRef.getBoundingClientRect();

        // Lock scroll
        if (options.lockScroll) {
            originalScrollLock = document.body.style.overflow === 'hidden';
            document.body.style.overflow = 'hidden';
        }

        // Hide original instantly
        if (containerRef) {
            containerRef.style.opacity = '0';
            containerRef.style.pointerEvents = 'none';
        }

        // Show portal
        setShouldRenderPortal(true);

        // Trigger zoom animation
        setTimeout(() => {
            setIsZoomedState(true);
        }, 10);

        props.onZoomStart?.(containerRef);
    };

    const zoomOut = () => {
        if (!containerRef) return;

        props.onRestoreStart?.(containerRef);

        // Start closing animation - this will animate back to original position
        setIsZoomedState(false);

        // Wait for animation to complete before hiding portal and showing original
        setTimeout(() => {
            // Hide portal
            setShouldRenderPortal(false);

            // Show original
            if (containerRef) {
                containerRef.style.opacity = '';
                containerRef.style.pointerEvents = '';
            }

            // Unlock scroll
            if (options.lockScroll && !originalScrollLock) {
                document.body.style.overflow = '';
            }

            props.onRestoreEnd?.(containerRef);
        }, options.duration);
    };

    // Watch for isZoom changes
    createEffect(() => {
        if (props.isZoom) {
            zoomIn();
        } else if (!props.isZoom && shouldRenderPortal()) {
            zoomOut();
        }
    });

    // Handle escape key
    onMount(() => {
        if (options.closeOnEscape) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && props.isZoom) {
                    zoomOut();
                }
            };
            document.addEventListener('keydown', handleEscape);
            onCleanup(() => document.removeEventListener('keydown', handleEscape));
        }
    });

    // Handle window resize - recalculate position if zoomed
    onMount(() => {
        const handleResize = () => {
            if (isZoomedState() && containerRef && originalRect && zoomedContentRef) {
                const newRect = containerRef.getBoundingClientRect();
                const currentScale = getCurrentScale(containerRef);
                const targetScale = currentScale * options.scale;

                let newTransform;
                if (options.isFullscreen) {
                    const scaleX = window.innerWidth / newRect.width;
                    const scaleY = window.innerHeight / newRect.height;
                    const fullscreenScale = Math.min(scaleX, scaleY);
                    const adjustedFullscreenScale = fullscreenScale / currentScale;
                    const targetX =
                        (window.innerWidth - newRect.width * fullscreenScale) / 2 - newRect.left;
                    const targetY =
                        (window.innerHeight - newRect.height * fullscreenScale) / 2 - newRect.top;
                    newTransform = `translate(${targetX}px, ${targetY}px) scale(${adjustedFullscreenScale})`;
                } else {
                    const screenCenterX = window.innerWidth / 2;
                    const screenCenterY = window.innerHeight / 2;
                    const scaledWidth = newRect.width * targetScale;
                    const scaledHeight = newRect.height * targetScale;
                    const targetX = screenCenterX - newRect.left - scaledWidth / 2;
                    const targetY = screenCenterY - newRect.top - scaledHeight / 2;
                    newTransform = `translate(${targetX}px, ${targetY}px) scale(${targetScale})`;
                }
                zoomedContentRef.style.transform = newTransform;
            }
        };
        window.addEventListener('resize', handleResize);
        onCleanup(() => window.removeEventListener('resize', handleResize));
    });

    // Cleanup on unmount
    onCleanup(() => {
        if (containerRef) {
            containerRef.style.opacity = '';
            containerRef.style.pointerEvents = '';
        }
        if (options.lockScroll && !originalScrollLock) {
            document.body.style.overflow = '';
        }
    });

    // Calculate transform for zoomed state
    const getZoomedTransform = () => {
        if (!originalRect || !containerRef) return 'translate(0, 0) scale(1)';

        // Get the current scale of the element
        const currentScale = getCurrentScale(containerRef);
        const targetScale = currentScale * options.scale; // Multiply existing scale by zoom factor

        // For fullscreen mode - scale to fill the screen
        if (options.isFullscreen) {
            const scaleX = window.innerWidth / originalRect.width;
            const scaleY = window.innerHeight / originalRect.height;
            const fullscreenScale = Math.min(scaleX, scaleY); // Use Math.max for cover effect

            // Adjust target scale to account for current scale
            const adjustedFullscreenScale = fullscreenScale / currentScale;

            const targetX =
                (window.innerWidth - originalRect.width * fullscreenScale) / 2 - originalRect.left;
            const targetY =
                (window.innerHeight - originalRect.height * fullscreenScale) / 2 - originalRect.top;

            return `translate(${targetX}px, ${targetY}px) scale(${adjustedFullscreenScale})`;
        }

        // Regular zoom mode
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const scaledWidth = originalRect.width * targetScale;
        const scaledHeight = originalRect.height * targetScale;
        const targetX = screenCenterX - originalRect.left - scaledWidth / 2;
        const targetY = screenCenterY - originalRect.top - scaledHeight / 2;

        return `translate(${targetX}px, ${targetY}px) scale(${targetScale})`;
    };

    return (
        <>
            {/* Original children - hidden instantly when zoomed */}
            <div
                class="w-fit h-fit"
                ref={containerRef}
                style={{
                    transition: 'opacity 0ms',
                }}
            >
                {props.children}
            </div>

            {/* Portal for zoomed content */}
            {shouldRenderPortal() && originalRect && (
                <Portal>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            'z-index': options.zIndex - 2,
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }}
                    >
                        {/* Overlay - fades in/out */}
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                'background-color': options.overlayColor,
                                'backdrop-filter': options.backdropBlur ? 'blur(4px)' : 'none',
                                'z-index': options.zIndex - 1,
                                opacity: isZoomedState() ? 1 : 0,
                                transition: `opacity ${options.duration}ms ${options.easing}`,
                            }}
                            onClick={() => {
                                if (options.closeOnClickOutside) {
                                    zoomOut();
                                }
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                        />

                        {/* Zoomed content - animates from original position to center and back */}
                        <div
                            ref={zoomedContentRef}
                            style={{
                                position: 'fixed',
                                // @ts-expect-error
                                top: `${originalRect.top}px`,
                                // @ts-expect-error
                                left: `${originalRect.left}px`,
                                // @ts-expect-error
                                width: `${originalRect.width}px`,
                                // @ts-expect-error
                                height: `${originalRect.height}px`,
                                'z-index': options.zIndex,
                                transition: `transform ${options.duration}ms ${options.easing}`,
                                transform: isZoomedState()
                                    ? getZoomedTransform()
                                    : 'translate(0, 0) scale(1)',
                                'transform-origin': 'top left',
                                cursor: options.isZoomCursor ? 'zoom-out' : 'default',
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            {props.children}
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}

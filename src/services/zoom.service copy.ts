// services/zoom.service.ts
// types/zoom.types.ts
export interface ZoomOptions {
    /** Zoom scale factor (default: 3) */
    scale?: number;
    /** Animation duration in milliseconds (default: 300) */
    duration?: number;
    /** CSS easing function (default: 'ease-out') */
    easing?: string;
    /** Background overlay color (default: 'rgba(0,0,0,0.5)') */
    overlayColor?: string | undefined;
    /** Enable backdrop blur (default: false) */
    backdropBlur?: boolean;
    /** Enable click outside to close (default: true) */
    closeOnClickOutside?: boolean;
    /** Enable ESC key to close (default: true) */
    closeOnEscape?: boolean;
    /** Zoom origin point { x, y } */
    /** Callback when zoom animation starts */
    onZoomStart?: (element: HTMLElement) => void;
    /** Callback when zoom animation ends */
    onZoomEnd?: (element: HTMLElement) => void;
    /** Callback when restore animation starts */
    onRestoreStart?: (element: HTMLElement) => void;
    /** Callback when restore animation ends */
    onRestoreEnd?: (element: HTMLElement) => void;
    /** Lock scroll when zoomed (default: true) */
    lockScroll?: boolean;
    isZoomCursor?: boolean;
}

export const defaultZoomOptions: Omit<Required<ZoomOptions>, 'origin' | 'customTransform'> & {
    origin?: { x: number; y: number };
    customTransform?: ((rect: DOMRect, scale: number) => string) | undefined;
} = {
    scale: 3,
    duration: 300,
    easing: 'ease-out',
    overlayColor: 'rgba(0,0,0,0.5)',
    backdropBlur: false,
    closeOnClickOutside: true,
    closeOnEscape: true,
    minScale: 1,
    maxScale: 5,
    origin: undefined,
    onZoomStart: () => {},
    onZoomEnd: () => {},
    onRestoreStart: () => {},
    onRestoreEnd: () => {},
    customTransform: undefined,
    lockScroll: true,
    isZoomCursor: false,
    zIndex: 10000,
};

interface ZoomableElement {
    element: HTMLElement;
    options: ZoomOptions;
    id: string;
}

class ZoomManager {
    private activeZoom: ZoomableElement | null = null;
    private placeholder: HTMLElement | null = null;
    private overlay: HTMLElement | null = null;
    private originalScrollLock = false;
    private elements = new Map<string, ZoomableElement>();

    register(id: string, element: HTMLElement, options: ZoomOptions = {}) {
        const mergedOptions = { ...defaultZoomOptions, ...options };
        this.elements.set(id, { element, options: mergedOptions, id });

        // Set cursor style based on zoomability
        if (mergedOptions.isZoomCursor) {
            element.style.cursor = 'zoom-in';
        }

        // Add double-click handler if not explicitly disabled
        if (mergedOptions.closeOnClickOutside !== false) {
            element.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.zoomIn(id);
            });
        }

        return () => this.unregister(id);
    }

    unregister(id: string) {
        this.elements.delete(id);
        if (this.activeZoom?.id === id) {
            this.zoomOut();
        }
    }

    async zoomIn(id: string, customOptions?: Partial<ZoomOptions>) {
        const zoomable = this.elements.get(id);
        if (!zoomable) return;

        // Merge with custom options if provided
        const options = { ...zoomable.options, ...customOptions };

        // Zoom out current if exists
        if (this.activeZoom) {
            await this.zoomOut();
        }

        const { element } = zoomable;
        const {
            scale,
            duration,
            easing,
            overlayColor,
            backdropBlur,
            closeOnClickOutside,
            closeOnEscape,
            customTransform,
            onZoomStart,
            onZoomEnd,
            lockScroll,
            zIndex,
            origin,
        } = options;

        onZoomStart?.(element);

        // Lock scroll if needed
        if (lockScroll) {
            this.originalScrollLock = document.body.style.overflow === 'hidden';
            document.body.style.overflow = 'hidden';
        }

        // Get position
        const rect = element.getBoundingClientRect();
        const originPoint = origin || {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        // Create placeholder
        const placeholder = this.createPlaceholder(rect);
        element.parentNode?.insertBefore(placeholder, element);

        // Create overlay
        // Create overlay
        const overlay = this.createOverlay(
            overlayColor || 'rgba(0, 0, 0, 0.75)',
            backdropBlur || true,
            zIndex!
        );
        document.body.appendChild(overlay);

        // Force reflow and fade in
        overlay.offsetHeight; // Force reflow
        overlay.style.opacity = '1';

        // Store original styles
        const originalStyles = this.saveOriginalStyles(element);

        // Move and transform
        document.body.appendChild(element);
        this.applyZoomStyles(element, rect, scale!, duration!, easing!, zIndex!, originPoint);

        // Apply custom transform if provided
        if (customTransform) {
            element.style.transform = customTransform(rect, scale!);
        } else {
            const centerX = (window.innerWidth - rect.width) / 2;
            const centerY = (window.innerHeight - rect.height) / 2;
            const targetX = centerX - rect.left;
            const targetY = centerY - rect.top;
            element.style.transform = `translate(${targetX}px, ${targetY}px) scale(${scale})`;
        }

        this.activeZoom = zoomable;
        this.placeholder = placeholder;
        this.overlay = overlay;

        // Setup close handlers
        const cleanupHandlers: Array<() => void> = [];

        if (closeOnClickOutside) {
            const handleClickOutside = (e: MouseEvent) => {
                if (!element.contains(e.target as Node)) {
                    this.zoomOut();
                }
            };
            overlay.addEventListener('click', handleClickOutside);
            cleanupHandlers.push(() => overlay.removeEventListener('click', handleClickOutside));
        }

        if (closeOnEscape) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') this.zoomOut();
            };
            document.addEventListener('keydown', handleEscape);
            cleanupHandlers.push(() => document.removeEventListener('keydown', handleEscape));
        }

        // Store cleanup
        (element as any)._zoomCleanup = () => {
            cleanupHandlers.forEach((cleanup) => cleanup());
        };

        setTimeout(() => {
            onZoomEnd?.(element);
        }, duration);
    }

    async zoomOut() {
        if (!this.activeZoom || !this.placeholder) return;

        const { element, options } = this.activeZoom;
        const { duration, easing, onRestoreStart, onRestoreEnd, lockScroll } = options;

        onRestoreStart?.(element);

        // Animate back
        element.style.transform = 'translate(0, 0) scale(1)';

        if (this.overlay) {
            this.overlay.style.opacity = '0';
        }

        setTimeout(() => {
            // Restore to original position
            this.placeholder?.replaceWith(element);
            this.restoreOriginalStyles(element);

            // Remove overlay
            this.overlay?.remove();

            // Unlock scroll
            if (lockScroll && !this.originalScrollLock) {
                document.body.style.overflow = '';
            }

            this.activeZoom = null;
            this.placeholder = null;
            this.overlay = null;

            onRestoreEnd?.(element);
        }, duration);

        (element as any)._zoomCleanup?.();
    }

    private createPlaceholder(rect: DOMRect): HTMLElement {
        const placeholder = document.createElement('div');
        placeholder.style.width = `${rect.width}px`;
        placeholder.style.height = `${rect.height}px`;
        placeholder.style.visibility = 'hidden';
        return placeholder;
    }

    private createOverlay(color: string, backdropBlur: boolean, zIndex: number): HTMLElement {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = color;
        overlay.style.zIndex = `${zIndex - 1}`;
        overlay.style.opacity = '0'; // Start invisible
        overlay.style.transition = `opacity ${this.getDurationFromOptions()}ms ease-out`; // Add transition
        if (backdropBlur) {
            overlay.style.backdropFilter = 'blur(4px)';
        }
        return overlay;
    }

    // Add this helper method to get duration from active options
    private getDurationFromOptions(): number {
        return this.activeZoom?.options.duration || 300;
    }

    private saveOriginalStyles(element: HTMLElement) {
        return {
            position: element.style.position,
            top: element.style.top,
            left: element.style.left,
            transform: element.style.transform,
            transition: element.style.transition,
            zIndex: element.style.zIndex,
            cursor: element.style.cursor,
            transformOrigin: element.style.transformOrigin,
        };
    }

    private applyZoomStyles(
        element: HTMLElement,
        rect: DOMRect,
        scale: number,
        duration: number,
        easing: string,
        zIndex: number,
        origin?: { x: number; y: number }
    ) {
        element.style.position = 'fixed';
        element.style.top = `${rect.top}px`;
        element.style.left = `${rect.left}px`;
        element.style.width = `${rect.width}px`;
        element.style.height = `${rect.height}px`;

        // Set transform origin
        if (origin) {
            element.style.transformOrigin = `${origin.x - rect.left}px ${origin.y - rect.top}px`;
        } else {
            element.style.transformOrigin = 'top left';
        }

        element.style.transition = `transform ${duration}ms ${easing}`;
        element.style.zIndex = `${zIndex}`;
        if (this.activeZoom?.options.isZoomCursor) {
            element.style.cursor = 'zoom-out';
        }

        // Force reflow
        element.offsetHeight;
    }

    private restoreOriginalStyles(element: HTMLElement) {
        element.style.position = '';
        element.style.top = '';
        element.style.left = '';
        element.style.width = '';
        element.style.height = '';
        element.style.transform = '';
        element.style.transition = '';
        element.style.zIndex = '';
        element.style.cursor = '';
        element.style.transformOrigin = '';
    }

    // Utility method to update options for an existing element
    updateOptions(id: string, options: Partial<ZoomOptions>) {
        const zoomable = this.elements.get(id);
        if (zoomable) {
            zoomable.options = { ...zoomable.options, ...options };
            this.elements.set(id, zoomable);
        }
    }

    // Get current zoom state
    getActiveZoom() {
        return this.activeZoom;
    }

    // Check if an element is currently zoomed
    isZoomed(id: string) {
        return this.activeZoom?.id === id;
    }
}

export const zoomManager = new ZoomManager();

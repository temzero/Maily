// services/zoom.service.ts
import { createSignal } from 'solid-js';
// types/zoom.types.ts
export interface ZoomOptions {
    /** Zoom scale factor (default: 3) */
    scale?: number;
    /** Animation duration in milliseconds (default: 300) */
    duration?: number;
    /** CSS easing function (default: 'ease-out') */
    easing?: string;
    /** Background overlay color (default: 'rgba(0,0,0,0.5)') */
    overlayColor?: string;
    /** Enable backdrop blur (default: false) */
    backdropBlur?: boolean;
    /** Enable click outside to close (default: true) */
    closeOnClickOutside?: boolean;
    /** Enable ESC key to close (default: true) */
    closeOnEscape?: boolean;
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
    /** Show zoom cursor (default: false) */
    isZoomCursor?: boolean;
    /** Z-index for zoomed element (default: 10000) */
    zIndex?: number;
}

export const defaultZoomOptions: Required<ZoomOptions> = {
    scale: 3,
    duration: 300,
    easing: 'ease-out',
    overlayColor: 'rgba(0,0,0,0.5)',
    backdropBlur: false,
    closeOnClickOutside: true,
    closeOnEscape: true,
    onZoomStart: () => {},
    onZoomEnd: () => {},
    onRestoreStart: () => {},
    onRestoreEnd: () => {},
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

    // Simple reactive state
    private zoomState = new Map<string, boolean>();
    private listeners = new Map<string, (isZoomed: boolean) => void>();

    register(id: string, element: HTMLElement, options: ZoomOptions = {}) {
        const mergedOptions = { ...defaultZoomOptions, ...options };
        this.elements.set(id, { element, options: mergedOptions, id });
        this.zoomState.set(id, false);

        // Set cursor if enabled
        if (mergedOptions.isZoomCursor) {
            element.style.cursor = 'zoom-in';
        }

        return () => this.unregister(id);
    }

    unregister(id: string) {
        this.elements.delete(id);
        this.zoomState.delete(id);
        this.listeners.delete(id);
        if (this.activeZoom?.id === id) {
            this.zoomOut();
        }
    }

    // Subscribe to zoom state changes
    subscribe(id: string, callback: (isZoomed: boolean) => void) {
        this.listeners.set(id, callback);
        return () => this.listeners.delete(id);
    }

    // Get current zoom state
    isZoomed(id: string): boolean {
        return this.zoomState.get(id) || false;
    }

    async zoomIn(id: string, customOptions?: Partial<ZoomOptions>) {
        const zoomable = this.elements.get(id);
        if (!zoomable || this.isZoomed(id)) return;

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
            onZoomStart,
            onZoomEnd,
            lockScroll,
            zIndex,
            origin,
        } = options;

        onZoomStart?.(element);

        // Update state
        this.zoomState.set(id, true);
        this.notifyListeners(id, true);

        // Lock scroll
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

        // Create and fade in overlay
        const overlay = this.createOverlay(
            overlayColor || 'rgba(0, 0, 0, 0.75)',
            backdropBlur || false,
            zIndex || 10000,
            duration
        );
        document.body.appendChild(overlay);
        overlay.offsetHeight; // Force reflow
        overlay.style.opacity = '1';

        // Move and transform
        document.body.appendChild(element);
        this.applyZoomStyles(
            element,
            rect,
            scale!,
            duration!,
            easing!,
            zIndex || 10000,
            originPoint
        );

        // Calculate transform
        const centerX = (window.innerWidth - rect.width) / 2;
        const centerY = (window.innerHeight - rect.height) / 2;
        const targetX = centerX - rect.left;
        const targetY = centerY - rect.top;
        element.style.transform = `translate(${targetX}px, ${targetY}px) scale(${scale})`;

        this.activeZoom = zoomable;
        this.placeholder = placeholder;
        this.overlay = overlay;

        // Setup close handlers
        if (closeOnClickOutside) {
            const handleClickOutside = (e: MouseEvent) => {
                if (!element.contains(e.target as Node)) {
                    this.zoomOut();
                }
            };
            overlay.addEventListener('click', handleClickOutside);
            (element as any)._clickOutsideCleanup = () =>
                overlay.removeEventListener('click', handleClickOutside);
        }

        if (closeOnEscape) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') this.zoomOut();
            };
            document.addEventListener('keydown', handleEscape);
            (element as any)._escapeCleanup = () =>
                document.removeEventListener('keydown', handleEscape);
        }

        setTimeout(() => {
            onZoomEnd?.(element);
        }, duration);
    }

    async zoomOut() {
        if (!this.activeZoom || !this.placeholder) return;

        const { element, options, id } = this.activeZoom;
        const { duration, onRestoreStart, onRestoreEnd, lockScroll } = options;

        onRestoreStart?.(element);

        // Update state
        this.zoomState.set(id, false);
        this.notifyListeners(id, false);

        // Animate back
        element.style.transform = 'translate(0, 0) scale(1)';

        // Fade out overlay
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

            // Cleanup event handlers
            (element as any)._clickOutsideCleanup?.();
            (element as any)._escapeCleanup?.();

            this.activeZoom = null;
            this.placeholder = null;
            this.overlay = null;

            onRestoreEnd?.(element);
        }, duration);
    }

    toggleZoom(id: string, customOptions?: Partial<ZoomOptions>) {
        if (this.isZoomed(id)) {
            this.zoomOut();
        } else {
            this.zoomIn(id, customOptions);
        }
    }

    private createPlaceholder(rect: DOMRect): HTMLElement {
        const placeholder = document.createElement('div');
        placeholder.style.width = `${rect.width}px`;
        placeholder.style.height = `${rect.height}px`;
        placeholder.style.visibility = 'hidden';
        return placeholder;
    }

    private createOverlay(
        color: string,
        backdropBlur: boolean,
        zIndex: number,
        duration: number
    ): HTMLElement {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = color;
        overlay.style.zIndex = `${zIndex - 1}`;
        overlay.style.opacity = '0';
        overlay.style.transition = `opacity ${duration}ms ease-out`;
        if (backdropBlur) {
            overlay.style.backdropFilter = 'blur(4px)';
        }
        return overlay;
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

        element.offsetHeight; // Force reflow
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

    private notifyListeners(id: string, isZoomed: boolean) {
        const listener = this.listeners.get(id);
        if (listener) {
            listener(isZoomed);
        }
    }

    updateOptions(id: string, options: Partial<ZoomOptions>) {
        const zoomable = this.elements.get(id);
        if (zoomable) {
            zoomable.options = { ...zoomable.options, ...options };
            this.elements.set(id, zoomable);
        }
    }

    getActiveZoom() {
        return this.activeZoom;
    }
}

export const zoomManager = new ZoomManager();

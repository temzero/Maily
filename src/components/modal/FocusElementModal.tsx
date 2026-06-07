// components/modal/FocusElementModal.tsx
import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';
import { useMobile } from '~/hooks/useMobile';
import { clearFocusElementId, getFocusElementId } from '~/store/ui.store';
import { getZoomAnimationStyle } from '~/utils/zoomAnimation.utils';

const focusScale: number = 2.6;
const focusAnimateDuration: number = 400;
const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function FocusElementModal(props: { zIndex?: number }) {
    const { isMobile } = useMobile();
    const focusElementId = () => getFocusElementId();
    const [isMounted, setIsMounted] = createSignal(false);
    let overlayRef: HTMLDivElement | undefined;

    const focusScaleValue: number = isMobile() ? 1 : focusScale

    const handleClose = () => {
        setIsMounted(false);
    };

    onMount(() => {
        setIsMounted(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        onCleanup(() => {
            window.removeEventListener('keydown', handleKeyDown);
        });
    });

    const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === overlayRef) {
            handleClose();
        }
    };

    if (!focusElementId()) return null;

    const originalElement = document.getElementById(focusElementId()!);
    if (!originalElement) return null;

    return (
        <Portal>
            <div
                onClick={handleBackdropClick}
                style={{
                    position: 'fixed',
                    inset: 0,
                    'z-index': props.zIndex ?? 9999,
                }}
            >
                <div
                    id="focus-blur-overlay"
                    ref={overlayRef}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        'z-index': 0,
                        'backdrop-filter': 'blur(4px)',
                        background: 'rgba(0, 0, 0, 0.6)',
                        opacity: isMounted() ? 1 : 0,
                        transition: `opacity ${focusAnimateDuration}ms`,
                    }}
                />

                <div
                    innerHTML={(() => {
                        const clone = originalElement.cloneNode(true) as HTMLElement;
                        clone.id = `focused-${focusElementId()}`;
                        clone.style.transition = `all ${focusAnimateDuration}ms ${easing}`;
                        clone.style.boxShadow = 'none';
                        clone.style.textShadow = 'none';
                        // Check if the original element has width: 100% and capture actual width
                        const originalWidth = window.getComputedStyle(originalElement).width;
                        if (originalWidth === '100%' || originalElement.style.width === '100%') {
                            const rect = originalElement.getBoundingClientRect();
                            clone.style.width = `${rect.width}px`;
                        }
                        
                        return clone.outerHTML;
                    })()}
                    style={getZoomAnimationStyle(
                        focusElementId()!,
                        isMounted(),
                        focusScaleValue
                        // focusAnimateDuration,
                        // easing
                    )}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === 'transform') {
                            if (!isMounted()) {
                                clearFocusElementId();
                            }
                        }
                    }}
                />
            </div>
        </Portal>
    );
}

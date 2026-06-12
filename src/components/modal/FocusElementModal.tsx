// components/modal/FocusElementModal.tsx
import { Portal } from 'solid-js/web';
import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { clearFocusElementId, getFocusElementId } from '~/stores/ui.store';
import { getZoomAnimationStyle } from '~/utils/zoomAnimation.utils';
import { useDevice } from '~/stores/device.store';

const focusScale: number = 2.6;
const focusAnimateDuration: number = 400;
const easing = 'ease-in-out';

export default function FocusElementModal(props: { zIndex?: number }) {
    const { isMobile } = useDevice();
    const focusElementId = () => getFocusElementId();
    const [isOpen, setIsOpen] = createSignal(false);
    let overlayRef: HTMLDivElement | undefined;

    const focusScaleValue: number = isMobile() ? 1 : focusScale

    const handleClose = () => {
        setIsOpen(false);
    };

    onMount(() => {
        setIsOpen(true);
        
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
                class="fixed inset-0"
                style={{
                    'z-index': props.zIndex ?? 9999,
                }}
            >
                {/* Backdrop */}
                <div
                    ref={overlayRef}
                    class="fixed inset-0"
                    style={{
                        'background-color': 'rgba(0, 0, 0, 0.6)',
                        'backdrop-filter': 'blur(4px)',
                        transition: `opacity ${focusAnimateDuration}ms ${easing}`,
                        opacity: isOpen() ? 1 : 0,
                    }}
                    onClick={handleBackdropClick}
                />

                {/* Animated clone - same pattern as ActiveEmailModal */}
                <div
                    innerHTML={(() => {
                        const clone = originalElement.cloneNode(true) as HTMLElement;
                        clone.id = `focused-${focusElementId()}`;
                        clone.style.boxShadow = 'none';
                        clone.style.textShadow = 'none';
                        
                        const originalWidth = window.getComputedStyle(originalElement).width;
                        if (originalWidth === '100%' || originalElement.style.width === '100%') {
                            const rect = originalElement.getBoundingClientRect();
                            clone.style.width = `${rect.width}px`;
                        }
                        
                        return clone.outerHTML;
                    })()}
                    style={getZoomAnimationStyle(
                        focusElementId()!,
                        isOpen(),
                        focusScaleValue,
                        focusAnimateDuration,
                        easing
                    )}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === 'transform' && !isOpen()) {
                            clearFocusElementId(); // Just clean up when closing
                        }
                    }}
                />
            </div>
        </Portal>
    );
}
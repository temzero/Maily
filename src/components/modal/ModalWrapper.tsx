// components/modal/ModalWrapper.tsx
import { Show, onCleanup, onMount, JSX, Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';
import { CloseButton } from '../ui/CloseButton';

export const ModalAnimateDuration = 0.3;

interface ModalWrapperProps {
    isOpen: boolean;
    zIndex?: number;
    children: JSX.Element;
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    disableBackdropBlur?: boolean;
    class?: string;
    onClose: () => void;
    onAfterLeave?: () => void;
}

export const ModalWrapper: Component<ModalWrapperProps> = (props) => {
    let modalRef: HTMLDivElement | undefined;
    let previousOverflow: string = '';
    let previousPaddingRight: string = '';

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleBackdropClick = (e: MouseEvent) => {
        if (props.closeOnBackdropClick !== false && e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (props.closeOnEscape !== false && e.key === 'Escape' && props.isOpen) {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
        }
    };

    // Prevent scroll on modal content and stop propagation
    const handleScrollPrevention = (e: Event) => {
        e.stopPropagation();
    };

    // Prevent touchmove on modal to stop background scrolling on mobile
    const handleTouchMove = (e: TouchEvent) => {
        if (e.target === modalRef || modalRef?.contains(e.target as Node)) {
            // Allow scrolling inside modal content
            const target = e.target as HTMLElement;
            const isScrollable = target.closest(
                '.modal-scrollable, .overflow-auto, .overflow-y-auto'
            );

            if (!isScrollable) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    onMount(() => {
        if (props.isOpen) {
            // Save current body styles
            previousOverflow = document.body.style.overflow;
            previousPaddingRight = document.body.style.paddingRight;

            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Apply styles to prevent body scroll
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            // Add touchmove prevention for mobile
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        if (props.closeOnEscape !== false) {
            window.addEventListener('keydown', handleKeyDown);
        }
    });

    onCleanup(() => {
        if (props.closeOnEscape !== false) {
            window.removeEventListener('keydown', handleKeyDown);
        }

        // Restore body styles
        document.body.style.overflow = previousOverflow;
        document.body.style.paddingRight = previousPaddingRight;

        // Remove touchmove listener
        document.removeEventListener('touchmove', handleTouchMove);

        props.onAfterLeave?.();
    });

    return (
        <Portal>
            <Presence>
                <Show when={props.isOpen}>
                    {/* <div
                        class={`fixed inset-0 flex items-center justify-center transition-opacity bg-black/60 ${
                            props.disableBackdropBlur ? '' : 'backdrop-blur-sm'
                        }`}
                        role="dialog"
                        aria-modal="true"
                        ref={modalRef}
                        onClick={handleBackdropClick}
                        onScroll={handleScrollPrevention}
                        style={{
                            'z-index': props.zIndex,
                            transition:
                                'opacity 500ms cubic-bezier(0.5, 1.5, 0.5, 1)',
                        }}
                    >
                        <div
                            class={`flex-1 w-full h-full overflow-auto modal-scrollable ${props.class || ''} border border-amber-600`}
                            onScroll={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {props.children}
                        </div>

                        {props.showCloseButton !== false && <CloseButton onClose={handleClose} />}
                    </div> */}

                    <Motion
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: ModalAnimateDuration }}
                        class={`fixed inset-0 flex items-center justify-center transition-opacity bg-black/60 ${
                            props.disableBackdropBlur ? '' : 'backdrop-blur-sm'
                        }`}
                        role="dialog"
                        aria-modal="true"
                        ref={modalRef}
                        onClick={handleBackdropClick}
                        onScroll={handleScrollPrevention}
                        style={{
                            'z-index': props.zIndex,
                            transition:
                                'opacity 500ms cubic-bezier(0.5, 1.5, 0.5, 1)',
                        }}
                    >
                        <div
                            class={`flex-1 w-full h-full overflow-auto modal-scrollable ${props.class || ''}`}
                            onScroll={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {props.children}
                        </div>

                        {props.showCloseButton !== false && <CloseButton onClose={handleClose} />}
                    </Motion>
                </Show>
            </Presence>
        </Portal>
    );
};

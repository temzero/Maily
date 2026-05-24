// components/ui/Overlay.tsx
import { ParentProps, onCleanup, createEffect, onMount, createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { VsClose } from 'solid-icons/vs';
import Button from './ui/Button';

interface OverlayProps extends ParentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showCloseButton?: boolean;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    children: JSX.Element;
}

export function Overlay(props: OverlayProps) {
    const [isVisible, setIsVisible] = createSignal(false);
    const [isClosing, setIsClosing] = createSignal(false);
    let previousOverflow: string;

    // Lock scroll when overlay is open
    createEffect(() => {
        if (props.isOpen) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setIsClosing(false);
            document.body.style.overflow = previousOverflow;
        }
    });

    onCleanup(() => {
        document.body.style.overflow = previousOverflow;
    });

    const handleClose = () => {
        if (isClosing()) return; // Prevent double close
        setIsClosing(true);
        setIsVisible(false);

        setTimeout(() => {
            props.onClose();
        }, 300);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.closeOnEscape !== false && props.isOpen) {
            handleClose();
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onCleanup(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    return (
        <Portal>
            <div class="fixed inset-0 z-50">
                {/* Backdrop with fade */}
                <div
                    class={`absolute inset-0 bg-black/60 backdrop-blur transition-all duration-300 ${
                        isVisible() && !isClosing() ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={() => {
                        if (props.closeOnClickOutside !== false && !isClosing()) {
                            handleClose();
                        }
                    }}
                />

                {/* Close button */}
                {props.showCloseButton !== false && (
                    <Button
                        variant="ghost"
                        size="xl"
                        onClick={handleClose}
                        leftIcon={<VsClose size={24} />} // 32 is a bit large
                        class={`absolute top-2 right-2 z-20 text-white hover:bg-white/20 transition-all duration-300 ${
                            isVisible() && !isClosing()
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-50'
                        }`}
                        aria-label="Close"
                        isRounded={true}
                    />
                )}

                {/* Title (optional) */}
                {props.title && (
                    <div
                        class={`absolute top-4 left-4 z-20 text-white text-xl font-semibold transition-all duration-300 ${
                            isVisible() && !isClosing() ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {props.title}
                    </div>
                )}

                {/* Content */}
                <div
                    class={`fixed inset-0 z-10 flex items-center justify-center transition-all duration-300 ${
                        isVisible() && !isClosing() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    {props.children}
                </div>
            </div>
        </Portal>
    );
}
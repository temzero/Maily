import { Show, createSignal, onCleanup } from 'solid-js';
import { Motion } from 'solid-motionone';

type Props = {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: any;
};

export default function Modal(props: Props) {
    const [shouldRender, setShouldRender] = createSignal(false);
    const [isAnimatingOut, setIsAnimatingOut] = createSignal(false);

    const duration = 0.12

    // Handle open
    if (props.isOpen && !shouldRender()) {
        setShouldRender(true);
    }

    // Handle close with animation
    const handleClose = () => {
        if (!props.isOpen) return;
        setIsAnimatingOut(true);
        // setTimeout(() => {
        //     executeClose();
        // }, 200);
    };

    const executeClose = () => {
        setShouldRender(false);
        setIsAnimatingOut(false);
        props.onClose();
    };

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.isOpen && !isAnimatingOut()) {
            handleClose();
        }
    };

    // Add event listener when modal is open
    if (props.isOpen) {
        window.addEventListener('keydown', handleKeyDown);
        onCleanup(() => {
            window.removeEventListener('keydown', handleKeyDown);
        });
    }

    // Handle external close (when isOpen becomes false)
    if (!props.isOpen && shouldRender() && !isAnimatingOut()) {
        handleClose();
    }

    return (
        <Show when={shouldRender()}>
            <div
                class="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <Motion
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isAnimatingOut() ? 0 : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration }}
                    class="absolute inset-0 bg-black/50"
                    onClick={handleClose}
                />
                <Motion
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{
                        opacity: isAnimatingOut() ? 0 : 1,
                        scale: isAnimatingOut() ? 0.75 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration }}
                    onMotionComplete={() => {
                        if (isAnimatingOut()) {
                            executeClose();
                        }
                    }}
                    class="relative bg-(--background) rounded-lg shadow-lg w-full max-w-md p-1"
                >
                    {/* Pass handleClose to children */}
                    {typeof props.children === 'function'
                        ? props.children(handleClose)
                        : props.children}
                </Motion>
            </div>
        </Show>
    );
}

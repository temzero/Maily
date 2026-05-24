// components/layouts/MailLayout.tsx
import { useNavigate } from '@solidjs/router';
import { ParentProps, JSX, onMount, onCleanup, createSignal, createMemo } from 'solid-js';
import ActionButton from '~/components/ui/ActionButton';
import { Motion, Presence } from 'solid-motionone';
import { getMailLayoutAnimation } from '~/utils/animations';
import { isOverlayMode } from '~/store/modal/composeModal.store';

interface MailLayoutProps {
    showCloseButton?: boolean;
    onClose?: () => void;
    isStartAnimation?: boolean; // Slide up animation on mount
    isEndAnimation?: boolean; // Slide down animation on unmount
    isDisplayDetail?: boolean; // Whether to show the UnsealedMailDetail component
    actionButton?: {
        onClick: () => void;
        icon: JSX.Element;
        label: string;
        variant?: 'primary' | 'secondary' | 'danger';
        size?: 'sm' | 'md' | 'lg' | 'xl';
        position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
        show?: boolean;
    };
    footerElement?: JSX.Element; // New prop for custom footer content
}

export default function MailLayout(props: ParentProps<MailLayoutProps>) {
    console.log('MailLayout')
    const navigate = useNavigate();
    const [isClosing, setIsClosing] = createSignal(false);

    // Default to true if not specified
    const shouldStartAnimation = () => props.isStartAnimation !== false;
    const shouldEndAnimation = () => props.isEndAnimation !== false;

    const handleClose = () => {
        if (isClosing()) return;

        // Only trigger end animation if enabled
        if (shouldEndAnimation()) {
            setIsClosing(true);

            // Wait for animation to complete before actually closing
            setTimeout(() => {
                if (props.onClose) {
                    props.onClose();
                } else {
                    navigate(-1);
                }
            }, 280); // Match this with your animation duration
        } else {
            // Close immediately without animation
            if (props.onClose) {
                props.onClose();
            } else {
                navigate(-1);
            }
        }
    };

    // Handle Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isClosing()) {
            e.preventDefault();
            handleClose();
        }
    };

    // Add event listener when component mounts
    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    // Remove event listener when component unmounts
    onCleanup(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    // Get position classes for action button
    const getPositionClasses = () => {
        const position = props.actionButton?.position || 'bottom-right';
        switch (position) {
            case 'bottom-right':
                return 'fixed right-4 bottom-4';
            case 'bottom-left':
                return 'fixed left-4 bottom-4';
            case 'top-right':
                return 'fixed right-4 top-4';
            case 'top-left':
                return 'fixed left-4 top-4';
            default:
                return 'fixed right-4 bottom-4';
        }
    };

    const animationProps = createMemo(() => {
        return getMailLayoutAnimation(shouldStartAnimation(), shouldEndAnimation());
    });

    return (
        <div class="min-h-screen flex flex-col items-center justify-center overflow-auto">
            <div
                class={`flex flex-col items-center justify-center  w-150 min-h-screen transition-all ease-in-out  ${isOverlayMode() ? 'pb-16 scale-90' : ' py-16'} `}
            >
                <Presence>
                    <Motion
                        {...animationProps()}
                        id="writing-paper"
                        class={`paper p-8!`}
                    >
                        {props.children}
                    </Motion>
                </Presence>
            </div>

            {props.footerElement && (
                <div class="w-170 custom-border mt-8 mb-20">{props.footerElement}</div>
            )}

            {/* Action Button */}
            {props.actionButton && props.actionButton.show !== false && !isOverlayMode() && (
                <ActionButton
                    onClick={props.actionButton.onClick}
                    icon={props.actionButton.icon}
                    aria-label={props.actionButton.label}
                    variant={props.actionButton.variant || 'primary'}
                    size={props.actionButton.size || 'xl'}
                    class={`${getPositionClasses()} hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform z-10`}
                    name={props.actionButton.label} // Pass label as name for accessibility
                />
            )}
        </div>
    );
}

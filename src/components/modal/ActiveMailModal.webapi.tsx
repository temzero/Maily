// components/email/ActiveEmailModal.tsx
import { Portal } from 'solid-js/web';
import { createEffect, createSignal, onCleanup, Show, onMount, on } from 'solid-js';
import { BackButton } from '~/components/ui/button/BackButton';
import Compose from '../compose/Compose';
import { MailContent } from '../email/MailContent';
import { Email, EmailFolder } from '~/types/email/email.type';
import { audioManager } from '~/utils/audioManager';
import { clearActiveEmailId, uiStore } from '~/stores/ui.store';
import { getEmailById } from '~/stores/email/email.selectors';
import { openComposeDraft } from '~/stores/modal/composeModal.store';
import { useDevice } from '~/stores/device.store';

// export const transitionZoomDuration = 400;
export const transitionZoomDuration = 1000;
const easing = 'ease-in-out';
const overlayColor = 'rgba(0, 0, 0, 0.75)';
const backdropBlur = true;

interface EmailModalProps {
    zIndex?: number;
}

export function ActiveEmailModal(props: EmailModalProps) {
    const { isMobile } = useDevice()

    const emailId = () => uiStore.activeEmailId;

    const [isOpen, setIsOpen] = createSignal(false);
    const [showActiveElement, setShowActiveElement] = createSignal(false);
    let cloneContainerRef: HTMLDivElement | undefined;

    const moveUpDistance = 100
    const moveUpDuration = transitionZoomDuration / 2;
    const zoomDuration = transitionZoomDuration / 2

    const animateOpen = (element: HTMLElement, rect: DOMRect, finalScale: number) => {
        setIsOpen(true);
        // Stage 1: Move up 50px
        const moveUpAnimation = element.animate(
            [
                { 
                    transform: `translate(${rect.left}px, ${rect.top}px) scale(1)`,
                    opacity: 1
                },
                { 
                    transform: `translate(${rect.left}px, ${rect.top - moveUpDistance}px) scale(1)`,
                    opacity: 1
                }
            ],
            {
                duration: moveUpDuration,
                // easing: 'ease-out',
                fill: 'forwards'
            }
        );

        // Stage 2: Scale to full screen from moved up position
        moveUpAnimation.onfinish = () => {
            const finalAnimation = element.animate(
                [
                    { 
                        transform: `translate(${rect.left}px, ${rect.top - moveUpDistance}px) scale(1)`,
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        opacity: 1
                    },
                    { 
                        transform: `translate(-50%, -50%) scale(${finalScale})`,
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        opacity: 0
                    }
                ],
                {
                    duration: zoomDuration,
                    // easing: 'ease-in-out',
                    fill: 'forwards'
                }
            );

            finalAnimation.onfinish = () => {
                setShowActiveElement(true);
            };
        };
    };

    const animateClose = (element: HTMLElement, rect: DOMRect, finalScale: number) => {
        // Reverse animation: scale down to moved up position, then move down to original
        const scaleDownAnimation = element.animate(
            [
                { 
                    transform: `translate(-50%, -50%) scale(${finalScale})`,
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    opacity: 0
                },
                { 
                    transform: `translate(${rect.left}px, ${rect.top - moveUpDistance}px) scale(1)`,
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    opacity: 1
                }
            ],
            {
                duration: zoomDuration,
                // easing: 'ease-in-out',
                fill: 'forwards'
            }
        );

        // Stage 2: Move down to original position
        scaleDownAnimation.onfinish = () => {
            const moveDownAnimation = element.animate(
                [
                    { 
                        transform: `translate(${rect.left}px, ${rect.top - moveUpDistance}px) scale(1)`,
                        opacity: 1
                    },
                    { 
                        transform: `translate(${rect.left}px, ${rect.top}px) scale(1)`,
                        opacity: 1
                    }
                ],
                {
                    duration: moveUpDuration,
                    // easing: 'ease-in-out',
                    // easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    fill: 'forwards'
                }
            );

            moveDownAnimation.onfinish = () => {
                clearActiveEmailId();
                setIsOpen(false);
                setShowActiveElement(false);
            };
        };
    };

    const handleClose = () => {
        // First hide the active content
        setShowActiveElement(false);
        
        // Then trigger the closing animation on the clone
        const cloneElement = cloneContainerRef?.querySelector(`#clone-mail-item-${emailId()}`);
        const originalElement = document.getElementById(`mail-item-${emailId()}`);
        
        if (cloneElement && originalElement) {
            const rect = originalElement.getBoundingClientRect();
            const finalScale = calculateFinalScale(rect);
            animateClose(cloneElement as HTMLElement, rect, finalScale);
        } else {
            // Fallback if elements not found
            setIsOpen(false);
            clearActiveEmailId();
        }
    };

    const calculateFinalScale = (rect: DOMRect) => {
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        return Math.max(scaleX, scaleY);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    onMount(() => {
        setIsOpen(true);
        
        // Start the opening animation after the clone is rendered
        setTimeout(() => {
            const cloneElement = cloneContainerRef?.querySelector(`#clone-mail-item-${emailId()}`);
            const originalElement = document.getElementById(`mail-item-${emailId()}`);
            
            if (cloneElement && originalElement) {
                const rect = originalElement.getBoundingClientRect();
                const finalScale = calculateFinalScale(rect);
                animateOpen(cloneElement as HTMLElement, rect, finalScale);
            } else {
                // Fallback if elements not found
                setShowActiveElement(true);
            }
        }, 50);
    });

    createEffect(() => {
        const id = emailId();
        if (id) {
            window.addEventListener('keydown', handleKeyDown);
            onCleanup(() => {
                window.removeEventListener('keydown', handleKeyDown);
            });
        }
    });

    const ActiveComponent = ({
        email,
        isDraft,
        onClose,
    }: {
        email: Email;
        isDraft: boolean;
        onClose: () => void;
    }) => {
        if (isDraft) {
            openComposeDraft(email);
            return <Compose onClose={onClose} />;
        } else {
            return <MailContent email={email} onClose={handleClose} />;
        }
    };

    return (
        <Show when={emailId()}>
            {(emailId) => {
                const email = getEmailById(emailId());
                if (!email) return null;
                const isDraft = email.folder === EmailFolder.DRAFTS;
                const isMyMail = email.folder === EmailFolder.SENT;
                if (!email.isRead && !isDraft && !isMyMail) {
                    audioManager.play('markAsReadMail');
                }

                return (
                    <Portal>
                        <div
                            class="fixed inset-0"
                            style={{
                                'z-index': props.zIndex ?? 9999,
                            }}
                        >
                            <div
                                class="fixed inset-0"
                                style={{
                                    'background-color': overlayColor,
                                    'backdrop-filter': backdropBlur ? 'blur(12px)' : 'none',
                                    transition: `opacity ${transitionZoomDuration}ms ${easing}`,
                                    opacity: isOpen() ? 1 : 0,
                                }}
                            />

                            {/* Animated clone container */}
                            <div
                                ref={cloneContainerRef}
                                innerHTML={(() => {
                                    const original = document.getElementById(
                                        `mail-item-${emailId()}`
                                    );
                                    if (!original) return '';
                                    const clone = original.cloneNode(true) as HTMLElement;
                                    clone.id = `clone-mail-item-${emailId()}`;
                                    
                                    // Force the clone to have explicit dimensions
                                    const computedStyle = window.getComputedStyle(original);
                                    const computedWidth = computedStyle.width;
                                    const computedHeight = computedStyle.height;
                                    
                                    clone.style.width = computedWidth;
                                    clone.style.height = computedHeight;
                                    clone.style.display = 'block';
                                    clone.style.position = 'fixed';
                                    clone.style.top = '0';
                                    clone.style.left = '0';
                                    clone.style.margin = '0';
                                    
                                    return clone.outerHTML;
                                })()}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    'pointer-events': 'none',
                                    'z-index': 10000,
                                }}
                            />

                            <div class="h-full overflow-y-auto">
                                <Show when={showActiveElement() && isOpen()}>
                                    <BackButton onClose={handleClose} isFixed={true} />

                                    <ActiveComponent
                                        email={email}
                                        isDraft={isDraft}
                                        onClose={handleClose}
                                    />
                                </Show>
                            </div>
                        </div>
                    </Portal>
                );
            }}
        </Show>
    );
}
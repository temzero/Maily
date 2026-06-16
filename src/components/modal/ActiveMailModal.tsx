// components/email/ActiveEmailModal.tsx
import { Portal } from 'solid-js/web';
import { createEffect, createSignal, onCleanup, Show, onMount } from 'solid-js';
import { BackButton } from '~/components/ui/button/BackButton';
import Compose from '../compose/Compose';
import { MailContent } from '../email/MailContent';
import { Email, EmailFolder } from '~/types/email/email.type';
import { audioManager } from '~/utils/audioManager';
import { getZoomAnimationStyle } from '~/utils/zoomAnimation.utils';
import { clearActiveEmailId, uiStore } from '~/stores/ui.store';
import { getEmailById } from '~/stores/email/email.selectors';
import { openComposeDraft } from '~/stores/modal/composeModal.store';
import { useDevice } from '~/stores/device.store';

export const transitionZoomDuration = 400;
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

    const handleClose = () => {
        setShowActiveElement(false);
        setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    const handleAnimationEnd = () => {
        if (!showActiveElement()) {
            if (isOpen()) {
                setShowActiveElement(true);
            } else {
                clearActiveEmailId();
            }
        }
    };

    onMount(() => {
        setShowActiveElement(false);
        setIsOpen(true);
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

                            {/* Animated clone container - use innerHTML directly */}
                            <div
                                // innerHTML={(() => {
                                //     const original = document.getElementById(
                                //         `mail-item-${emailId()}`
                                //     );
                                //     if (!original) return '';
                                //     const clone = original.cloneNode(true) as HTMLElement;
                                //     clone.id = `clone-mail-item-${emailId()}`; // ← Set a new unique ID
                                //     return clone.outerHTML;
                                // })()}
                                 innerHTML={(() => {
                                    const original = document.getElementById(
                                        `mail-item-${emailId()}`
                                    );
                                    if (!original) return '';
                                    const clone = original.cloneNode(true) as HTMLElement;
                                    clone.id = `clone-mail-item-${emailId()}`;
                                    
                                    // Force the clone to have explicit dimensions
                                    // by copying computed styles
                                    const computedStyle = window.getComputedStyle(original);
                                    const computedWidth = computedStyle.width;
                                    const computedHeight = computedStyle.height;
                                    
                                    // Apply explicit dimensions to the clone
                                    clone.style.width = computedWidth;
                                    clone.style.height = computedHeight;
                                    clone.style.display = 'block'; // Ensure display is set
                                    
                                    return clone.outerHTML;
                                })()}
                                style={
                                    getZoomAnimationStyle(
                                        `mail-item-${emailId()}`,
                                        isOpen(),
                                        undefined,
                                        undefined,
                                        easing,
                                        isMobile
                                    )
                                }
                                onTransitionEnd={(e) => {
                                    if (e.propertyName === 'transform') {
                                        handleAnimationEnd()
                                    }
                                }}
                                onAnimationEnd={(e) => {
                                    handleAnimationEnd()
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
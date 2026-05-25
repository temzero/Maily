import { Show, onMount, onCleanup } from 'solid-js';
import { VsArrowRight, VsReply } from 'solid-icons/vs';
import ActionButton from '~/components/ui/ActionButton';
import { Email, EmailFolder } from '~/types/email/email.type';
import { UnsealedMailDetail } from './UnsealedMailDetail';
import {
    isOverlayMode,
    openComposeForward,
    openComposeReply,
} from '~/store/modal/composeModal.store';
import ReadMailActions from '../actions/ReadMailAction';
import { Motion, Presence } from 'solid-motionone';
import { getMailLayoutAnimation } from '~/utils/animations';
import RenderAttachments from '../attachment/RenderAttachments';
import { audioManager } from '~/utils/audioManager';
import { markAsRead } from '~/store/email/email.actions';
import { setAgentMessages, clearAgentMessages } from '~/store/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';

interface MailContentProps {
    email: Email;
    onClose?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MailContent(props: MailContentProps) {
    const email = props.email;
    const attachments = email.attachments || [];

    const replyIcon = <VsReply size={30} class="scale-x-[-1] rotate-180" />;
    const forwardIcon = <VsArrowRight size={30} />;
    const isSent = email.folder === EmailFolder.SENT;
    const animationProps = getMailLayoutAnimation();

    console.log('MailContent', email.id);

    const handleClose = (): void => {
        props.onClose?.();
    };

    onMount(() => {
        if (!isSent) {
            setAgentMessages(mockAgentMessages.read(email.id, email.subject, handleClose));
        }
        audioManager.play('viewMail');
        if (!email.isRead) {
            markAsRead(email.id);
        }
    });

    onCleanup(() => {
        clearAgentMessages();
    });

    return (
        <div class="min-h-screen flex flex-col items-center justify-center overflow-auto">
            <Presence>
                <Motion {...animationProps}>
                    <div
                        class="flex flex-col items-center w-150 min-h-screen transition-all ease-in-out"
                        classList={{
                            'pb-16 scale-90': isOverlayMode(),
                            'py-16': !isOverlayMode(),
                        }}
                    >
                        <div id="writing-paper" class={`paper min-h-80 p-8!`}>
                            <h1 class="text-2xl font-semibold mb-3">{email.subject}</h1>
                            <div class="prose max-w-none" innerHTML={email.content ?? email.preview} />
                        </div>

                        <Show when={attachments.length > 0}>
                            <RenderAttachments attachments={attachments} class="pb-0!" />
                        </Show>
                    </div>
                </Motion>
            </Presence>

            <div class="mb-10">
                <UnsealedMailDetail email={email} />
            </div>

            <Show when={!isOverlayMode()}>
                <ActionButton
                    onClick={() => (isSent ? openComposeForward(email) : openComposeReply(email))}
                    icon={isSent ? forwardIcon : replyIcon}
                    variant="primary"
                    size="xl"
                    class="fixed right-4 bottom-4 hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform z-10"
                    name={isSent ? 'Forward email' : `Reply to ${email.from}`}
                />
                <ReadMailActions emailId={email.id} />
            </Show>
        </div>
    );
}

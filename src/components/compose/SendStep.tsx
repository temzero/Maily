// components/compose/SendStep.tsx
import { createSignal, createEffect, Accessor, onMount } from 'solid-js';
import { Envelope } from '~/components/envelop/Envelop';
import { mailDimensions } from '~/data/constants';
import { Avatar } from '~/components/ui/Avatar';
import { currentUser } from '~/store/auth.store';
import { VsArrowRight } from 'solid-icons/vs';
import { validateEmail } from '~/utils/email.utils';
import { envelopeStore } from '~/store/envelope.store';
import { Motion } from 'solid-motionone';
import { setAgentMessages } from '~/store/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';

type Props = {
    isSending?: Accessor<boolean>;
    onSend: () => void;
    onMotionComplete?: () => void;
    subject: string;
    recipientEmail: string; // From parent
    onRecipientChange: (recipient: string, isValid: boolean) => void;
};

export default function SendStep(props: Props) {
    const [recipientError, setRecipientError] = createSignal(''); // Local error state only
    let recipientRef: HTMLInputElement | undefined;

    onMount(() => {
        setAgentMessages(mockAgentMessages.sent);
    });

    createEffect(() => {
        setTimeout(() => {
            recipientRef?.focus();
        }, 100);
    });

    const handleRecipientChange = (e: Event) => {
        const value = (e.currentTarget as HTMLInputElement).value;

        let isValid = false;
        if (value && !validateEmail(value)) {
            setRecipientError('Please enter a valid email address');
            isValid = false;
        } else if (!value) {
            setRecipientError('Recipient email is required');
            isValid = false;
        } else {
            setRecipientError('');
            isValid = true;
        }

        // Send just the value and validity to parent
        props.onRecipientChange(value, isValid);
    };

    const handleSend = () => {
        if (!props.recipientEmail) {
            setRecipientError('Recipient email is required');
            props.onRecipientChange(props.recipientEmail, false);
            return;
        }

        if (!validateEmail(props.recipientEmail)) {
            setRecipientError('Please enter a valid email address');
            props.onRecipientChange(props.recipientEmail, false);
            return;
        }

        props.onSend();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !recipientError() && props.recipientEmail) {
            handleSend();
        }
    };

    const getSendStepAnimation = (isSending: boolean) => ({
        initial: { opacity: 0, scale: 0.75, y: 900 },
        animate: isSending
            ? { scale: 1.25, y: -900, opacity: 0.8 }
            : { scale: 1, y: 0, opacity: 1 },
        exit: { opacity: 0, scale: 0.75, y: 900 },
        transition: { duration: 0.4, ease: 'easeInOut' },
    });

    return (
        <Motion
            {...getSendStepAnimation(props.isSending?.() || false)}
            onMotionComplete={() => {
                if (props.isSending?.() && props.onMotionComplete) {
                    props.onMotionComplete();
                }
            }}
            class="fixed inset-0 flex items-center justify-center pointer-events-none"
        >
            <Envelope
                width={mailDimensions.width * 3}
                height={mailDimensions.height * 3}
                borderWidth={16}
                envelope={envelopeStore.getCurrentEnvelope()!}
            >
                <div class="w-full h-full flex flex-col justify-between p-1 pointer-events-auto">
                    <h1 class="font-bold text-4xl p-1">{props.subject || '???'}</h1>

                    {/* footer input */}
                    <div class="flex gap-2 items-end justify-between">
                        <div class="flex items-center gap-2">
                            <Avatar
                                src={currentUser()?.avatarUrl}
                                name={`${currentUser()?.firstName} ${currentUser()?.lastName}`}
                                size="lg"
                            />
                            <div class="flex flex-col -space-y-1">
                                <h1 class="font-bold text-xl">{`${currentUser()?.firstName} ${currentUser()?.lastName}`}</h1>
                                <p>{`${currentUser()?.email}`}</p>
                            </div>
                        </div>

                        <VsArrowRight size={32} />

                        <div class="space-y-1 flex-1 pointer-events-auto">
                            {recipientError() && (
                                <p class="text-sm text-red-500">{recipientError()}</p>
                            )}
                            <input
                                ref={recipientRef}
                                type="email"
                                value={props.recipientEmail}
                                onInput={handleRecipientChange}
                                onKeyDown={handleKeyDown}
                                placeholder="recipient@example.com"
                                class={`w-full text-lg border-3 border-(--border) rounded outline-none px-1
                                ${recipientError() ? 'border-red-500' : 'focus:border-blue-500'}`}
                            />
                        </div>
                    </div>
                </div>
            </Envelope>
        </Motion>
    );
}

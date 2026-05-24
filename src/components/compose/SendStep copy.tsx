// components/compose/SendStep.tsx
import { createSignal, createEffect } from 'solid-js';
import { Motion, Presence } from 'solid-motionone';
import { Envelope } from '~/components/envelop/Envelop';
import { mailDimensions } from '~/data/constants';
import { Avatar } from '~/components/ui/Avatar';
import { currentUser } from '~/store/auth.store';
import { VsArrowRight } from 'solid-icons/vs';
import { validateEmail } from '~/utils/email.utils';
import { envelopeStore } from '~/store/envelope.store';

type Props = {
    onSend: () => void;
    subject: string;
    recipientEmail?: string;
    onRecipientChange: (recipient: string, isValid: boolean) => void;
};

export default function SendStep(props: Props) {
    const [recipientEmail, setRecipientEmail] = createSignal(props.recipientEmail || '');
    const [recipientError, setRecipientError] = createSignal('');

    let recipientRef: HTMLInputElement | undefined;

    createEffect(() => {
        setTimeout(() => {
            recipientRef?.focus();
        }, 100);
    });

    const handleRecipientChange = (e: Event) => {
        const value = (e.currentTarget as HTMLInputElement).value;
        setRecipientEmail(value);

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

        props.onRecipientChange(value, isValid);
    };

    const handleSend = () => {
        if (!recipientEmail()) {
            setRecipientError('Recipient email is required');
            props.onRecipientChange(recipientEmail(), false);
            return;
        }

        if (!validateEmail(recipientEmail())) {
            setRecipientError('Please enter a valid email address');
            props.onRecipientChange(recipientEmail(), false);
            return;
        }

        props.onSend();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !recipientError() && recipientEmail()) {
            handleSend();
        }
    };

    return (
        <div class="flex flex-col items-center justify-center min-h-screen py-16">
            <Envelope
                width={mailDimensions.width * 3}
                height={mailDimensions.height * 3}
                borderWidth={16}
                envelope={envelopeStore.getCurrentEnvelope()!}
            >
                <div class="w-full h-full flex flex-col justify-between p-1">
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

                        <div class="space-y-1 flex-1">
                            {recipientError() && (
                                <p class="text-sm text-red-500">{recipientError()}</p>
                            )}
                            <input
                                ref={recipientRef}
                                type="email"
                                value={recipientEmail()}
                                onInput={handleRecipientChange}
                                onKeyDown={handleKeyDown}
                                placeholder="recipient@example.com"
                                class={`w-full text-lg border-3 border-(--border) rounded outline-none px-1
                                ${recipientError() ? 'border-red-500' : ' focus:border-blue-500'}`}
                            />
                        </div>
                    </div>
                </div>
            </Envelope>
        </div>
    );
}

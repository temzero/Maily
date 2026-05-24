// components/modal/Compose.tsx
"use client";

import { createSignal, createEffect, onCleanup, Switch, Match, onMount } from 'solid-js';
import { Email } from '~/types/email/email.type';
import SendStep from '~/components/compose/SendStep';
import ComposeStep from '~/components/compose/ComposeStep';
import EnvelopeStep from './EnvelopeStep';
import ComposeNavigation from './ComposeNavigation';
import ComposeTopIcon from './ComposeTopIcon';
import { envelopeStore } from '~/store/envelope.store';
import { Attachment } from '~/types/attachment/attachment.type';
import {
    isComposeContentValid,
    isEmailSendable,
    cleanupAttachmentBlobs,
    createDraftEmail,
    createSentEmail,
    formatReplySubject,
    formatForwardSubject,
} from '~/utils/compose.helper';
import { composeModalStore, ComposeModalType } from '~/store/modal/composeModal.store';
import { audioManager } from '~/utils/audioManager';
import toast from 'solid-toast';
import { addEmail, updateEmail } from '~/store/email/email.actions';
import { setAgentMessages, clearAgentMessages } from '~/store/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';

export const enum ComposeStepType {
    COMPOSE = 'compose',
    SEND = 'send',
    ENVELOPE = 'envelope',
}

export interface ComposeProps {
    onClose?: () => void;
    onSend?: () => void;
}

export default function Compose(props: ComposeProps) {
    let composeType = composeModalStore.type; // Capture at component creation

    const [step, setStep] = createSignal<ComposeStepType>(
        composeType === ComposeModalType.FORWARD ? ComposeStepType.SEND : ComposeStepType.COMPOSE
    );
    const [subject, setSubject] = createSignal('');
    const [content, setContent] = createSignal('');
    const [attachments, setAttachments] = createSignal<Attachment[]>([]);
    const [originalEmail, setOriginalEmail] = createSignal<Email | null>(null);
    const [recipient, setRecipient] = createSignal('');
    const [isRecipientValid, setIsRecipientValid] = createSignal(false);
    const [isSending, setIsSending] = createSignal(false);

    const isComposeValid = () => {
        return isComposeContentValid(subject(), content(), attachments());
    };

    const isSendable = () => {
        return isEmailSendable(subject(), content(), isRecipientValid());
    };

    const saveToDraft = () => {
        // Use composeType as default
        if (
            composeType === ComposeModalType.REPLY ||
            composeType === ComposeModalType.FORWARD ||
            isSending()
        )
            return;
        if (!isComposeValid()) return;

        const emailData = {
            subject: subject(),
            content: content(),
            to: [recipient()],
            attachments: attachments(),
            updatedAt: new Date().toISOString(),
        };

        if (composeType === ComposeModalType.DRAFT && composeModalStore.email) {
            updateEmail(composeModalStore.email.id, emailData);
        } else if (composeType === ComposeModalType.NEW) {
            const newDraft = createDraftEmail(
                Date.now().toString(),
                recipient(),
                subject(),
                content(),
                attachments()
            );
            addEmail(newDraft as Email);
            toast.success('Draft saved');
        }
    };

    const handleSend = () => {
        if (isSendable()) {
            setIsSending(true); // This triggers the exit animation
            audioManager.play('sentMail');
        }
    };

    const executeSend = () => {
        // Actual send logic
        const newEmail = createSentEmail(
            Date.now().toString(),
            recipient(),
            subject(),
            content(),
            attachments(),
            envelopeStore.getCurrentEnvelope()
        );

        addEmail(newEmail as Email);

        toast.success(`Sent email to ${recipient()}`);
        cleanupAttachmentBlobs(attachments());

        // No setTimeout needed - animation already completed
        props.onClose?.();
        props.onSend?.();
    };

    const handleRecipientChange = (newRecipient: string, isValid: boolean) => {
        setRecipient(newRecipient);
        setIsRecipientValid(isValid);
    };

    onMount(() => {
        if (composeType === ComposeModalType.REPLY) {
            setAgentMessages(mockAgentMessages.reply);
        } else {
            setAgentMessages(mockAgentMessages.compose);
        }

        audioManager.play('openCompose');
    });

    // Initialize from store
    createEffect(() => {
        const type = composeModalStore.type;
        const email = composeModalStore.email;

        if (type === ComposeModalType.DRAFT && email) {
            setSubject(email.subject || '');
            setContent(email.content || '');
            setRecipient(email.to?.[0] || '');
            setIsRecipientValid(!!email.to);
            setOriginalEmail(null);
            setAttachments(email.attachments || []);
        } else if (type === ComposeModalType.REPLY && email) {
            setSubject(formatReplySubject(email.subject));
            setContent('');
            setOriginalEmail(email);
            setRecipient(email.from);
            setIsRecipientValid(true);
            setAttachments([]);
        } else if (type === ComposeModalType.FORWARD && email) {
            setSubject(formatForwardSubject(email.subject));
            setContent(email.content || '');
            setRecipient('');
            setIsRecipientValid(false);
            setOriginalEmail(email);
            setAttachments(email.attachments || []);
        } else {
            setSubject('');
            setContent('');
            setOriginalEmail(null);
            setRecipient('');
            setIsRecipientValid(false);
            setAttachments([]);
        }
    });

    createEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            saveToDraft();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        onCleanup(() => window.removeEventListener('beforeunload', handleBeforeUnload));
    });

    onCleanup(() => {
        clearAgentMessages();
        // toast(`composeType: ${composeType}`); // Use composeType
        if (
            isComposeValid() &&
            composeType !== ComposeModalType.REPLY && // Use composeType
            composeType !== ComposeModalType.FORWARD &&
            !isSending()
        ) {
            saveToDraft();
        }
        cleanupAttachmentBlobs(attachments());
    });

    return (
        <>
            <ComposeTopIcon step={step} />
            <ComposeNavigation
                step={step}
                setStep={setStep}
                isComposeValid={isComposeValid}
                isSendable={isSendable}
                onSend={handleSend}
            />
            <Switch>
                <Match when={step() === ComposeStepType.COMPOSE}>
                    <ComposeStep
                        subject={subject}
                        content={content}
                        attachments={attachments}
                        setSubject={setSubject}
                        setContent={setContent}
                        setAttachments={setAttachments}
                        originalEmail={originalEmail}
                    />
                </Match>

                <Match when={step() === ComposeStepType.SEND}>
                    <SendStep
                        isSending={isSending}
                        onSend={() => setIsSending(true)}
                        subject={subject()}
                        recipientEmail={recipient()}
                        onRecipientChange={handleRecipientChange}
                        onMotionComplete={() => {
                            if (isSending()) {
                                executeSend();
                                setIsSending(false);
                            }
                        }}
                    />
                </Match>

                <Match when={step() === ComposeStepType.ENVELOPE}>
                    <EnvelopeStep subject={subject()} setStep={setStep} />
                </Match>
            </Switch>
        </>
    );
}

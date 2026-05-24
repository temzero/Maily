import { Component, Match, Switch, Show } from 'solid-js';
import { Email, EmailFolder } from '~/types/email/email.type';
import { SealedMail } from './SealedMail';
import { UnsealedMail } from './UnsealedMail';
import { DraftMail } from './DraftMail';
import { SentMail } from './SentMail';
import { getRenderLabelIconsByIds } from '~/store/label.store';
import { mailDimensions } from '~/data/constants';
import { TiStarburst } from 'solid-icons/ti';

interface MailProps {
    email: Email;
    width?: number;
    height?: number;
    isFocusing?: boolean;
    class?: string;
    ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
}

export const Mail: Component<MailProps> = (props) => {
    const isRead = () => props.email.isRead ?? false;
    const isSent = () => props.email.folder === EmailFolder.SENT;
    const isDraft = () => props.email.folder === EmailFolder.DRAFTS;
    const hasAttachments = () => props.email.attachments && props.email.attachments.length > 0;

    const width = props.width || mailDimensions.width;
    const height = props.height || mailDimensions.height;

    const labels = () => {
        if (!props.email.labelIds?.length) return null;
        return getRenderLabelIconsByIds(props.email.labelIds);
    };

    return (
        <div
            id={`mail-item-${props.email.id}`}
            ref={props.ref}
            class={`relative ${props.class}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <Show when={props.email.isNew && !props.email.isRead}>
                <div class="absolute -top-2.5 -left-2.5 z-10 text-red-500 fill-current rounded-ful">
                    <div class="relative">
                        <TiStarburst size={28} />
                        <span class="absolute inset-0 flex items-center justify-center font-bold text-white">
                            !
                        </span>
                    </div>
                </div>
            </Show>

            {/* Labels */}
            <div class="absolute -bottom-2.5 right-1 z-10 flex gap-0.5">
                {labels()?.map((label) => (
                    <div
                        style={{
                            background: label.color,
                            width: '20px',
                            height: '20px',
                        }}
                        class="rounded flex items-center justify-center text-white"
                    >
                        {label.iconElement}
                    </div>
                ))}
            </div>

            {/* Attachment */}
            {hasAttachments() && (
                <svg
                    class={`absolute -top-1 -right-1 z-10 w-5 h-8 fill-current bg-black/60 text-white backdrop-blur rounded-xl py-0.5 ${
                        isRead() ? 'opacity-60' : ''
                    }`}
                    viewBox="2 0 20 24"
                >
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                </svg>
            )}

            {/* Envelope */}
            <Switch>
                <Match when={isDraft()}>
                    <DraftMail email={props.email} width={width} height={mailDimensions.height} />
                </Match>
                <Match when={isSent()}>
                    <SentMail email={props.email} width={width} height={height} />
                </Match>
                <Match when={isRead()}>
                    <UnsealedMail
                        email={props.email}
                        class={props.isFocusing ? 'opacity-100!' : ''}
                        width={width}
                        height={height}
                    />
                </Match>
                <Match when={!isRead()}>
                    <SealedMail email={props.email} width={width} height={height} />
                </Match>
            </Switch>
        </div>
    );
};

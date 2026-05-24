// components/email/SealedMail.tsx
import { Component } from 'solid-js';
import { Email } from '~/types/email/email.type';
import { mailDimensions } from '~/data/constants';
import { Envelope } from '../envelop/Envelop';
import { getSenderDisplayName } from '~/utils/emailParser';
import { formatDate } from '~/utils/formatDate';

interface SealedMailProps {
    email: Email;
    width?: number;
    height?: number;
    class?: string;
    onClick?: () => void;
}

export const SealedMail: Component<SealedMailProps> = (props) => {
    const envelope = () => props.email.envelope;
    const displayName = () => getSenderDisplayName(props.email.from);

    const getInitials = () => {
        const name = displayName();
        if (name === 'Unknown Sender') return '?';
        // Take first two characters or first character if only one
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <Envelope
            envelope={envelope()}
            width={props.width ?? mailDimensions.width}
            height={props.height ?? mailDimensions.height}
            class={props.class}
            onClick={props.onClick}
        >
            <div class="flex flex-col gap-2 h-full min-h-0 select-none">
                {/* Top Section - Subject & Stamp */}
                <div class="flex justify-between gap-1 min-h-0">
                    <h1 class="font-bold px-1 overflow-hidden">
                        {props.email.subject || '(No Subject)'}
                    </h1>
                </div>

                {/* Bottom Section - Fixed position */}
                <div class="flex justify-between items-end mt-auto shrink-0">
                    {/* Avatar + Name - Bottom Left */}
                    <div class="flex items-end gap-1">
                        {/* Avatar */}
                        {props.email?.avatar ? (
                            <img
                                src={props.email.avatar}
                                alt="Avatar"
                                class="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {getInitials()}
                            </div>
                        )}

                        {/* Display Name */}
                        <div class="text-xs">{displayName()}</div>
                    </div>

                    {/* Created At - Bottom Right */}
                    <div class="text-[10px] opacity-60">{formatDate(props.email.createdAt)}</div>
                </div>
            </div>
        </Envelope>
    );
};

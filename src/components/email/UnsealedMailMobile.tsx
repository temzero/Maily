// components/email/UnsealedMailMobile.tsx
import { Component, Show } from 'solid-js';
import { Email } from '~/types/email/email.type';
import { mailDimensions } from '~/constants/constants';
import { Envelope } from '../envelop/Envelop';
import { getSenderDisplayName } from '~/utils/emailParser';
import { formatDate } from '~/utils/formatDate';
import { useDevice } from '~/stores/device.store';

interface SealedMailProps {
    email: Email;
    width?: number;
    height?: number;
    class?: string;
    isDarken: boolean;
    onClick?: () => void;
}

export const UnsealedMailMobile: Component<SealedMailProps> = (props) => {
    const { isMobile } = useDevice();
    const envelope = () => props.email.envelope;
    const displayName = () => getSenderDisplayName(props.email.from);

    const getInitials = () => {
        const name = displayName();
        if (name === 'Unknown Sender') return '?';
        // Take first two characters or first character if only one
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div class='envelope-shadow'>
            <div class='relative envelope-shadow teared-shape-mobile'>
                <Envelope
                    envelope={envelope()}
                    width={props.width ?? mailDimensions.width}
                    isFullWidth={isMobile()}
                    class={props.class}
                    onClick={props.onClick}
                    isDarken={props.isDarken}
                >
                    <div class="flex flex-col h-full min-h-0 select-none">

                        <div class="flex items-center justify-between p-1 pt-2! pb-0 shrink-0">
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
                                <div class="small-content-text">{displayName()}</div>
                            </div>

                            <div class="text-xs">{formatDate(props.email.createdAt)}</div>
                        </div>


                        {/* Top Section - Subject & Stamp */}
                        <div class="flex justify-between gap-1 min-h-0 px-1">
                            <h1 class="small-subject-text">
                                {props.email.subject || '(No Subject)'}
                            </h1>
                        </div>
                    </div>
                </Envelope>
            </div>
        </div>
    );
};

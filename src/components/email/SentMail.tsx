// components/email/SentMail.tsx
import { Component } from 'solid-js';
import { Email } from '~/types/email/email.type';
import { mailDimensions } from '~/data/constants';
import { Envelope } from '../envelop/Envelop';
import { getRecipientDisplayNames } from '~/utils/emailParser'; // New utility function
import { formatDate } from '~/utils/formatDate';
import { BiRegularPaperPlane, BiSolidPaperPlane } from 'solid-icons/bi';
import { OcPaperairplane2 } from 'solid-icons/oc';
import { FaSolidArrowRight } from 'solid-icons/fa';

interface SentMailProps {
    email: Email;
    width?: number;
    height?: number;
    class?: string;
    onClick?: () => void;
}

export const SentMail: Component<SentMailProps> = (props) => {
    const envelope = () => props.email.envelope;
    const recipientNames = () => getRecipientDisplayNames(props.email.to); // Get recipient name

    return (
        <Envelope
            envelope={envelope()}
            width={props.width ?? mailDimensions.width}
            height={props.height ?? mailDimensions.height}
            class={props.class}
            onClick={props.onClick}
        >
            <div class="flex flex-col gap-2 h-full min-h-0 select-none">
                <div class="flex justify-between gap-1 min-h-0 p-1">
                    <h1 class="small-subject-text">
                        {props.email.subject || '(No Subject)'}
                    </h1>
                </div>

                <div class="flex justify-between items-end mt-auto shrink-0">
                    <div class="flex gap-1 items-center bg-black/60 backdrop-blur text-white pr-1 rounded">
                        <FaSolidArrowRight size={12} />
                        <div class="text-xs">{recipientNames()}</div>
                    </div>
                    <div class="text-[10px] opacity-60">{formatDate(props.email.createdAt)}</div>
                </div>

            </div>
        </Envelope>
    );
};

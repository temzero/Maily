// components/email/UnsealedMailDetail.tsx
import { Component } from "solid-js";
import { Email } from "~/types/email/email.type";
import { Envelope } from "../envelop/Envelop";
import { formatFullDateTime } from "~/utils/formatDate";
import {
  getEmailAddress,
  getSenderDisplayName,
  getRecipientDisplayName,
} from "~/utils/emailParser";
import { currentUser } from "~/stores/auth.store";
import { AiOutlineArrowRight } from "solid-icons/ai";
import { useDevice } from '~/stores/device.store';

interface SealedMailProps {
  email: Email;
  width?: number;
  height?: number;
  class?: string;
  isFullWidth?: boolean;
  onClick?: () => void;
}

export const UnsealedMailDetail: Component<SealedMailProps> = (props) => {
  const { isMobile } = useDevice();
  const envelope = () => props.email.envelope;

  // Get sender info
  const senderEmail = getEmailAddress(props.email.from);
  const senderName = getSenderDisplayName(props.email.from);

  // Get recipient info (assuming email.to exists and is first recipient)
  const recipientEmail = getEmailAddress(props.email.to?.[0]);
  const recipientName =
    getRecipientDisplayName?.(props.email.to?.[0]) ||
    getSenderDisplayName(props.email.to?.[0]);

  const isSender =
    senderEmail && currentUser()?.email && senderEmail === currentUser()?.email;

  // Display recipient info when current user is the sender
  const displayEmail = isSender ? recipientEmail : senderEmail;
  const displayName = isSender ? recipientName : senderName;

  // Parse first and last name from full name
  const getFirstAndLastName = () => {
    const fullName = displayName;
    if (!fullName) return { firstName: "", lastName: "" };

    const nameParts = fullName.trim().split(" ");
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
    };
  };

  const getInitials = () => {
    const { firstName, lastName } = getFirstAndLastName();
    const first = firstName.charAt(0);
    const last = lastName.charAt(0);
    return (first + last).toUpperCase() || displayEmail.charAt(0).toUpperCase();
  };

  const avatarSizeClass = () => isMobile() ? 'h-8 w-8' : 'h-11 w-11';
  
  // Text size classes based on mobile
  const nameTextClass = () => isMobile() ? 'text-sm! font-bold' : 'small-subject-text';
  const emailTextClass = () => isMobile() ? 'text-xs!' : 'content-text';
  const dateTextClass = () => isMobile() ? 'text-xs!' : 'content-text';

  return (
    <Envelope
      envelope={envelope()}
      width={props.width}
      isFullWidth={props.isFullWidth}
      height={props.height}
      onClick={props.onClick}
      borderWidth={12}
      isUnsealed={true}
    >
      {/* Bottom Section */}
      <div class="h-full w-full flex-1 flex justify-between items-end p-2">
        <div class="flex items-center">
          {isSender && (
            <AiOutlineArrowRight size={isMobile() ? 24 : 40} class="-ml-2 opacity-70" />
          )}
          {/* Avatar + Name - Bottom Left */}
          <div class="flex items-end gap-2">
            {/* Avatar */}
            {props.email.avatar ? (
              <img
                src={props.email.avatar}
                alt="Avatar"
                class={`${avatarSizeClass()} rounded-full object-cover pointer-events-none select-none`}
              />
            ) : (
              <div class={`${avatarSizeClass()} rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold pointer-events-none select-none`}>
                {getInitials()}
              </div>
            )}

            {/* First Name + Last Name */}
            <div>
              <h1 class={`${nameTextClass()} leading-none!`}>
                {getFirstAndLastName().firstName}{" "}
                {getFirstAndLastName().lastName}
              </h1>
              <p class={`${emailTextClass()} leading-none! opacity-70`}>{displayEmail}</p>
            </div>
          </div>
        </div>

        {/* Created At - Bottom Right */}
        <div class={`${dateTextClass()} opacity-60 font-sans leading-none!`}>
          {formatFullDateTime(props.email.createdAt)}
        </div>
      </div>
    </Envelope>
  );
};
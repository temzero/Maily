// components/email/UnsealedMail.tsx
import { Component } from "solid-js";
import { Email } from "~/types/email/email.type";
import { mailDimensions } from "~/data/constants";
import { Envelope } from "../envelop/Envelop";
import { getEmailAddress, getSenderDisplayName } from "~/utils/emailParser";
import { formatDate } from "~/utils/formatDate";

interface SealedMailProps {
  email: Email;
  width?: number; // default: 270
  height?: number; // default: 190
  class?: string;
  onClick?: () => void;
}

export const UnsealedMail: Component<SealedMailProps> = (props) => {
  const envelope = () => props.email.envelope;

  // Using utility functions
  const senderName = () => getSenderDisplayName(props.email.from);
  const senderEmail = () => getEmailAddress(props.email.from);

  // Parse first and last name from full name
  const getFirstAndLastName = () => {
    const fullName = senderName();
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
    return (
      (first + last).toUpperCase() || senderEmail().charAt(0).toUpperCase()
    );
  };

  const previewContent = (props.email.preview ?? props.email.content ?? "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 200);

  return (
    <div
      class={`relative flex flex-col items-center justify-end opacity-50 select-none ${props.class}`}
      style={{
        width: `${props.width || mailDimensions.width}px`,
        height: `${props.height || mailDimensions.height}px`,
      }}
    >
      {/* Mail Content - Behind the envelope */}
      <div
        id="mail-content"
        class={`bg-white text-black p-2 overflow-hidden mb-1 `}
        style={{
          width: "90%",
          height: "calc(100% - 16px)", // Height from top to above envelope
        }}
      >
        <h1 class="text-sm font-bold mb-1">
          {props.email.subject || "(No Subject)"}
        </h1>
        {/* <p class="text-xs">{props.email.content || '(No Content)'}</p> */}
        <div class="prose max-w-none text-xs" innerHTML={previewContent} />
      </div>

      {/* Envelope - On top with higher z-index, centered at bottom */}
      <div class="absolute bottom-0 left-0 right-0">
        <Envelope
          envelope={envelope()}
          width={props.width}
          onClick={props.onClick}
          isUnsealed={true}
          isShadow={true}
        >
          {/* Bottom Section */}
          <div class="h-full w-full flex justify-between items-end">
            {/* Avatar + Name - Bottom Left */}
            <div class="flex items-end gap-1">
              {/* Avatar */}
              {props.email.avatar ? (
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

              {/* Display Name (prefer name, fallback to email username) */}
              <div class="text-xs font-sans">
                {getSenderDisplayName(props.email.from)}
              </div>
            </div>

            {/* Created At - Bottom Right */}
            <div class="text-[10px] opacity-60 font-sans">
              {formatDate(props.email.createdAt)}
            </div>
          </div>
        </Envelope>
      </div>
    </div>
  );
};

// components/email/DraftMail.tsx
import { Component } from "solid-js";
import { Email } from "~/types/email/email.type";
import { mailDimensions } from "~/data/constants";
import { getSenderDisplayName, getEmailAddress } from "~/utils/emailParser";
import { formatDate } from "~/utils/formatDate";
import { ImQuill } from "solid-icons/im";

interface DraftMailProps {
  email: Email;
  width?: number; // default: 270
  height?: number; // default: 190
  class?: string;
  onClick?: () => void;
}

export const DraftMail: Component<DraftMailProps> = (props) => {
  const previewContent = props?.email?.content?.slice(0, 200);
  return (
    <div
      class={`relative flex flex-col items-center justify-start select-none ${props.class}`}
      style={{
        width: `${props.width || mailDimensions.width}px`,
        height: `${props.height || mailDimensions.height}px`,
      }}
      onClick={props.onClick}
    >
      {/* Paper Content */}
      <div
        id="paper-content"
        class="paper p-4! rounded-b! overflow-hidden!"
        style={{
          width: "90%",
          height: "100%"
        }}
      >
        <h1 class="small-subject-text">
          {props.email.subject || "(No Subject)"}
        </h1>

        <div
          class="small-content-text"
          innerHTML={previewContent}
        />
      </div>

      {/* Pen Icon - Bottom Right */}
      <div class="absolute bottom-1 left-1 rounded bg-black/50 backdrop-blur px-1 text-xs">
        <p>{formatDate(props.email.createdAt)}</p>
      </div>
      <div class="absolute bottom-1 right-0">
        <ImQuill size={42} color={"blue"} />
      </div>
    </div>
  );
};

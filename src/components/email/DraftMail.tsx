// components/email/DraftMail.tsx
import { Component } from "solid-js";
import { Email } from "~/types/email/email.type";
import { mailDimensions } from "~/constants/constants";
import { formatDate } from "~/utils/formatDate";
import { ImQuill } from "solid-icons/im";
import { useMobile } from "~/hooks/useMobile";

interface DraftMailProps {
  email: Email;
  width?: number; // default: 270
  height?: number; // default: 190
  class?: string;
  onClick?: () => void;
}

export const DraftMail: Component<DraftMailProps> = (props) => {
  const { isMobile } = useMobile();
  const previewContent = props?.email?.content?.slice(0, 200);

  const getWidthStyle = () => {
    if (isMobile()) {
      return '100%';
    }
    return `${props.width || mailDimensions.width}px`;
  };

  return (
    <div
      class={`relative flex flex-col items-center justify-start select-none envelope-shadow ${props.class}`}
      style={{
        width: getWidthStyle(),
        'aspect-ratio': mailDimensions.aspectRatio
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

      <div class="absolute bottom-3 right-1 rounded bg-black/50 backdrop-blur px-1 text-xs">
        <p>{formatDate(props.email.createdAt)}</p>
      </div>
      <div class="absolute top-1 right-0">
        <ImQuill size={42} color={"blue"} />
      </div>
    </div>
  );
};

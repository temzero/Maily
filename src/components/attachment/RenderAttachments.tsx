import { For, Show } from "solid-js";
import { FiPaperclip } from "solid-icons/fi";
import { Attachment as AttachmentType, formatFileSize } from "~/types/attachment/attachment.type";  
import { sortByPriority } from "./attachment.utils";
import { Presence, Motion } from "solid-motionone";
import Attachment from "./Attachment";

export enum RenderAttachmentMode {
  COMPOSE = "compose",
  VIEW = "view",
}

type Props = {
  attachments: AttachmentType[];
  mode?: RenderAttachmentMode;
  onRemove?: (attachmentId: string) => void;
  onDownload?: (attachment: AttachmentType) => void;
  class?: string;
};

const RenderAttachments = (props: Props) => {
  const sortedAttachments = () => sortByPriority(props.attachments!);
  const mode = props.mode ?? RenderAttachmentMode.VIEW;

  const totalSize = () => {
    return props.attachments.reduce(
      (total, attachment) => total + (attachment.size || 0),
      0,
    );
  };
  // Format the total size
  const formattedTotalSize = () => formatFileSize(totalSize());

  // Animation config based on mode
  const getAttachmentAnimation = () => {
    if (mode === RenderAttachmentMode.COMPOSE) {
      return {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.5 },
        transition: { duration: 0.2 },
      };
    }
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  };

  const attachmentAnimation = getAttachmentAnimation();
  const iconAnimation = {
    initial: { opacity: 0, y: -26 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 26 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 28,
    },
  };

  return (
    <Show when={props.attachments.length > 0}>
      <div class={`${props.class} w-full mt-4 overflow-visible`}>
        <Motion {...iconAnimation} class="relative group w-full">
          <div class="flex items-center justify-end gap-2 mb-1 ">
            {props.attachments.length > 1 && (
              <span class="text-xl opacity-80 italic">
                x{props.attachments.length}{" "}
                {formattedTotalSize() ? (
                  <span class="text-sm">({formattedTotalSize()})</span>
                ) : (
                  ""
                )}
              </span>
            )}
            <FiPaperclip size={26} />
          </div>
        </Motion>

        <div class="space-y-2">
          <For each={sortedAttachments()}>
            {(attachment) => (
              <Presence>
                <Motion {...attachmentAnimation} class="relative group w-full">
                  <Attachment
                    attachment={attachment}
                    mode={mode}
                    onRemove={props.onRemove}
                    onDownload={props.onDownload}
                  />
                </Motion>
              </Presence>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default RenderAttachments;

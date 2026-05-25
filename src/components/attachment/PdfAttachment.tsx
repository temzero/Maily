// PdfAttachment.tsx
import { createSignal, createEffect, Show } from "solid-js";
import { Attachment } from "~/types/attachment/attachment.type";
import { AttachmentWrapper } from "./info/AttachmentWrapper";
import { AttachmentInfo } from "./info/AttachmentInfo";
import { RenderAttachmentMode } from "./RenderAttachments";
import { ImFilePdf } from "solid-icons/im";
import { ActionButtons } from "./buttons/ActionButtons";

type Props = {
  attachment: Attachment;
  mode: RenderAttachmentMode;
  onRemove?: (attachmentId: string) => void;
  onDownload?: (attachment: Attachment) => void;
};

export const PdfAttachment = (props: Props) => {
  const [canPreview, setCanPreview] = createSignal(false);

  createEffect(() => {
    const url = props.attachment.url;
    if (!url) return;

    // blob URLs are always valid local files, trust them directly
    if (url.startsWith("blob:")) {
      setCanPreview(true);
      return;
    }

    fetch(url, { method: "HEAD" })
      .then((res) => {
        const contentType = res.headers.get("Content-Type") ?? "";
        setCanPreview(res.ok && contentType.includes("application/pdf"));
      })
      .catch(() => setCanPreview(false));
  });

  return (
    <AttachmentWrapper showHoverEffects={true} class="p-2">
      <div class="flex flex-col gap-1.5">
        <Show when={canPreview()}>
          <iframe
            src={`${props.attachment.url}#toolbar=0`}
            class="w-full h-64 rounded no-scrollbar"
            title={props.attachment.filename}
          />
        </Show>

        <div class="flex items-center justify-between">
          <div class="flex gap-2 items-center">
            <ImFilePdf size={28} />
            <AttachmentInfo
              filename={props.attachment.filename}
              size={props.attachment.size}
            />
          </div>
          <div class="flex gap-2">
            <ActionButtons
              attachment={props.attachment}
              mode={props.mode}
              onRemove={props.onRemove}
              onDownload={props.onDownload}
            />
          </div>
        </div>
      </div>
    </AttachmentWrapper>
  );
};

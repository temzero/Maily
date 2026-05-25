// Attachment.tsx - with progress handling
import { Match, Switch, type Component, Show } from "solid-js";
import { ImageAttachment } from "./ImageAttachment";
import { VideoAttachment } from "./VideoAttachment";
import { AudioAttachment } from "./AudioAttachment";
import { FileAttachment } from "./FileAttachment";
import { PdfAttachment } from "./PdfAttachment";
import type { Attachment as AttachmentType } from "~/types/attachment/attachment.type";
import { RenderAttachmentMode } from "./RenderAttachments";

type Props = {
  attachment: AttachmentType;
  mode?: RenderAttachmentMode;
  onRemove?: (attachmentId: string) => void;
  onDownload?: (attachment: AttachmentType) => void;
  class?: string;
};

const Attachment: Component<Props> = (props) => {
  const getAttachmentType = () => {
    const mimeType = props.attachment.mimeType;
    const filename = props.attachment.filename?.toLowerCase() || "";

    if (mimeType === "application/pdf" || filename.endsWith(".pdf"))
      return "pdf";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "file";
  };

  const commonProps = {
    attachment: props.attachment,
    mode: props.mode ?? RenderAttachmentMode.VIEW,
    onRemove: props.onRemove,
    onDownload: props.onDownload,
  };

  const type = getAttachmentType();
  const progress = () => props.attachment.progress || 0;
  const isUploading = () => props.attachment.status === "uploading";

  return (
    <div class={props.class}>
      <div
        class="relative overflow-hidden rounded"
        style={{
          "background-image": isUploading()
            ? `linear-gradient(to right, #1e293b, #60a5fa)`
            : undefined,
          "background-size": `${progress()}% 100%`,
          "background-repeat": "no-repeat",
          "background-color": "transparent",
        }}
      >
        <Switch>
          <Match when={type === "pdf"}>
            <PdfAttachment {...commonProps} />
          </Match>
          <Match when={type === "image"}>
            <ImageAttachment {...commonProps} />
          </Match>
          <Match when={type === "video"}>
            <VideoAttachment {...commonProps} />
          </Match>
          <Match when={type === "audio"}>
            <AudioAttachment {...commonProps} />
          </Match>
          <Match when={type === "file"}>
            <FileAttachment {...commonProps} />
          </Match>
        </Switch>

        <Show when={props.attachment.status === "failed"}>
          <p class="absolute bottom-1 right-1 rounded text-xs border bg-red-600 text-white p-1 border-red-500 z-20">
            Upload failed
          </p>
        </Show>
      </div>
    </div>
  );
};

export default Attachment;

// PdfAttachment.tsx
import { createSignal, Show } from 'solid-js';
import { Attachment, formatFileSize } from '~/types/attachment/attachment.type';
import { AttachmentWrapper } from './info/AttachmentWrapper';
import { AttachmentInfo } from './info/AttachmentInfo';
import { DownloadButton } from './buttons/DownloadButton';
import { RemoveButton } from './buttons/RemoveButton';
import { RenderAttachmentMode } from './RenderAttachments';
import { FiFileText } from 'solid-icons/fi'; // or a dedicated PDF icon
import { ImFilePdf } from 'solid-icons/im';
import { ActionButtons } from './buttons/ActionButtons';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
};

export const PdfAttachment = (props: Props) => {
    const previewUrl = props.attachment.url; // Assuming the URL is directly usable for embedding

    return (
        <AttachmentWrapper showHoverEffects={true} class="p-2">
            <div class="flex flex-col gap-1.5">
                {/* PDF Preview */}
                <Show when={previewUrl}>
                        <iframe
                            src={`${previewUrl}#toolbar=0`}
                            class="w-full h-64 rounded no-scrollbar"
                            title={props.attachment.filename}
                        />
                </Show>

                <div class="flex items-center justify-between">
                    {/* PDF Icon with optional preview */}
                    <div class="flex gap-2 items-center">
                        <ImFilePdf size={28} class="" />
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

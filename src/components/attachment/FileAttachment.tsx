import { Show } from 'solid-js';
import { Attachment, formatFileSize } from '~/types/attachment/attachment.type';
import { ActionButtons } from './buttons/ActionButtons';
import { RenderAttachmentMode } from './RenderAttachments';
import { AttachmentIcon } from './info/AttachmentIcon';
import { AttachmentWrapper } from './info/AttachmentWrapper';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
};

export const FileAttachment = (props: Props) => {
    const progress = () => props.attachment.progress || 0;

    return (
        <AttachmentWrapper>
            <div
                class="relative flex items-center justify-between p-3 overflow-hidden"
                style={{
                    'background-image':
                        props.attachment.status === 'uploading'
                            ? `linear-gradient(to right, #1e293b, #60a5fa)`
                            : undefined,
                    'background-size': `${progress()}% 100%`,
                    'background-repeat': 'no-repeat',
                    'background-color': 'transparent',
                }}
            >
                <div class="flex items-center space-x-3 flex-1 min-w-0 relative z-10">
                    <AttachmentIcon attachment={props.attachment} size={28} />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{props.attachment.filename}</p>
                        <p class="text-xs opacity-80">{formatFileSize(props.attachment.size)}</p>
                    </div>
                </div>

                <div class="relative z-10">
                    <ActionButtons
                        attachment={props.attachment}
                        mode={props.mode}
                        onRemove={props.onRemove}
                        onDownload={props.onDownload}
                    />
                </div>
                <Show when={props.attachment.status === 'failed'}>
                    <p class="absolute bottom-1 right-1 rounded text-xs border bg-red-600 text-white p-1 border-red-500">Upload failed</p>
                </Show>
            </div>
        </AttachmentWrapper>
    );
};

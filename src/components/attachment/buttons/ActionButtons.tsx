import { Show } from 'solid-js';
import { Attachment } from '~/types/attachment/attachment.type';
import { DownloadButton } from './DownloadButton';
import { RemoveButton } from './RemoveButton';
import { RenderAttachmentMode } from '../RenderAttachments';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
    class?: string;
    buttonSize?: number;
    downloadClass?: string;
    removeClass?: string;
};

export const ActionButtons = (props: Props) => {
    return (
        <div class={props.class || 'flex gap-1'}>
            <DownloadButton
                attachment={props.attachment}
                onDownload={props.onDownload}
                size={props.buttonSize}
                class={props.downloadClass}
            />
            <Show when={props.mode === RenderAttachmentMode.COMPOSE}>
                <RemoveButton
                    onRemove={() => props.onRemove?.(props.attachment.id)}
                    size={props.buttonSize}
                    class={props.removeClass}
                />
            </Show>
        </div>
    );
};

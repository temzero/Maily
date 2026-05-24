import { createSignal, onMount, Show } from 'solid-js';
import { Attachment } from '~/types/attachment/attachment.type';
import { AttachmentWrapper } from './info/AttachmentWrapper';
import { AttachmentInfo } from './info/AttachmentInfo';
import { DownloadButton } from './buttons/DownloadButton';
import { RemoveButton } from './buttons/RemoveButton';
import { RenderAttachmentMode } from './RenderAttachments';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
};

export const ImageAttachment = (props: Props) => {
    const [aspectRatio, setAspectRatio] = createSignal<number>(1);

    onMount(() => {
        if (props.attachment.url) {
            const img = new Image();
            img.onload = () => setAspectRatio(img.height / img.width);
            img.src = props.attachment.url;
        }
    });

    return (
        <AttachmentWrapper showHoverEffects={true}>
            <div
                class="relative w-full"
                style={{
                    'padding-bottom': aspectRatio() ? `${aspectRatio() * 100}%` : '56.25%',
                }}
            >
                <img
                    src={props.attachment.url}
                    alt={props.attachment.filename}
                    class="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => console.error('Image failed to load:', props.attachment.url, e)}
                />
            </div>

            <div class="absolute bottom-0 w-full flex items-end justify-between bg-linear-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AttachmentInfo filename={props.attachment.filename} size={props.attachment.size} />
                <DownloadButton attachment={props.attachment} onDownload={props.onDownload} />
            </div>

            <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Show when={props.mode === RenderAttachmentMode.COMPOSE}>
                    <RemoveButton onRemove={() => props.onRemove?.(props.attachment.id)} />
                </Show>
            </div>
        </AttachmentWrapper>
    );
};

import { For, Show } from 'solid-js';
import { FiPaperclip } from 'solid-icons/fi';
import { BsPaperclip } from 'solid-icons/bs';
import { Attachment, formatFileSize } from '~/types/attachment/attachment.type';
import { ImageAttachment } from './ImageAttachment';
import { VideoAttachment } from './VideoAttachment';
import { AudioAttachment } from './AudioAttachment';
import { FileAttachment } from './FileAttachment';
import { sortByPriority } from './attachment.utils';
import { RemoveButton } from './buttons/RemoveButton';
import { Presence, Motion } from 'solid-motionone';
import { PdfAttachment } from './PdfAttachment';

export enum RenderAttachmentMode {
    COMPOSE = 'compose',
    VIEW = 'view',
}

type Props = {
    attachments: Attachment[];
    mode?: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
    class?: string;
};

const RenderAttachments = (props: Props) => {
    const sortedAttachments = () => sortByPriority(props.attachments!);
    const mode = props.mode ?? RenderAttachmentMode.VIEW;

    const totalSize = () => {
        return props.attachments.reduce((total, attachment) => total + (attachment.size || 0), 0);
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
            type: 'spring',
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
                                x{props.attachments.length}{' '}
                                {formattedTotalSize() ? (
                                    <span class="text-sm">({formattedTotalSize()})</span>
                                ) : (
                                    ''
                                )}
                            </span>
                        )}
                        <FiPaperclip size={26} />
                    </div>
                </Motion>

                <div class="space-y-2">
                    <For each={sortedAttachments()}>
                        {(attachment) => {
                            const renderAttachment = () => {
                                const mimeType = attachment.mimeType;
                                const filename = attachment.filename?.toLowerCase() || '';

                                // Switch on MIME type prefix
                                switch (true) {
                                    case mimeType === 'application/pdf' ||
                                        filename.endsWith('.pdf'):
                                        return (
                                            <PdfAttachment
                                                attachment={attachment}
                                                mode={mode}
                                                onRemove={props.onRemove}
                                                onDownload={props.onDownload}
                                            />
                                        );
                                    case mimeType.startsWith('image/'):
                                        return (
                                            <ImageAttachment
                                                attachment={attachment}
                                                mode={mode}
                                                onRemove={props.onRemove}
                                                onDownload={props.onDownload}
                                            />
                                        );
                                    case mimeType.startsWith('video/'):
                                        return (
                                            <VideoAttachment
                                                attachment={attachment}
                                                mode={mode}
                                                onRemove={props.onRemove}
                                                onDownload={props.onDownload}
                                            />
                                        );
                                    case mimeType.startsWith('audio/'):
                                        return (
                                            <AudioAttachment
                                                attachment={attachment}
                                                mode={mode}
                                                onRemove={props.onRemove}
                                                onDownload={props.onDownload}
                                            />
                                        );
                                    default:
                                        return (
                                            <FileAttachment
                                                attachment={attachment}
                                                mode={mode}
                                                onRemove={props.onRemove}
                                                onDownload={props.onDownload}
                                            />
                                        );
                                }
                            };

                            return (
                                <Presence>
                                    <Motion {...attachmentAnimation} class="relative group w-full">
                                        {renderAttachment()}
                                    </Motion>
                                </Presence>
                            );
                        }}
                    </For>
                </div>
            </div>
        </Show>
    );
};

export default RenderAttachments;

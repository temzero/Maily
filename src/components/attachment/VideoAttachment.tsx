import { createSignal, onMount, Show } from 'solid-js';
import { Attachment } from '~/types/attachment/attachment.type';
import { AttachmentWrapper } from './info/AttachmentWrapper';
import { AttachmentInfo } from './info/AttachmentInfo';
import { ActionButtons } from './buttons/ActionButtons';
import { RenderAttachmentMode } from './RenderAttachments';
import { TbOutlineMovieOff } from 'solid-icons/tb';
import { FiVideoOff } from 'solid-icons/fi';

type Props = {
    attachment: Attachment;
    mode: RenderAttachmentMode;
    onRemove?: (attachmentId: string) => void;
    onDownload?: (attachment: Attachment) => void;
};

export const VideoAttachment = (props: Props) => {
    const [aspectRatio, setAspectRatio] = createSignal<number>(1);
    const [error, setError] = createSignal<string | null>(null);
    let videoRef: HTMLVideoElement | undefined;

    onMount(() => {
        if (videoRef && props.attachment.url) {
            // Add error listener to the video element
            videoRef.addEventListener('error', (e) => {
                console.error('Video load error:', e);
                setError('Failed to load video');
            });

            // Also listen for loadedmetadata to set aspect ratio
            videoRef.addEventListener('loadedmetadata', () => {
                setAspectRatio(videoRef!.videoHeight / videoRef!.videoWidth);
            });

            // Force the video to load and check for errors
            videoRef.load();

            // Check if video already has error
            if (videoRef.error) {
                setError('Failed to load video');
            }
        }
    });

    return (
        <AttachmentWrapper>
            <div
                class={`relative w-full ${error() ? 'border-2 border-red-500' : ''}`}
                style={{
                    'padding-bottom': `${aspectRatio() * 100}%`,
                }}
            >
                <Show
                    when={props.attachment.url && !error()}
                    fallback={
                        <div class="absolute inset-0 flex flex-col items-center justify-center text-red-500">
                            <FiVideoOff  size={49} />
                            <h1 class='mt-2'>{error()}</h1>
                        </div>
                    }
                >
                    <video
                        ref={videoRef}
                        controls
                        class="absolute inset-0 w-full h-full"
                        poster={props.attachment.thumbnailUrl || undefined}
                        crossOrigin="anonymous"
                    >
                        <source
                            src={props.attachment.url}
                            type={props.attachment.mimeType}
                            onError={(e) => {
                                // console.error('Source error:', e);
                                setError('Failed to load video');
                            }}
                        />
                        Your browser does not support the video tag.
                    </video>
                </Show>
            </div>

            <div class="absolute top-0 w-full bg-linear-to-b from-black to-transparent p-1 opacity-0 group-hover:opacity-100 flex justify-between">
                <AttachmentInfo
                    filename={props.attachment.filename}
                    size={props.attachment.size}
                    filenameClass="text-xs text-white"
                    sizeClass="text-xs text-white/80"
                    class="p-1"
                />
                <ActionButtons
                    attachment={props.attachment}
                    mode={props.mode}
                    onRemove={props.onRemove}
                    onDownload={props.onDownload}
                />
            </div>
        </AttachmentWrapper>
    );
};

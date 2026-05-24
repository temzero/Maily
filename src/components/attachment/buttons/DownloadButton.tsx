import { Show } from 'solid-js';
import { FiDownload } from 'solid-icons/fi';
import { Attachment, formatFileSize } from '~/types/attachment/attachment.type';

type Props = {
    attachment: Attachment;
    onDownload?: (attachment: Attachment) => void;
    class?: string;
    size?: number;
};

export const DownloadButton = (props: Props) => {
    const handleDownload = () => {
        if (props.onDownload) {
            props.onDownload(props.attachment);
        } else if (props.attachment.url) {
            window.open(props.attachment.url, '_blank');
        }
    };

    return (
        <Show when={props.attachment.url}>
            <button
                onClick={handleDownload}
                class={
                    props.class ||
                    'w-8 h-8 flex items-center justify-center bg-white text-black hover:bg-blue-500 rounded-full hover:text-white transition-colors shadow-sm'
                }
                aria-label="Download"
                title={formatFileSize(props.attachment.size)}
            >
                <FiDownload size={props.size || 20} />
            </button>
        </Show>
    );
};

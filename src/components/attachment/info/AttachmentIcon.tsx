import { JSX } from 'solid-js';
import {
    FiFile,
    FiArchive,
    FiImage,
    FiFileText,
    FiFileMinus,
    FiCode,
    FiMusic,
    FiVideo,
    FiTable,
    // FiPresentation,
    FiType,
} from 'solid-icons/fi';
import { ImFilePdf } from 'solid-icons/im'
import { Attachment } from '~/types/attachment/attachment.type';
import { TbOutlinePresentation } from 'solid-icons/tb';

type Props = {
    attachment: Attachment;
    size?: number;
    class?: string;
};

export const AttachmentIcon = (props: Props) => {
    const size = props.size || 20;
    const mimeType = props.attachment.mimeType;
    const ext = props.attachment.filename.split('.').pop()?.toLowerCase() || '';

    // Images
    if (mimeType.startsWith('image/')) {
        return <FiImage size={size} class={props.class} />;
    }

    // Videos
    if (mimeType.startsWith('video/')) {
        return <FiVideo size={size} class={props.class} />;
    }

    // Audio
    if (mimeType.startsWith('audio/')) {
        return <FiMusic size={size} class={props.class} />;
    }

    // Archives
    if (
        mimeType.includes('zip') ||
        mimeType.includes('rar') ||
        ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)
    ) {
        return <FiArchive size={size} class={props.class} />;
    }

    // PDF
    if (mimeType === 'application/pdf' || ext === 'pdf') {
        return <ImFilePdf  size={size} class={props.class} />;
    }

    // Documents
    if (mimeType.includes('word') || ['doc', 'docx'].includes(ext)) {
        return <FiFileText size={size} class={props.class} />;
    }

    // Presentations
    if (mimeType.includes('presentation') || ['ppt', 'pptx'].includes(ext)) {
        return <TbOutlinePresentation size={size} class={props.class} />;
    }

    // Spreadsheets
    if (
        mimeType.includes('sheet') ||
        mimeType.includes('excel') ||
        ['xls', 'xlsx', 'csv'].includes(ext)
    ) {
        return <FiTable size={size} class={props.class} />;
    }

    // Code
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'py', 'java', 'sql'].includes(ext)) {
        return <FiCode size={size} class={props.class} />;
    }

    // Text
    if (mimeType.includes('text') || ['txt', 'md', 'log'].includes(ext)) {
        return <FiType size={size} class={props.class} />;
    }

    // Default
    return <FiFile size={size} class={props.class} />;
};

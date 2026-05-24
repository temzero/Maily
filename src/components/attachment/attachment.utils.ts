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
    FiType
} from 'solid-icons/fi';
import { Attachment, getAttachmentCategory, AttachmentCategory } from '~/types/attachment/attachment.type';

export const CATEGORY_PRIORITY: Record<string, number> = {
    image: 0,
    video: 1,
    audio: 2,
    pdf: 3,
    file: 4,
    archive: 5,
};

export const getCategoryKey = (attachment: Attachment): string => {
    if (attachment.mimeType.startsWith('image/')) return 'image';
    if (attachment.mimeType.startsWith('video/')) return 'video';
    if (attachment.mimeType.startsWith('audio/')) return 'audio';
    if (attachment.mimeType === 'application/pdf') return 'pdf';
    const category = getAttachmentCategory(attachment.mimeType);
    if (category === AttachmentCategory.ARCHIVE) return 'archive';
    return 'file';
};

export const sortByPriority = (attachments: Attachment[]): Attachment[] =>
    [...attachments].sort(
        (a, b) =>
            (CATEGORY_PRIORITY[getCategoryKey(a)] ?? 99) -
            (CATEGORY_PRIORITY[getCategoryKey(b)] ?? 99)
    );
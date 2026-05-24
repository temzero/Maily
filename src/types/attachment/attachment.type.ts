// Attachment Interface
export interface Attachment {
    id: string;
    filename: string;
    size: number; // in bytes
    mimeType: MimeType | string; // Can use enum or custom string
    url?: string; // Download URL
    thumbnailUrl?: string; 
    category?: AttachmentCategory; // Auto-detected or manual
    status?: AttachmentStatus; // Upload status
    progress?: number; // Upload progress (0-100)
    encrypted?: boolean; // Is file encrypted?
    checksum?: string; // MD5/SHA hash for verification
    file?: File;
    metadata?: Record<string, unknown>;
    createdAt?: string;
}

export enum MimeType {
    // Images
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    JPG = 'image/jpg',
    GIF = 'image/gif',
    SVG = 'image/svg+xml',
    WEBP = 'image/webp',

    // Documents
    PDF = 'application/pdf',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS = 'application/vnd.ms-excel',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    TXT = 'text/plain',
    RTF = 'application/rtf',

    // Archives
    ZIP = 'application/zip',
    RAR = 'application/x-rar-compressed',
    TAR = 'application/x-tar',
    GZIP = 'application/gzip',

    // Audio
    MP3 = 'audio/mpeg',
    WAV = 'audio/wav',
    OGG = 'audio/ogg',
    AAC = 'audio/aac',

    // Video
    MP4 = 'video/mp4',
    AVI = 'video/x-msvideo',
    MOV = 'video/quicktime',
    MKV = 'video/x-matroska',

    // Code
    JSON = 'application/json',
    XML = 'application/xml',
    HTML = 'text/html',
    CSS = 'text/css',
    JS = 'application/javascript',
    TS = 'application/typescript',

    // Other
    CSV = 'text/csv',
    ICS = 'text/calendar',
}

export enum AttachmentCategory {
    IMAGE = 'image',
    DOCUMENT = 'document',
    ARCHIVE = 'archive',
    AUDIO = 'audio',
    VIDEO = 'video',
    CODE = 'code',
    OTHER = 'other',
}

export enum AttachmentStatus {
    PENDING = 'pending',
    UPLOADING = 'uploading',
    UPLOADED = 'uploaded',
    FAILED = 'failed',
    PROCESSING = 'processing',
    PROCESSED = 'processed',
}

// Helper function to get category from mime type
export const getAttachmentCategory = (mimeType: string): AttachmentCategory => {
    if (mimeType.startsWith('image/')) return AttachmentCategory.IMAGE;
    if (mimeType.startsWith('video/')) return AttachmentCategory.VIDEO;
    if (mimeType.startsWith('audio/')) return AttachmentCategory.AUDIO;
    if (
        mimeType.includes('pdf') ||
        mimeType.includes('document') ||
        mimeType.includes('text') ||
        mimeType.includes('sheet') ||
        mimeType.includes('presentation')
    )
        return AttachmentCategory.DOCUMENT;
    if (
        mimeType.includes('zip') ||
        mimeType.includes('rar') ||
        mimeType.includes('tar') ||
        mimeType.includes('gzip')
    )
        return AttachmentCategory.ARCHIVE;
    if (
        mimeType.includes('json') ||
        mimeType.includes('xml') ||
        mimeType.includes('javascript') ||
        mimeType.includes('html')
    )
        return AttachmentCategory.CODE;
    return AttachmentCategory.OTHER;
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

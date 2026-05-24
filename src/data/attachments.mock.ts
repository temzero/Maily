import {
    Attachment,
    AttachmentCategory,
    AttachmentStatus,
    MimeType,
} from '~/types/attachment/attachment.type';

const getTimeAgo = (days: number, hours: number = 0) => {
    const now = new Date();
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    date.setHours(date.getHours() - hours);
    return date.toISOString();
};

export const sampleAttachments: Attachment[] = [
    {
        id: 'att1',
        filename: 'quarterly-report.pdf',
        size: 2048576, // 2MB
        mimeType: MimeType.PDF,
        url: '/attachments/report.pdf',
        category: AttachmentCategory.DOCUMENT,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: true,
        checksum: 'a1b2c3d4e5f6',
        metadata: {
            pages: 24,
            description: 'Q4 2024 Financial Report',
        },
        createdAt: getTimeAgo(2),
    },
    {
        id: 'att2',
        filename: 'product-presentation.pptx',
        size: 5120000, // 5.12MB
        mimeType: MimeType.PPTX,
        url: '/attachments/presentation.pptx',
        category: AttachmentCategory.DOCUMENT,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: false,
        metadata: {
            pages: 35,
            description: 'Product Launch Presentation',
        },
        createdAt: getTimeAgo(3),
    },
    {
        id: 'att3',
        filename: 'team-photo.png',
        size: 1024000, // 1MB
        mimeType: MimeType.PNG,
        url: 'https://picsum.photos/id/100/1920/1080',
        thumbnailUrl: 'https://picsum.photos/id/100/100/100',
        category: AttachmentCategory.IMAGE,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: false,
        metadata: {
            width: 1920,
            height: 1080,
            description: 'Team outing photo',
        },
        createdAt: getTimeAgo(5),
    },
    {
        id: 'att4',
        filename: 'contract.docx',
        size: 756000, // 756KB
        mimeType: MimeType.DOCX,
        url: '/attachments/contract.docx',
        category: AttachmentCategory.DOCUMENT,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: true,
        checksum: 'f6e5d4c3b2a1',
        metadata: {
            pages: 8,
            description: 'Signed client contract',
        },
        createdAt: getTimeAgo(1),
    },
    {
        id: 'att5',
        filename: 'sample-video.mp4',
        size: 15728640,
        mimeType: 'video/mp4',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl:
            'https://storage.googleapis.com/gtv-videos-bucket/sample/images/What_Is_Clean_Energy.jpg',
        category: AttachmentCategory.VIDEO,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: false,
        metadata: {
            width: 640,
            height: 360,
            duration: 10,
            description: 'Big Buck Bunny sample',
        },
        createdAt: getTimeAgo(7),
    },
    {
        id: 'att6',
        filename: 'audio-memo.mp3',
        size: 3145728, // 3MB
        mimeType: MimeType.MP3,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        category: AttachmentCategory.AUDIO,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: false,
        metadata: {
            duration: 180,
            description: 'Voice memo about project',
            cloudRegion: 'us-east-1',
            bucketName: 'audio-memos-prod',
            cdnUrl: 'https://d1234567.cloudfront.net/audio/memo.mp3',
        },
        createdAt: getTimeAgo(4),
    },
    {
        id: 'att7',
        filename: 'source-code.zip',
        size: 5242880, // 5MB
        mimeType: MimeType.ZIP,
        url: '/attachments/source.zip',
        category: AttachmentCategory.ARCHIVE,
        status: AttachmentStatus.PROCESSED,
        progress: 100,
        encrypted: true,
        checksum: '1a2b3c4d5e6f7g8h',
        createdAt: getTimeAgo(10),
    },
    {
        id: 'att8',
        filename: 'uploading-file.pdf',
        size: 1048576, // 1MB
        mimeType: MimeType.PDF,
        category: AttachmentCategory.DOCUMENT,
        status: AttachmentStatus.UPLOADING,
        progress: 85,
        encrypted: false,
        createdAt: getTimeAgo(0, 1),
    },
];

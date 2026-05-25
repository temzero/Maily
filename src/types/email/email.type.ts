import { Attachment } from '../attachment/attachment.type';
import { EnvelopeType } from '../envelop/envelop.type';

export interface Email {
    // Identifiers
    id: string;

    // Sender & Recipients
    from: string; // Sender
    to: string[]; // Recipients (array for multiple)
    cc?: string[]; // Carbon copy (optional)
    bcc?: string[]; // Blind carbon copy (optional)

    // Content
    subject: string;
    preview?: string; // Short preview for list view
    content?: string; // Full email content (HTML or text)

    // Metadata
    avatar?: string | null; // Sender avatar URL
    labelIds?: number[];
    attachments?: Attachment[]; // File attachments
    folder?: EmailFolder; // Current folder (inbox, sent, trash, etc.)
    snoozedUntil?: Date | null; // If snoozed, when it should reappear
    envelope?: EnvelopeType | null;

    // Booleans (grouped together)
    isRead?: boolean;
    isPinned?: boolean;
    isNew?: boolean;
    isSpam?: boolean;
    isBlocked?: boolean;
    isDeleted?: boolean;

    // Timestamps
    sentAt?: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export enum EmailFolder {
    INBOX = 'inbox',
    SENT = 'sent',
    DRAFTS = 'drafts',
    SPAM = 'spam',
    ARCHIVE = 'archive',
    TRASH = 'trash',
}

import { emailMutations } from './email.store';
import { getSenderDisplayName } from '~/utils/emailParser';
import { audioManager } from '~/utils/audioManager';
import { Email, EmailFolder } from '~/types/email/email.type';
import { getEmailById, getEmailIds, getFilteredEmailIds } from './email.selectors';
import toast from 'solid-toast';

export const addEmail = (email: Email) => {
    if (getEmailById(email.id)) {
        console.warn(`Email ${email.id} already exists`);
        return;
    }

    if (email.isNew) {
        audioManager.play('newMail');
    }
    emailMutations.addOne(email);
    // console.log(`Email ${email.id} ADDED`);
};

export const updateEmail = (id: string, updates: Partial<Email>) => {
    emailMutations.updateOne(id, updates);
};

export const markAsRead = (id: string, isRead: boolean = true) => {
    updateEmail(id, { isRead, isNew: false });
};

export const toggleEmailLabel = (emailId: string, labelId: number) => {
    const email = getEmailById(emailId);
    if (!email) return;

    const currentLabelIds = email.labelIds || [];
    const hasLabel = currentLabelIds.includes(labelId);

    updateEmail(emailId, {
        labelIds: hasLabel
            ? currentLabelIds.filter((id) => id !== labelId)
            : [...currentLabelIds, labelId],
    });
};

export const pinEmail = (id: string, isPinned: boolean) => {
    const email = getEmailById(id);
    if (!email) return;

    if (email.isDeleted || email.folder === EmailFolder.SPAM) {
        toast.error(`Cannot pin ${email.isDeleted ? 'deleted' : 'spam'} email`, {
            icon: '🚫',
        });
        return;
    }

    updateEmail(id, { isPinned });

    toast(
        isPinned
            ? `📌 "${email.subject || 'Email'}" pinned`
            : `📍 "${email.subject || 'Email'}" unpinned`
    );
};

export const unpinAll = () => {
    const allEmailIds = getEmailIds();

    // Collect updates
    const updates: Array<{ id: string; updates: Partial<Email> }> = [];
    let pinnedCount = 0;

    for (const id of allEmailIds) {
        const email = getEmailById(id);
        if (email?.isPinned === true && !email.isDeleted && email.folder !== EmailFolder.SPAM) {
            updates.push({ id, updates: { isPinned: false } });
            pinnedCount++;
        }
    }

    if (pinnedCount === 0) {
        toast('No pinned emails to unpin', { icon: '📍' });
        return;
    }

    // Use batch update for better performance
    emailMutations.batchUpdate(updates);

    toast(`📍 Unpinned ${pinnedCount} email${pinnedCount > 1 ? 's' : ''}`);
};

export const snoozeEmail = (id: string, snoozeUntil: Date | null) => {
    const email = getEmailById(id);
    if (!email) return;

    if (email.isDeleted) {
        toast.error('Cannot snooze deleted email');
        return;
    }

    updateEmail(id, { snoozedUntil: snoozeUntil });

    if (snoozeUntil) {
        const formattedDate = snoozeUntil.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
        toast(`⏰ Snoozed until ${formattedDate}`);
    } else {
        toast('🔔 Snooze removed');
    }
};

export const restoreEmail = (id: string) => {
    const email = getEmailById(id);
    if (!email) return;

    if (!email.isDeleted) {
        toast.error('Cannot restore email that is not deleted', { icon: '⚠️' });
        return;
    }

    updateEmail(id, {
        isDeleted: false,
        deletedAt: undefined,
        folder: EmailFolder.INBOX,
    });
};

export const blockSender = (id: string) => {
    const email = getEmailById(id);
    if (!email) return;

    if (email.isDeleted) {
        toast.error('Cannot block sender of deleted email');
        return;
    }

    const senderName = getSenderDisplayName(email.from);
    updateEmail(id, {
        isBlocked: true,
        folder: EmailFolder.SPAM,
        isSpam: true,
    });

    toast(`🚫 Blocked ${senderName}`);
};

export const markAsSpam = (id: string, isSpam: boolean) => {
    const email = getEmailById(id);
    if (!email) return;

    if (email.isDeleted) {
        toast.error('Cannot mark deleted email as spam');
        return;
    }

    updateEmail(id, {
        isSpam,
        folder: isSpam ? EmailFolder.SPAM : EmailFolder.INBOX,
        ...(isSpam && { snoozedUntil: undefined }),
    });

    if (isSpam) {
        toast('📧 Marked as spam');
    } else {
        toast('✅ Removed from spam');
    }
};

export const deleteEmail = (id: string) => {
    const email = getEmailById(id);
    if (!email) return;

    if (email.isDeleted) {
        deleteEmailPermanently(id);
        toast.success(`"${email.subject}" permanently deleted`);
    } else {
        moveMailToTrash(id);
        toast(`🗑️ "${email.subject}" moved to trash`);
    }
};

export const deleteEmailPermanently = (id: string) => {
    emailMutations.deleteOne(id);
};

export const moveMailToTrash = (id: string) => {
    updateEmail(id, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        folder: EmailFolder.TRASH,
        isPinned: false,
        snoozedUntil: undefined,
    });
};

export const setLoading = (loading: boolean) => {
    emailMutations.setLoading(loading);
};

export const countUnreadInFolder = (folder: EmailFolder): number => {
    return getFilteredEmailIds({
        folder,
        isDeleted: false,
        unreadOnly: true,
    }).length;
};

// Batch operations

export const batchDelete = (ids: string[]) => {
    if (ids.length === 0) return;

    const updates = ids.map((id) => ({
        id,
        updates: {
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            folder: EmailFolder.TRASH,
            isPinned: false,
            snoozedUntil: undefined,
        },
    }));

    emailMutations.batchUpdate(updates);
    toast(`🗑️ Moved ${ids.length} email${ids.length > 1 ? 's' : ''} to trash`);
};

export const batchMarkAsRead = (ids: string[], isRead: boolean = true) => {
    if (ids.length === 0) return;

    const updates = ids.map((id) => ({
        id,
        updates: { isRead, isNew: false },
    }));

    emailMutations.batchUpdate(updates);
    toast(`${isRead ? '📖 Marked as read' : '📧 Marked as unread'} (${ids.length})`);
};

// Export all actions as a single object
export const emailActions = {
    // Single email actions
    addEmail,
    updateEmail,
    markAsRead,
    toggleEmailLabel,
    pinEmail,
    unpinAll,
    snoozeEmail,
    restoreEmail,
    blockSender,
    markAsSpam,
    deleteEmail,
    deleteEmailPermanently,
    moveMailToTrash,
    setLoading,
    countUnreadInFolder,

    // Batch actions
    batchDelete,
    batchMarkAsRead,
};

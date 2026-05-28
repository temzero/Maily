import { store } from './email.store';
import { getActiveLabelIds } from '../label.store';
import { getSearchQuery } from '../ui.store';
import { EmailFolder } from '~/types/email/email.type';

// Basic selectors
export const getEmailIds = () => store.ids;
export const getEmailById = (id: string) => store.entities.get(id);
export const getAllEmails = () => Array.from(store.entities.values());

// Filtered selectors (memoized at component level)
export interface GetEmailsOptions {
    folder?: EmailFolder;
    isDeleted?: boolean;
    isSpam?: boolean;
    unreadOnly?: boolean;
    from?: string;
    isShortByDate?: boolean;
}

export interface GroupedIdsItem {
    ids: string[];
    label?: string;
}

export enum GroupMarker {
    PINNED = '<PINNED>',
    DIVIDER = '<DIVIDER>',
    TODAY = '<TODAY>',
    YESTERDAY = '<YESTERDAY>',
    OLDER = '<OLDER>',
    DATE = '<DATE>',
}

export const isGroupMarker = (item: any): boolean => {
    return typeof item === 'string' && item.startsWith('<') && item.endsWith('>');
};

export const getGroupedEmailIds = (options: GetEmailsOptions = {}): string[] => {
    let filteredIds = store.ids;
    const activeLabelIds = getActiveLabelIds();
    const searchQuery = getSearchQuery();

    const result: string[] = [];
    const pinnedIds: string[] = [];
    const regularIds: string[] = [];
    const dateGroups = new Map<string, string[]>();

    for (const id of filteredIds) {
        const email = store.entities.get(id);
        if (!email) continue;

        // --- All filters in one place ---
        if (options.folder !== undefined && email.folder !== options.folder) continue;
        if (options.isDeleted !== undefined && (email.isDeleted === true) !== options.isDeleted)
            continue;
        if (options.isSpam !== undefined && (email.isSpam === true) !== options.isSpam) continue;
        if (options.unreadOnly && email.isRead) continue;
        if (options.from && !email.from.toLowerCase().includes(options.from.toLowerCase()))
            continue;

        if (activeLabelIds.length > 0) {
            if (!activeLabelIds.every((labelId) => email.labelIds?.includes(labelId))) continue;
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            const matches =
                email.subject.toLowerCase().includes(q) ||
                email.from.toLowerCase().includes(q) ||
                email.preview?.toLowerCase().includes(q) ||
                email.content?.toLowerCase().includes(q) ||
                email.to?.join(' ').toLowerCase().includes(q);
            if (!matches) continue;
        }

        // --- Pinned split ---
        if (email.isPinned) {
            pinnedIds.push(id);
            continue;
        }

        if (!options.isShortByDate) {
            regularIds.push(id);
            continue;
        }

        // --- Date grouping ---
        if (!email.createdAt) {
            if (!dateGroups.has('older')) dateGroups.set('older', []);
            dateGroups.get('older')!.push(id);
            continue;
        }

        const d = new Date(email.createdAt);
        const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateOnly.getTime() === today.getTime()) {
            if (!dateGroups.has('today')) dateGroups.set('today', []);
            dateGroups.get('today')!.push(id);
        } else if (dateOnly.getTime() === yesterday.getTime()) {
            if (!dateGroups.has('yesterday')) dateGroups.set('yesterday', []);
            dateGroups.get('yesterday')!.push(id);
        } else {
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!dateGroups.has(key)) dateGroups.set(key, []);
            dateGroups.get(key)!.push(id);
        }
    }

    // --- Assemble result ---
    if (pinnedIds.length > 0) result.push(GroupMarker.PINNED, ...pinnedIds);

    if (!options.isShortByDate) {
        result.push(GroupMarker.DIVIDER);
        result.push(...regularIds);
        return result;
    }

    const sorted = Array.from(dateGroups.keys()).sort((a, b) => {
        if (a === 'today') return -1;
        if (b === 'today') return 1;
        if (a === 'yesterday') return -1;
        if (b === 'yesterday') return 1;
        if (a === 'older') return 1;
        if (b === 'older') return -1;
        const [yA, mA, dA] = a.split('-').map(Number);
        const [yB, mB, dB] = b.split('-').map(Number);
        return new Date(yB, mB, dB).getTime() - new Date(yA, mA, dA).getTime();
    });

    for (const key of sorted) {
        const ids = dateGroups.get(key)!;
        if (key === 'today') result.push(GroupMarker.TODAY, ...ids);
        else if (key === 'yesterday') result.push(GroupMarker.YESTERDAY, ...ids);
        else if (key === 'older') result.push(GroupMarker.OLDER, ...ids);
        else {
            const [y, m, d] = key.split('-').map(Number);
            result.push(`<DATE:${d}/${m + 1}>`, ...ids);
        }
    }

    return result;
};

export const getFilteredEmailIds = (options: GetEmailsOptions = {}): string[] => {
    let filteredIds = store.ids;
    const activeLabelIds = getActiveLabelIds();
    const searchQuery = getSearchQuery();

    // Apply filters (same logic as before)
    if (options.folder !== undefined) {
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return email?.folder === options.folder;
        });
    }

    if (options.isDeleted !== undefined) {
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return (email?.isDeleted === true) === options.isDeleted;
        });
    }

    if (options.isSpam !== undefined) {
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return (email?.isSpam === true) === options.isSpam;
        });
    }

    if (options.unreadOnly) {
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return !email?.isRead;
        });
    }

    if (activeLabelIds.length > 0) {
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return activeLabelIds.every((labelId) => email?.labelIds?.includes(labelId));
        });
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            if (!email) return false;
            return (
                email.subject.toLowerCase().includes(query) ||
                email.from.toLowerCase().includes(query) ||
                email.preview?.toLowerCase().includes(query) ||
                email.content?.toLowerCase().includes(query) ||
                email.to?.join(' ').toLowerCase().includes(query)
            );
        });
    }

    if (options.from) {
        const from = options.from.toLowerCase();
        filteredIds = filteredIds.filter((id) => {
            const email = store.entities.get(id);
            return email?.from.toLowerCase().includes(from);
        });
    }

    return filteredIds;
};

export const getUnreadEmailCount = (): number => {
    let count = 0;

    for (const id of store.ids) {
        const email = store.entities.get(id);
        if (!email) continue;

        // Check if it's in inbox
        const isInbox = email.folder === EmailFolder.INBOX;
        const isDeleted = email.isDeleted === true;
        const isSpam = email.isSpam === true;
        const isRead = email.isRead === true;

        if (isInbox && !isDeleted  && !isSpam && !isRead) {
            count++;
        }
    }
    return count;
};

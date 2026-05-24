import {
    toggleEmailLabel,
    markAsSpam,
    blockSender,
    restoreEmail,
    markAsRead,
    snoozeEmail,
    pinEmail,
    deleteEmail,
} from '~/store/email/email.actions';
import { MenuItemType } from '../menu/MenuItem';
import { getRenderLabelsByIds } from '~/store/label.store';
import { parseDuration } from '~/utils/formatDate';
import { audioManager } from '~/utils/audioManager';
import { getEmailById } from '~/store/email/email.selectors';

interface MailMenuItemsProps {
    emailId: string;
    onClose: () => void;
    onInfo: () => void;
    onDelete?: (id: string) => void;
}

export function getMailMenuItems(props: MailMenuItemsProps): MenuItemType[] {
    const email = getEmailById(props.emailId);
    if (!email) return [];

    const labelMenuItems = getRenderLabelsByIds(email.labelIds || [], 20)().map((label) => ({
        id: label.id.toString(),
        name: label.name,
        // color: label.color,
        icon: label.iconElement(),
        onClick: () => {
            toggleEmailLabel(email.id, label.id);
            props.onClose();
        },
    }));

    // Clean, simple handlers that just call store methods
    const handlePin = () => {
        pinEmail(props.emailId, !email.isPinned);
        props.onClose();
    };

    const handleSnooze = (duration?: string) => {
        const snoozeUntil = duration ? new Date(Date.now() + parseDuration(duration)) : null;
        snoozeEmail(props.emailId, snoozeUntil);
        props.onClose();
    };

    const handleMarkAsUnread = () => {
        markAsRead(props.emailId, false);
        props.onClose();
    };

    const handleMarkAsRead = () => {
        markAsRead(props.emailId, true);
        props.onClose();
    };

    const handleRestore = () => {
        restoreEmail(props.emailId);
        props.onClose();
    };

    const handleBlock = () => {
        blockSender(props.emailId);
        props.onClose();
    };

    const handleMarkAsSpam = () => {
        markAsSpam(props.emailId, true);
        props.onClose();
    };

    const handleUnSpam = () => {
        markAsSpam(props.emailId, false);
        props.onClose();
    };

    const handleDelete = () => {
        audioManager.play('deleteMail');

        // 👇 if animation handler exists → use it
        if (props.onDelete) {
            props.onDelete(props.emailId);
            props.onClose();
            return;
        }

        // 👇 fallback (old behavior)
        deleteEmail(props.emailId);
        props.onClose();
    };

    // If email is deleted, show restore option instead of regular actions
    if (email.isDeleted) {
        return [
            {
                name: 'Info',
                onClick: () => {
                    props.onInfo();
                    props.onClose();
                },
            },
            {
                name: 'Restore',
                onClick: handleRestore,
            },
            {
                divider: true,
            },
            {
                name: 'Delete permanently',
                onClick: handleDelete,
                danger: true,
            },
        ];
    }

    // Regular email menu (not deleted) - declarative array building
    return [
        // Info and Pin actions
        {
            name: 'Info',
            onClick: () => {
                props.onInfo();
                props.onClose();
            },
        },
        // Labels submenu (only if there are labels)
        ...(labelMenuItems.length > 0
            ? [
                  {
                      name: 'Label',
                      onClick: () => {},
                      submenu: labelMenuItems,
                  },
              ]
            : []),

        // Snooze with submenu
        {
            name: 'Snooze',
            onClick: () => {},
            submenu: [
                { name: 'Later today', onClick: () => handleSnooze('4h') },
                { name: 'Tomorrow', onClick: () => handleSnooze('1d') },
                { name: 'This weekend', onClick: () => handleSnooze('2d') },
                { name: 'Next week', onClick: () => handleSnooze('1w') },
                { name: 'Pick date & time', onClick: () => handleSnooze() },
            ],
        },
        {
            name: email.isPinned ? 'Unpin' : 'Pin',
            onClick: handlePin,
        },

        // Mark as read/unread based on current read status
        ...(email.isRead
            ? [{ name: 'Mark as unread', onClick: handleMarkAsUnread }]
            : [{ name: 'Mark as read', onClick: handleMarkAsRead }]),

        // Divider
        {
            divider: true,
        },

        // Block action
        {
            name: 'Block',
            onClick: handleBlock,
            danger: true,
        },

        // Spam/UnSpam based on current spam status
        ...(email.isSpam
            ? [{ name: 'Un spam', onClick: handleUnSpam }]
            : [{ name: 'Mark as spam', onClick: handleMarkAsSpam, danger: true }]),

        // Delete action
        {
            name: 'Delete',
            onClick: handleDelete,
            danger: true,
        },
    ];
}

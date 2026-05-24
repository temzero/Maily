// mocks/preferences.mock.ts
import { Theme, FontSize, EmailNotificationType, PreviewLines, AutoLoadImages, MessageDisplay, ReplyBehavior, UndoSendDelay, AutoSaveInterval, SwipeAction, Language, DateFormat, TimeFormat } from '~/types/preferences/preferences.enums';
import {
    UserPreferences,
    defaultUserPreferences,
} from '~/types/preferences/preferences.type';

// Custom preferences for the logged-in user
export const mockUserPreferences: UserPreferences = {
    // Appearance - User prefers dark theme
    theme: Theme.DARK,
    compactView: true, // Likes compact view to see more emails
    fontSize: FontSize.SMALL,
    sidebarCollapsed: false, // Keeps sidebar expanded

    // Notifications - Custom settings
    notifications: true,
    notificationSound: true,
    notificationPreview: true,
    desktopNotifications: true,
    emailNotifications: {
        [EmailNotificationType.REPLIES]: true,
        [EmailNotificationType.MENTIONS]: true,
        [EmailNotificationType.NEWSLETTERS]: true, // User wants newsletter notifications
        [EmailNotificationType.MARKETING]: false,
    },

    // Email Display - Custom preferences
    emailSignature: 'Best regards,\nJohn Doe\nProduct Manager @ TechCorp',
    showPreviewPane: true,
    previewLines: PreviewLines.THREE, // User likes to see 3 preview lines
    messageDisplay: MessageDisplay.COMPACT, // Prefers compact message view

    // Privacy & Security - Stricter settings
    readReceipts: false, // Doesn't send read receipts
    blockExternalImages: true,
    autoLoadImages: AutoLoadImages.NEVER, // Never auto-load images for privacy

    // Sending & Receiving
    defaultReplyBehavior: ReplyBehavior.REPLY_ALL, // Prefers reply all
    confirmBeforeSending: true, // Wants confirmation before sending
    undoSendDelay: UndoSendDelay.SECONDS_30, // Long undo window
    autoSaveDrafts: true,
    autoSaveInterval: AutoSaveInterval.SECONDS_60, // Saves drafts every minute

    // Organization
    autoArchive: true, // Auto-archive old emails
    swipeActions: {
        left: SwipeAction.ARCHIVE,
        right: SwipeAction.MARK_READ, // Custom: right swipe marks as read
    },

    // Keyboard Shortcuts
    keyboardShortcuts: true,
    customShortcuts: {
        'Ctrl+Shift+A': 'archive', // Custom archive shortcut
        'Ctrl+Shift+S': 'snooze', // Custom snooze shortcut
    },

    // Language & Region - User in PST
    language: Language.ENGLISH,
    timezone: 'America/Los_Angeles',
    dateFormat: DateFormat.YYYY_MM_DD, // Prefers ISO format
    timeFormat: TimeFormat.HOUR_24, // Prefers 24-hour time
};

// Export a function to merge with defaults if needed
export const getMockPreferences = (): UserPreferences => {
    return { ...defaultUserPreferences, ...mockUserPreferences };
};

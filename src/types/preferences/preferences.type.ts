// src/types/settings/userPreferences.ts

import {
    Theme,
    FontSize,
    PreviewLines,
    MessageDisplay,
    AutoLoadImages,
    ReplyBehavior,
    UndoSendDelay,
    AutoSaveInterval,
    SwipeAction,
    Language,
    DateFormat,
    TimeFormat,
    EmailNotificationType,
    EmailNotificationsConfig,
    SwipeActionsConfig,
} from './preferences.enums';

export interface UserPreferences {
    // Appearance
    theme: Theme;
    isCompactView: boolean;
    isDateView: boolean;
    fontSize: FontSize;

    // Notifications
    areNotificationsEnabled: boolean;
    isNotificationSoundEnabled: boolean;
    showNotificationPreview: boolean;
    areDesktopNotificationsEnabled: boolean;
    emailNotifications: EmailNotificationsConfig;

    // Email Display
    emailSignature?: string;
    showPreviewPane: boolean;
    previewLines: PreviewLines;
    messageDisplay: MessageDisplay;

    // Privacy & Security
    shouldSendReadReceipts: boolean;
    shouldBlockExternalImages: boolean;
    autoLoadImages: AutoLoadImages;

    // Sending & Receiving
    defaultReplyBehavior: ReplyBehavior;
    shouldConfirmBeforeSending: boolean;
    undoSendDelay: UndoSendDelay;
    isAutoSaveDraftsEnabled: boolean;
    autoSaveInterval: AutoSaveInterval;

    // Organization
    isAutoArchiveEnabled: boolean;
    swipeActions: SwipeActionsConfig;

    // Keyboard Shortcuts
    areKeyboardShortcutsEnabled: boolean;
    customShortcuts?: Record<string, string>;

    // Language & Region
    language: Language;
    timezone: string;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}

// Default preferences using enums
export const defaultUserPreferences: UserPreferences = {
    // Appearance
    theme: Theme.SYSTEM,
    isCompactView: false,
    isDateView: false,
    fontSize: FontSize.MEDIUM,

    // Notifications
    areNotificationsEnabled: true,
    isNotificationSoundEnabled: true,
    showNotificationPreview: true,
    areDesktopNotificationsEnabled: true,
    emailNotifications: {
        [EmailNotificationType.REPLIES]: true,
        [EmailNotificationType.MENTIONS]: true,
        [EmailNotificationType.NEWSLETTERS]: false,
        [EmailNotificationType.MARKETING]: false,
    },

    // Email Display
    showPreviewPane: true,
    previewLines: PreviewLines.TWO,
    messageDisplay: MessageDisplay.STANDARD,

    // Privacy & Security
    shouldSendReadReceipts: false,
    shouldBlockExternalImages: true,
    autoLoadImages: AutoLoadImages.FROM_KNOWN_SENDERS,

    // Sending & Receiving
    defaultReplyBehavior: ReplyBehavior.REPLY,
    shouldConfirmBeforeSending: false,
    undoSendDelay: UndoSendDelay.SECONDS_10,
    isAutoSaveDraftsEnabled: true,
    autoSaveInterval: AutoSaveInterval.SECONDS_30,

    // Organization
    isAutoArchiveEnabled: false,
    swipeActions: {
        left: SwipeAction.ARCHIVE,
        right: SwipeAction.DELETE,
    },

    // Keyboard Shortcuts
    areKeyboardShortcutsEnabled: true,

    // Language & Region
    language: Language.ENGLISH,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: DateFormat.MM_DD_YYYY,
    timeFormat: TimeFormat.HOUR_12,
};
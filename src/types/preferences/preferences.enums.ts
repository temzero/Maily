// src/types/settings/enums.ts
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum FontSize {
  S = "small",
  M = "medium",
  L = "large",
}

export enum PreviewLines {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export enum MessageDisplay {
  STANDARD = "standard",
  CONVERSATION = "conversation",
  COMPACT = "compact",
}

export enum AutoLoadImages {
  ALWAYS = "always",
  NEVER = "never",
  FROM_KNOWN_SENDERS = "from-known-senders",
}

export enum ReplyBehavior {
  REPLY = "reply",
  REPLY_ALL = "reply-all",
}

export enum UndoSendDelay {
  SECONDS_5 = 5,
  SECONDS_10 = 10,
  SECONDS_20 = 20,
  SECONDS_30 = 30,
}

export enum AutoSaveInterval {
  SECONDS_30 = 30,
  SECONDS_60 = 60,
  SECONDS_120 = 120,
}

export enum SwipeAction {
  ARCHIVE = "archive",
  DELETE = "delete",
  MARK_READ = "mark-read",
  STAR = "star",
  SNOOZE = "snooze",
  MOVE_TO = "move-to",
  NONE = "none",
}

export enum Language {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  JAPANESE = "ja",
  CHINESE = "zh",
  ARABIC = "ar",
  HINDI = "hi",
  PORTUGUESE = "pt",
  RUSSIAN = "ru",
}

export enum DateFormat {
  MM_DD_YYYY = "MM/DD/YYYY",
  DD_MM_YYYY = "DD/MM/YYYY",
  YYYY_MM_DD = "YYYY-MM-DD",
}

export enum TimeFormat {
  HOUR_12 = "12h",
  HOUR_24 = "24h",
}

// For email notifications categories
export enum EmailNotificationType {
  REPLIES = "replies",
  MENTIONS = "mentions",
  NEWSLETTERS = "newsletters",
  MARKETING = "marketing",
}

// For swipe actions configuration
export interface SwipeActionsConfig {
  left: SwipeAction;
  right: SwipeAction;
}

// Email notifications settings
export interface EmailNotificationsConfig {
  [EmailNotificationType.REPLIES]: boolean;
  [EmailNotificationType.MENTIONS]: boolean;
  [EmailNotificationType.NEWSLETTERS]: boolean;
  [EmailNotificationType.MARKETING]: boolean;
}
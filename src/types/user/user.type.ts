import { UserPreferences } from "../preferences/preferences.type";

export interface User {
    // Basic Info (keep these)
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;

    // Additional useful fields for email app
    displayName?: string; // For custom display name (e.g., "John D." instead of "John Doe")
    bio?: string; // Short bio or status
    company?: string; // Company/Organization name
    jobTitle?: string; // e.g., "Software Engineer"

    // Email specific
    alternativeEmails?: string[]; // Additional email addresses
    emailVerified: boolean; // Whether email is verified
    signature?: string; // Default email signature

    // Contact info
    phone?: string;
    timezone: string; // User's timezone for email timestamps

    // Preferences (if not stored separately)
    preferences?: UserPreferences; // Reference to your preferences interface

    // Account status
    isActive: boolean;
    lastLoginAt?: string;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

// Optional: Account status enum
export enum AccountStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    PENDING_VERIFICATION = 'pending-verification',
    DEACTIVATED = 'deactivated',
}

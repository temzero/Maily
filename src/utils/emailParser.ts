/**
 * Parses a raw email address string (RFC 5322 format) into name and email components
 * @param raw - Raw email string like "John Doe" <john@example.com> or john@example.com
 * @returns Object with name and email properties
 */
export function parseEmailAddress(raw: string): { name: string; email: string } {
    if (!raw) return { name: '', email: '' };

    // Try to match: "Name" <email@domain.com> or Name <email@domain.com>
    const bracketMatch = raw.match(/(?:"?([^"]+)"?\s+)?<?([^>]+)>?/);

    if (bracketMatch) {
        const name = bracketMatch[1] || '';
        const email = bracketMatch[2] || '';

        // If no email found in brackets, check if the whole string is an email
        if (!email && raw.includes('@')) {
            return { name: '', email: raw.trim() };
        }

        return { name: name.trim(), email: email.trim() };
    }

    // No brackets, check if it's just an email address
    if (raw.includes('@')) {
        return { name: '', email: raw.trim() };
    }

    // Fallback: return raw as name
    return { name: raw.trim(), email: '' };
}

/**
 * Extracts the display name from a SINGLE email address string
 * Use for: From field (single value)
 */
export function getDisplayName(emailString: string): string {
    const { name } = parseEmailAddress(emailString);
    return name;
}

/**
 * Extracts display names from MULTIPLE email address strings
 * Use for: To, CC, BCC fields (arrays)
 * @returns Array of display names
 */
export function getDisplayNames(emailStrings: string[]): string[] {
    return emailStrings.map((email) => getDisplayName(email));
}

/**
 * Gets a friendly display name from a SINGLE email address with fallback
 * Use for: From field
 */
export function getFriendlyDisplayName(emailString: string): string {
    if (!emailString) return 'Unknown Sender';

    const { name, email } = parseEmailAddress(emailString);
    if (name) return name;
    if (email) return email.split('@')[0] || email;
    return 'Unknown Sender';
}

/**
 * Gets friendly display names from MULTIPLE email addresses with fallbacks
 * Use for: To, CC, BCC fields
 * @returns Array of friendly display names
 */
export function getFriendlyDisplayNames(emailStrings: string[]): string[] {
    if (!emailStrings || emailStrings.length === 0) return ['Unknown Recipient'];
    return emailStrings.map((email) => {
        const { name, email: emailAddr } = parseEmailAddress(email);
        if (name) return name;
        if (emailAddr) return emailAddr.split('@')[0] || emailAddr;
        return 'Unknown';
    });
}

// Semantic wrappers for clarity
export function getSenderDisplayName(from: string): string {
    return getFriendlyDisplayName(from);
}

export function getRecipientDisplayNames(to: string[]): string {
    if (!to || to.length === 0) return 'Unknown Recipient';

    const names = to.map((email) => {
        const { name, email: emailAddr } = parseEmailAddress(email);
        if (name) return name;
        if (emailAddr) return emailAddr.split('@')[0] || emailAddr;
        return 'Unknown';
    });

    return names.join(', ');
}

/**
 * Extracts the email address from a raw email address string
 * @param emailString - Raw email string like "John Doe" <john@example.com>
 * @returns The email address or empty string
 */
export function getEmailAddress(emailString: string): string {
    const { email } = parseEmailAddress(emailString);
    return email;
}

// utils/emailParser.ts

export function getRecipientDisplayName(recipient: string): string {
    if (!recipient) return '';

    const match = recipient.match(/(.+)<.+>/);
    if (match) {
        return match[1].trim();
    }

    // If no name format, use the part before @
    const email = getEmailAddress(recipient);
    return email.split('@')[0];
}

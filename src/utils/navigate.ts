// utils/navigation.ts
import { Email, EmailFolder } from '~/types/email/email.type';

interface ComposeOptions {
    email?: Email;
    type?: 'reply' | 'draft' | 'new' | 'forward';
}

export const goToCompose = (navigate: any, options?: ComposeOptions) => {
    const { email, type = 'new' } = options || {};

    // ✅ New compose
    if (!email) {
        navigate('/compose', {
            state: { type: 'new' },
        });
        return;
    }

    // ✅ Forward (must come before reply)
    if (type === 'forward') {
        navigate('/compose', {
            state: {
                type: 'forward',
                forwardFrom: email,
                subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
                content: `\n\n---------- Forwarded message ----------\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.content}`,
                attachments: email.attachments,
            },
        });
        return;
    }

    // ✅ Reply (ONLY when explicitly requested)
    if (type === 'reply') {
        navigate('/compose', {
            state: {
                type: 'reply',
                replyTo: email,
                subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
                to: email.from,
                inReplyTo: email.id,
            },
        });
        return;
    }

    // ✅ Draft continuation
    if (type === 'draft' || email.folder === EmailFolder.DRAFTS) {
        navigate('/compose', {
            state: {
                type: 'draft',
                draftId: email.id,
                draftData: {
                    to: email.to,
                    subject: email.subject,
                    content: email.content,
                    attachments: email.attachments,
                },
            },
        });
        return;
    }

    // ✅ Fallback (safety)
    navigate('/compose', {
        state: { type: 'new' },
    });
};

// Helpers
export const replyToEmail = (navigate: any, email: Email) => {
    goToCompose(navigate, { email, type: 'reply' });
};

export const forwardEmail = (navigate: any, email: Email) => {
    goToCompose(navigate, { email, type: 'forward' });
};

export const continueDraft = (navigate: any, email: Email) => {
    goToCompose(navigate, { email, type: 'draft' });
};

export const newCompose = (navigate: any) => {
    goToCompose(navigate);
};

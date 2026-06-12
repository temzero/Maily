// store/composeModal.store.ts
import { createStore } from 'solid-js/store';
import { Email } from '~/types/email/email.type';
import { audioManager } from '~/utils/audioManager';

export enum ComposeModalType {
    NEW = 'new',
    REPLY = 'reply',
    FORWARD = 'forward',
    DRAFT = 'draft',
}

interface ComposeModalState {
    isOpen: boolean;
    type: ComposeModalType | null;
    email?: Email; // For draft, replyTo, or forwardOf
}

export const [composeModalStore, setComposeModalStore] = createStore<ComposeModalState>({
    isOpen: false,
    type: null,
    email: undefined,
});

export const openComposeModal = (type: ComposeModalType, email?: Email) => {
    setComposeModalStore({ isOpen: true, type, email });
};

export const closeComposeModal = () => {
    setComposeModalStore({ isOpen: false, type: null, email: undefined });
};

// Convenience functions
export const openComposeNew = () => {
    // audioManager.play('openCompose');
    openComposeModal(ComposeModalType.NEW);
};

export const openComposeReply = (replyTo: Email) => {
    // audioManager.play('openCompose');
    openComposeModal(ComposeModalType.REPLY, replyTo);
};

export const openComposeForward = (forwardOf: Email) => {
    // audioManager.play('openCompose');
    openComposeModal(ComposeModalType.FORWARD, forwardOf);
};

export const openComposeDraft = (draftMail: Email) => {
    setComposeModalStore({ type: ComposeModalType.DRAFT, email: draftMail });
};

export const isOverlayMode = (): boolean => {
    return (
        composeModalStore.type === ComposeModalType.REPLY ||
        composeModalStore.type === ComposeModalType.FORWARD
    );
};

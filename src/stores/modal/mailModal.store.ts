// store/modal/mailModal.store.ts
import { createSignal } from 'solid-js';

export const [isMailModalOpen, setIsMailModalOpen] = createSignal(false);

export const openMailModal = () => {
    setIsMailModalOpen(true);
    document.body.style.overflow = 'hidden';
};

export const closeMailModal = () => {
    setIsMailModalOpen(false);
    document.body.style.overflow = '';
};

export const getMailModalState = () => isMailModalOpen();

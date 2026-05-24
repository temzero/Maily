import { createStore } from 'solid-js/store';

// store/modal.store.ts
export enum ModalType {
    COMPOSE = 'compose',
    MAIL_DETAIL = 'mail_detail',
}

interface ModalState {
    isOpen: boolean;
    type: ModalType | null;
    data?: any;
}

const [modalState, setModalState] = createStore<ModalState>({
    isOpen: false,
    type: null,
    data: null,
});

export const openModal = (type: ModalType, data?: any) => {
    setModalState({ isOpen: true, type, data });
};

export const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
};

export const isModalOpen = () => modalState.isOpen;
export const getModalState = () => modalState;
export const getModalStateData = () => modalState.data;

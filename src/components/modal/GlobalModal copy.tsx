// components/modal/GlobalModal.tsx
import { Component, createMemo } from 'solid-js';
import { getModalState, closeModal } from '~/store/modal/modal.store';
import { ModalType } from '~/store/modal/modal.store';
import ComposeModal from '~/components/modal/ComposeModal';
import { ModalWrapper } from './ModalWrapper';

export default function GlobalModal() {
    const modalState = getModalState();

    const isOverlayCompose = createMemo(
        () =>
            modalState.type === ModalType.COMPOSE &&
            (modalState.data?.type === 'reply' || modalState.data?.type === 'forward')
    );

    const renderModalContent = () => {
        switch (modalState.type) {
            case ModalType.COMPOSE:
                return <ComposeModal />;
            default:
                return null;
        }
    };

    return (
        <ModalWrapper
            isOpen={modalState.isOpen}
            zIndex={9999}
            onClose={closeModal}
            closeOnBackdropClick={!isOverlayCompose()}
            disableBackdropBlur={isOverlayCompose()}
            showCloseButton={!isOverlayCompose()}
        >
            {renderModalContent()}
        </ModalWrapper>
    );
}

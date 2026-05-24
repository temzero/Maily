// components/modal/ComposeModal.tsx
import { createMemo } from 'solid-js';
import { ModalWrapper } from './ModalWrapper';
import {
    composeModalStore,
    closeComposeModal,
    ComposeModalType,
} from '~/store/modal/composeModal.store';
import Compose from '~/components/compose/Compose';

interface ComposeModalProps {
    zIndex?: number;
}

export default function ComposeModal(props: ComposeModalProps) {
    const isOverlayCompose = createMemo(
        () =>
            composeModalStore.type === ComposeModalType.REPLY ||
            composeModalStore.type === ComposeModalType.FORWARD
    );

    return (
        <ModalWrapper
            isOpen={composeModalStore.isOpen}
            zIndex={props.zIndex ?? 99999}
            onClose={closeComposeModal}
            closeOnBackdropClick={!isOverlayCompose()}
            disableBackdropBlur={isOverlayCompose()}
            class={`${isOverlayCompose() ? 'pt-12' : ''}`}
        >
            <Compose onClose={closeComposeModal} />
        </ModalWrapper>
    );
}

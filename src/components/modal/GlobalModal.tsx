import { Show } from 'solid-js';
import { uiStore } from '../../stores/ui.store';
import { ActiveEmailModal } from './ActiveMailModal';
import { composeModalStore } from '~/stores/modal/composeModal.store';
import FocusElementModal from './FocusElementModal';
import ComposeModal from './ComposeModal';

export function GlobalModal() {
    return (
        <>
            <Show when={uiStore.activeEmailId}>
                <ActiveEmailModal zIndex={999} />
            </Show>
            <Show when={uiStore.focusedElementId}>
                <FocusElementModal zIndex={9999} />
            </Show>
            {/* <Show when={true}> */}
            <ComposeModal zIndex={99999} />
            {/* </Show> */}
        </>
    );
}

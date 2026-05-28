import { Portal } from 'solid-js/web';
import { setSearchQuery, getSearchQuery } from '~/store/ui.store';
import SearchInput from '~/components/ui/SearchInput';
import ActionButton from '~/components/ui/ActionButton';
import { headerHeight } from '~/constants/height';
import { ImQuill } from 'solid-icons/im';
import { openComposeNew } from '~/store/modal/composeModal.store';
import { Motion } from 'solid-motionone';
import { getSlideAnimation } from '~/utils/animations';
import { Agent } from './Agent';

export default function Footer(props: { class: string }) {
    return (
        <footer
            style={{ height: `${headerHeight}px` }}
            class={`${props.class} fixed bottom-0 left-0 right-0 pointer-events-none bg-linear-to-t from-black/30 to-transparent`}
        >

            <Agent/>
            
            <div class="absolute left-1/2 transform -translate-x-1/2 pointer-events-auto!">
                <Motion {...getSlideAnimation(200, 0.9)}>
                    <SearchInput
                        value={getSearchQuery()}
                        placeholder="Press '/' to focus"
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </Motion>
            </div>

            <ActionButton
                onClick={openComposeNew}
                icon={<ImQuill size={36} />}
                aria-label="Compose new email"
                variant="primary"
                size="xl"
                class="hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform pointer-events-auto! fixed bottom-4 right-4"
                name="Write mail"
            />
        </footer>
    );
}

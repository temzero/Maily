import { Portal } from 'solid-js/web';
import { setSearchQuery, getSearchQuery } from '~/store/ui.store';
import SearchInput from '~/components/ui/SearchInput';
import ActionButton from '~/components/ui/ActionButton';
import { headerHeight } from '~/constants/dimensions';
import { ImQuill } from 'solid-icons/im';
import { openComposeNew } from '~/store/modal/composeModal.store';
import { Motion } from 'solid-motionone';
import { getSlideAnimation } from '~/utils/animations';
import { Agent } from './Agent';
import { agentStore } from '~/store/agent.store';
import { useMobile } from '~/hooks/useMobile';
import { FiFilter } from 'solid-icons/fi'
import { FaSolidSearch } from 'solid-icons/fa';



export default function Footer(props: { class: string }) {
    const { isMobile } = useMobile();
    const isAgentVisible = () => agentStore.isVisible;

    return (
        <footer
            style={{ height: `${headerHeight}px` }}
            class={`${props.class} fixed bottom-0 left-0 right-0 pointer-events-none bg-linear-to-t from-black/30 to-transparent`}
        >

            {isMobile() ? (
                <div class='absolute left-4 bottom-4 flex backdrop-blur rounded-full bg-black/50 shadow-xl custom-border pointer-events-auto!'>
                    <button class='w-12 h-12 flex items-center justify-center rounded-full active:bg-blue-500 text-white'>
                    <FiFilter size={24} />
                    </button>
                    <button class='w-12 h-12 flex items-center justify-center rounded-full active:bg-blue-500 text-white'>
                    <FaSolidSearch size={22} />
                    </button>
                </div>
            ) : (
                isAgentVisible() && <Agent />
            )}
            
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
                size={isMobile() ? 'lg' : 'xl'}
                class="hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform pointer-events-auto! fixed bottom-4 right-4"
                name="Write mail"
            />
        </footer>
    );
}

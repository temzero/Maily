import { setSearchQuery, getSearchQuery } from '~/store/ui.store';
import { ImQuill } from 'solid-icons/im';
import { openComposeNew } from '~/store/modal/composeModal.store';
import { FaSolidSearch } from 'solid-icons/fa';
import { createSignal, Show, onCleanup, createMemo } from 'solid-js';
import { LabelMenu } from '~/components/menu/LabelMenu';
import { getActiveLabels, getRenderActiveLabels } from '~/store/label.store';
import { TbOutlineFilter2 } from 'solid-icons/tb'
import { Motion, Presence } from 'solid-motionone';
import { easings } from '~/constants/easings';
import Button from '~/components/ui/button/Button';

export default function FooterMobile() {
    const [showLabelMenu, setShowLabelMenu] = createSignal(false);
    let menuRef: HTMLDivElement | undefined;

    // Get active labels
    const activeLabels = createMemo(() => getActiveLabels());
    const hasActiveLabels = createMemo(() => activeLabels().length > 0);
    const activeLabelNames = createMemo(() => activeLabels().map(l => l.name).join(', '));
    const renderActiveLabels = createMemo(() => getRenderActiveLabels(24));
    
    const activeIcon = createMemo(() => {
        const activeRenderLabels = renderActiveLabels();
        if (activeRenderLabels.length > 0) {
            return activeRenderLabels[0].iconElement();
        }
        return <TbOutlineFilter2 size={24} />;
    });

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef && !menuRef.contains(e.target as Node)) {
            setShowLabelMenu(false);
        }
    };

    // Add/remove event listener
    if (showLabelMenu()) {
        document.addEventListener('click', handleClickOutside);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }

    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });
    
    return (
        <div class='relative flex p-4 px-6 gap-4 items-end w-full h-full justify-between pointer-events-auto!'>
            <LabelMenu isOpen={showLabelMenu()} onClose={() => setShowLabelMenu(false)}/>

            {/* Filter Label Button */}
            <Show when={!showLabelMenu()}>
                <Motion 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4, easing: easings.bounceHeavy }}
                    style={{ "transform-origin": "bottom left" }}
                >
                    <Button
                        icon={activeIcon()}
                        rounded='full'
                        aria-label="Filter Label"
                        variant="glass"
                        size="sm"
                        class={`shadow-xl pointer-events-auto! ${hasActiveLabels() ? 'relative' : ''}`}
                        name={hasActiveLabels() ? activeLabelNames() : "Filter Label"}
                        onClick={() => setShowLabelMenu(prev => !prev)}
                    />
                </Motion>

                {/* Search Bar */}
                <Motion 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4, easing: easings.bounceHeavy }}
                    style={{ "transform-origin": "bottom center" }}
                    class="h-10 flex-1 flex gap-2 px-2 items-center nav-panel pointer-events-auto!"
                >
                    <FaSolidSearch size={18} />
                    <input
                        type="text"
                        value={getSearchQuery()}
                        placeholder="Search mail..."
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        class="w-full outline-none"
                    />
                </Motion>

                {/* Compose Button */}
                <Motion 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4, easing: easings.bounceHeavy }}
                    style={{ "transform-origin": "bottom right" }}
                >
                    <Button
                        onClick={openComposeNew}
                        icon={<ImQuill size={24} />}
                        rounded='full'
                        aria-label="Compose new email"
                        variant="primary"
                        size="sm"
                        class="shadow-lg hover:scale-105 transition-transform active:scale-95 pointer-events-auto!"
                        name="Write"
                    />
                </Motion>
            </Show>
            {/* </Presence> */}
        </div>
    );
}
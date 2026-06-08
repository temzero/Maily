import { setSearchQuery, getSearchQuery } from '~/store/ui.store';
import Button from '~/components/ui/Button';
import { ImQuill } from 'solid-icons/im';
import { openComposeNew } from '~/store/modal/composeModal.store';
import { FiFilter } from 'solid-icons/fi'
import { FaSolidSearch } from 'solid-icons/fa';
import { createSignal, Show, onCleanup, createMemo } from 'solid-js';
import { LabelMenu } from '~/components/menu/LabelMenu';
import { getActiveLabels, getRenderActiveLabels } from '~/store/label.store';

export default function FooterMobile() {
    const [showLabelMenu, setShowLabelMenu] = createSignal(false);
    let menuRef: HTMLDivElement | undefined;

    // Get active labels
    const activeLabels = createMemo(() => getActiveLabels());
    const hasActiveLabels = createMemo(() => activeLabels().length > 0);
    const activeLabelNames = createMemo(() => activeLabels().map(l => l.name).join(', '));
    const renderActiveLabels = createMemo(() => getRenderActiveLabels(24));
    
    // Get the first active label's icon or default to FiFilter
    const activeIcon = createMemo(() => {
        const activeRenderLabels = renderActiveLabels();
        if (activeRenderLabels.length > 0) {
            return activeRenderLabels[0].iconElement();
        }
        return <FiFilter size={24} />;
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
        <div class='relative flex p-4 gap-4 items-end w-full h-full justify-between pointer-events-auto!'>
            {/* Filter Label Button */}
            <Show when={!showLabelMenu()} fallback={<LabelMenu onClose={() => setShowLabelMenu(false)}/>}>
                <Button
                    icon={activeIcon()}
                    aria-label="Filter Label"
                    variant="outline"
                    size="sm"
                    class={`shadow-xl pointer-events-auto! ${hasActiveLabels() ? 'relative' : ''}`}
                    name={hasActiveLabels() ? activeLabelNames() : "Filter Label"}
                    onClick={() => setShowLabelMenu(prev => !prev)}
                />

                {/* Search Bar */}
                <div class="flex-1 pointer-events-auto! flex gap-2 px-2 items-center h-10 border rounded-full border-2 border-(--border) bg-(--border) backdrop-blur shadow-xl">
                    <FaSolidSearch size={18} />
                    <input
                        type="text"
                        value={getSearchQuery()}
                        placeholder="Search mail..."
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        class="w-full bg-transparent outline-none"
                    />
                </div>

                {/* Compose Button */}
                <Button
                    onClick={openComposeNew}
                    icon={<ImQuill size={28} />}
                    aria-label="Compose new email"
                    variant="primary"
                    size="sm"
                    class="shadow-lg hover:scale-105 transition-transform active:scale-95 pointer-events-auto!"
                    name="Write"
                />
            </Show>
        </div>
    );
}
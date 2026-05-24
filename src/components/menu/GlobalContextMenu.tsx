import { createSignal, onMount, onCleanup, Show, For, Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { MenuItemType, MenuItem } from './MenuItem';

interface ContextMenuState {
    items: MenuItemType[];
    x: number;
    y: number;
    onClose?: () => void;
}

let currentMenu: ContextMenuState | null = null;
let subscribers: Set<(menu: ContextMenuState | null) => void> = new Set();

// 🔥 NEW: flag to ignore the opening right-click event
let justOpened = false;

export const showContextMenu = (
    items: MenuItemType[],
    x: number,
    y: number,
    onClose?: () => void
) => {
    // console.log('🟢 showContextMenu called', { items, x, y });

    if (currentMenu?.onClose) {
        // console.log('🟡 Closing previous menu via onClose');
        currentMenu.onClose();
    }

    currentMenu = { items, x, y, onClose };

    // 🔥 mark as just opened
    justOpened = true;

    // console.log('🟢 New currentMenu set:', currentMenu);
    // console.log('🟢 Notifying subscribers, count:', subscribers.size);

    subscribers.forEach((sub) => sub(currentMenu));
};

export const hideContextMenu = () => {
    // console.log('🔴 hideContextMenu called');

    if (currentMenu?.onClose) {
        // console.log('🟡 Calling onClose before hiding');
        currentMenu.onClose();
    }

    currentMenu = null;

    // console.log('🔴 Notifying subscribers (menu = null)');
    subscribers.forEach((sub) => sub(null));
};

export const GlobalContextMenu: Component = () => {
    const [menu, setMenu] = createSignal<ContextMenuState | null>(null);

    // console.log('🔵 GlobalContextMenu render');

    onMount(() => {
        // console.log('🔵 GlobalContextMenu mounted');

        const handler = (newMenu: ContextMenuState | null) => {
            // console.log('🟣 Subscriber triggered:', newMenu);
            setMenu(newMenu);
        };

        subscribers.add(handler);
        // console.log('🟣 Subscriber added. Total:', subscribers.size);

        // Click outside
        const handleGlobalClick = (e: MouseEvent) => {
            // console.log('🖱️ Global click', e.target);

            if (!menu()) {
                // console.log('⚪ No menu open → ignore click');
                return;
            }

            if ((e.target as HTMLElement).closest('.global-context-menu')) {
                // console.log('⚪ Click inside menu → ignore');
                return;
            }

            // console.log('🔴 Click outside → closing menu');
            hideContextMenu();
        };

        // 🔥 FIXED contextmenu handler
        const handleContextMenu = (e: MouseEvent) => {
            // console.log('🖱️ Global right-click', e.target);

            // 🔥 Ignore the SAME event that opened the menu
            if (justOpened) {
                // console.log('⚪ Ignoring first right-click (menu just opened)');
                justOpened = false;
                return;
            }

            if (!menu()) {
                // console.log('⚪ No menu open → ignore right-click');
                return;
            }

            if ((e.target as HTMLElement).closest('.global-context-menu')) {
                // console.log('⚪ Right-click inside menu → prevent default');
                e.preventDefault();
                return;
            }

            // console.log('🔴 Right-click outside → closing menu');
            hideContextMenu();
        };

        // ESC key
        const handleEscape = (e: KeyboardEvent) => {
            // console.log('⌨️ Key pressed:', e.key);

            if (e.key === 'Escape' && menu()) {
                // console.log('🔴 ESC pressed → closing menu');
                hideContextMenu();
            }
        };

        document.addEventListener('click', handleGlobalClick);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleEscape);

        onCleanup(() => {
            // console.log('🧹 GlobalContextMenu cleanup');

            subscribers.delete(handler);
            // console.log('🧹 Subscriber removed. Remaining:', subscribers.size);

            document.removeEventListener('click', handleGlobalClick);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleEscape);
        });
    });

    return (
        <Show when={menu()}>
            {(m) => {
                // console.log('🟢 Rendering menu UI at:', m().x, m().y);

                return (
                    <Portal>
                        <div
                            class="global-context-menu"
                            style={{
                                position: 'fixed',
                                top: `${m().y}px`,
                                left: `${m().x}px`,
                                'z-index': 999999,
                            }}
                            onClick={(e) => {
                                // console.log('🟡 Click inside menu container');
                                e.stopPropagation();
                            }}
                            onContextMenu={(e) => {
                                // console.log('🟡 Right-click inside menu → prevent default');
                                e.preventDefault();
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    'border-radius': '4px',
                                    'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
                                    'min-width': '200px',
                                }}
                            >
                                <For each={m().items}>
                                    {(item, i) => {
                                        return (
                                            <MenuItem
                                                {...item}
                                                onClose={() => {
                                                    hideContextMenu();
                                                }}
                                            />
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </Portal>
                );
            }}
        </Show>
    );
};

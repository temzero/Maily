// MenuItem.tsx
import { Component, For, Show, createSignal, onCleanup, JSX } from 'solid-js';
import { HiOutlineChevronRight } from 'solid-icons/hi';

export interface MenuItemType {
    name?: string;
    icon?: JSX.Element;
    color?: string; // Add color prop
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    divider?: boolean;
    submenu?: MenuItemType[];
}

interface MenuItemComponentProps extends MenuItemType {
    level?: number;
    onClose?: () => void;
}

export const MenuItem: Component<MenuItemComponentProps> = (props) => {
    const [isSubmenuOpen, setIsSubmenuOpen] = createSignal(false);
    const [submenuPosition, setSubmenuPosition] = createSignal({ x: 0, y: 0 });
    let itemRef: HTMLButtonElement | undefined;
    let closeTimeout: number | undefined;

    const handleClick = () => {
        if (props.disabled) return;

        if (props.submenu) {
            return;
        }

        props.onClick?.();
        props.onClose?.();
    };

    const handleMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = undefined;
        }

        if (props.submenu && itemRef) {
            const rect = itemRef.getBoundingClientRect();
            const submenuWidth = 200; // Approximate width of submenu, adjust as needed
            const viewportWidth = window.innerWidth;

            // Check if submenu would go off the right edge of the screen
            const wouldOverflowRight = rect.right + submenuWidth > viewportWidth;

            setSubmenuPosition({
                x: wouldOverflowRight ? rect.left - submenuWidth : rect.right,
                y: rect.top,
            });
            setIsSubmenuOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (props.submenu) {
            setIsSubmenuOpen(false); // Immediate disappearance
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = undefined;
            }
        }
    };

    const handleSubmenuMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = undefined;
        }
        setIsSubmenuOpen(true);
    };

    const handleSubmenuMouseLeave = () => {
        setIsSubmenuOpen(false); // Immediate disappearance
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = undefined;
        }
    };

    onCleanup(() => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
    });

    if (props.divider) {
        return <div class="h-px bg-(--border)" />;
    }

    return (
        <>
            <button
                ref={itemRef}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={props.disabled}
                class={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer relative
                    ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-(--border)'}
                    ${props.danger ? 'text-red-600 dark:text-red-400' : ''}
                    ${props.level === 0 ? 'rounded-lg' : ''}
                `}
                style={{
                    'padding-left': props.level ? `${0.5 + props.level * 0.5}rem` : undefined,
                    color: props.color,
                }}
            >
                <Show when={props.icon}>
                    <span class="w-5 h-5 flex items-center justify-center shrink-0">
                        {props.icon}
                    </span>
                </Show>
                <span class="flex-1 text-left">{props.name}</span>
                <Show when={props.submenu}>
                    <HiOutlineChevronRight size={16} class="shrink-0" />
                </Show>
            </button>

            <Show when={isSubmenuOpen() && props.submenu}>
                <div
                    class="menu"
                    style={{
                        position: 'fixed',
                        left: `${submenuPosition().x}px`,
                        top: `${submenuPosition().y}px`,
                        'min-width': '200px',
                        'z-index': 9999,
                    }}
                    onMouseEnter={handleSubmenuMouseEnter}
                    onMouseLeave={handleSubmenuMouseLeave}
                >
                    <For each={props.submenu}>
                        {(subItem) => (
                            <MenuItem
                                {...subItem}
                                level={(props.level || 0) + 1}
                                onClose={props.onClose}
                            />
                        )}
                    </For>
                </div>
            </Show>
        </>
    );
};

import { createSignal, onCleanup, Show, Component, createEffect, JSX } from 'solid-js';
import { MenuItem, MenuItemType } from './MenuItem';
import { Portal } from 'solid-js/web';

export interface MenuProps {
    items: MenuItemType[];
    children: JSX.Element;
    position?: MenuPosition;
    offsetX?: number;
    offsetY?: number;
    className?: string;
    isOverlay?: boolean;
    isContextMenu?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

export enum MenuPosition {
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    CURSOR = 'cursor',
}

export const Menu: Component<MenuProps> = (props) => {
    let triggerRef: HTMLDivElement | undefined;
    let menuRef: HTMLDivElement | undefined;

    const [isVisible, setIsVisible] = createSignal(false);
    const [position, setPosition] = createSignal({ x: 0, y: 0 });

    const calculatePosition = () => {
        if (!triggerRef) return { x: 0, y: 0 };

        const rect = triggerRef.getBoundingClientRect();
        const menuWidth = menuRef?.offsetWidth || 200;
        const menuHeight = menuRef?.offsetHeight || props.items.length * 44;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = rect.left;
        let y = rect.bottom + (props.offsetY || 6);

        const positionType = props.position || MenuPosition.BOTTOM_LEFT;

        if (positionType === MenuPosition.TOP_LEFT) {
            y = rect.top - menuHeight - (props.offsetY || 6);
        } else if (positionType === MenuPosition.TOP_RIGHT) {
            x = rect.right - menuWidth;
            y = rect.top - menuHeight - (props.offsetY || 6);
        } else if (positionType === MenuPosition.BOTTOM_RIGHT) {
            x = rect.right - menuWidth;
            y = rect.bottom + (props.offsetY || 6);
        }

        x += props.offsetX || 0;
        y += props.offsetY || 0;

        // Edge detection
        if (x + menuWidth > viewportWidth) x = viewportWidth - menuWidth - 10;
        if (x < 10) x = 10;
        if (y + menuHeight > viewportHeight) y = viewportHeight - menuHeight - 10;
        if (y < 10) y = 10;

        return { x, y };
    };

    const openMenu = (cursorX?: number, cursorY?: number) => {
        if (
            props.position === MenuPosition.CURSOR &&
            cursorX !== undefined &&
            cursorY !== undefined
        ) {
            let x = cursorX;
            let y = cursorY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const estimatedMenuWidth = 200;
            const estimatedMenuHeight = props.items.length * 44;

            if (x + estimatedMenuWidth > viewportWidth) x = viewportWidth - estimatedMenuWidth - 10;
            if (x < 10) x = 10;
            if (y + estimatedMenuHeight > viewportHeight)
                y = viewportHeight - estimatedMenuHeight - 10;
            if (y < 10) y = 10;

            setPosition({ x, y });
        } else {
            setPosition(calculatePosition());
        }

        setIsVisible(true);
        props.onOpen?.();
    };

    const closeMenu = () => {
        setIsVisible(false);
        props.onClose?.();
    };

    const handleGlobalClick = (event: MouseEvent) => {
        if (
            menuRef &&
            !menuRef.contains(event.target as Node) &&
            triggerRef &&
            !triggerRef.contains(event.target as Node)
        ) {
            closeMenu();
        }
    };

    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isVisible()) closeMenu();
    };

    const updatePosition = () => {
        if (isVisible() && props.position !== MenuPosition.CURSOR) {
            setPosition(calculatePosition());
        }
    };

    createEffect(() => {
        if (isVisible()) {
            setTimeout(() => {
                window.addEventListener('click', handleGlobalClick);
                window.addEventListener('keydown', handleEscape);
                window.addEventListener('scroll', updatePosition, true);
                window.addEventListener('resize', updatePosition);
            }, 0);
        } else {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        }
    });

    onCleanup(() => {
        window.removeEventListener('click', handleGlobalClick);
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
    });

    return (
        <>
            <div
                ref={triggerRef}
                class={props.className}
                onClick={(e) => {
                    if (!props.isContextMenu) {
                        e.stopPropagation();
                        openMenu();
                    }
                }}
                onContextMenu={(e) => {
                    if (props.isContextMenu) {
                        e.preventDefault();
                        e.stopPropagation();
                        openMenu(e.clientX, e.clientY);
                    }
                }}
            >
                {props.children}
            </div>

            <Show when={isVisible()}>
                <>
                    {/* Blur Overlay - only for context menu */}
                    {/* {props.isContextMenu && props.isOverlay && (
                        <div
                            class="fixed inset-0 z-60 backdrop-blur-md bg-black/20"
                            onClick={closeMenu}
                        />
                    )} */}

                    {/* Menu - rendered in normal flow */}
                    <Portal>
                        <div
                            ref={menuRef}
                            class="menu"
                            style={{
                                top: `${position().y}px`,
                                left: `${position().x}px`,
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            onClick={(e) => {
                                (e.stopPropagation(), closeMenu());
                            }}
                        >
                            {props.items.map((item) => (
                                <MenuItem {...item} />
                            ))}
                        </div>
                    </Portal>
                </>
            </Show>
        </>
    );
};

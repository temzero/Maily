// ActionBar.jsx
import { For, JSX } from 'solid-js';

type Position = 'top' | 'bottom' | 'left' | 'right';

type Action = {
    id: string;
    label: string;
    icon: JSX.Element | (() => JSX.Element);
    customElement?: JSX.Element;
    onClick?: (e: MouseEvent) => void; // Add MouseEvent parameter
    onContextMenu?: (e: MouseEvent) => void; // Add this if not exists
    disabled?: boolean;
    color?: string;
    divider?: never; // This ensures divider and action are mutually exclusive
};

type Divider = {
    divider: boolean;
    id?: string;
    label?: never;
    icon?: never;
    onClick?: never;
};

type ActionBarProps = {
    actions: (Action | Divider)[];
    position?: Position;
    className?: string;
    onContextMenu?: (e: MouseEvent) => void;
};

const ActionBar = (props: ActionBarProps) => {
    const positionClasses = () => {
        switch (props.position || 'left') {
            case 'top':
                return 'top-4 left-1/2 -translate-x-1/2 flex-row';
            case 'bottom':
                return 'bottom-4 left-1/2 -translate-x-1/2 flex-row';
            case 'left':
                return 'left-0 top-1/2 -translate-y-1/2 flex-col';
            case 'right':
                return 'right-0 top-1/2 -translate-y-1/2 flex-col';
        }
    };

    const containerClasses = () => {
        let borderRadius = '';
        if (props.position === 'top') borderRadius = 'rounded-b-xl';
        else if (props.position === 'bottom') borderRadius = 'rounded-t-xl';
        else if (props.position === 'left') borderRadius = 'rounded-r-xl';
        else if (props.position === 'right') borderRadius = 'rounded-l-xl';

        return `fixed  z-50 flex shadow-lg action-panel ${positionClasses()} ${borderRadius}`;
    };

    const dividerClasses = () => {
        const isHorizontal = props.position === 'top' || props.position === 'bottom';

        if (isHorizontal) {
            return 'w-px h-full bg-(--foreground) opacity-10 mx-0.5';
        }
        return 'h-px w-full bg-(--foreground) opacity-10 my-0.5';
    };

    // Helper to render icon
    const renderIcon = (icon: JSX.Element | (() => JSX.Element)) => {
        return typeof icon === 'function' ? icon() : icon;
    };

    return (
        <div
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.onContextMenu?.(e);
            }}
            class={containerClasses()}
        >
            <For each={props.actions}>
                {(item) => {
                    // Simple check: if it has divider prop, render divider, else render button
                    if (item.divider) {
                        return <div class={dividerClasses()} />;
                    }

                    const action = item as Action;

                    if (action.customElement) {
                        return (
                            <div class="flex items-center justify-center p-1.5  hover:scale-110 transition-all">
                                {action.customElement}
                            </div>
                        );
                    }
                    return (
                        <button
                            class="text-2xl hover:scale-110 p-2 flex items-center justify-center cursor-pointer transition-all"
                            // onMouseDown={(e) => {
                            //     e.preventDefault(); // This prevents the button from stealing focus
                            //     // Still trigger the onClick after preventing default
                            //     action.onClick?.(e);
                            // }}
                            onClick={action.onClick}
                            onContextMenu={action.onContextMenu}
                            aria-label={action.label}
                            title={action.label}
                            style={{ color: action.color || 'inherit' }}
                            disabled={action.disabled}
                        >
                            {renderIcon(action.icon)}
                        </button>
                    );
                }}
            </For>
        </div>
    );
};

export default ActionBar;

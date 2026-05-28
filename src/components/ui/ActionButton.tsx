import { Component, JSX, splitProps } from 'solid-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outline'
    | 'link';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ActionButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon: JSX.Element;
    name?: string; // Optional name for the button, can be used for testing or accessibility
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
    secondary:
        'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 active:bg-gray-300 focus-visible:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:ring-gray-400',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 focus-visible:ring-red-500',
    success:
        'bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500',
    warning:
        'bg-amber-500 text-white border border-amber-500 hover:bg-amber-600 hover:border-amber-600 active:bg-amber-700 focus-visible:ring-amber-400',
    outline:
        'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500',
    link: 'bg-transparent text-blue-600 border border-transparent hover:underline hover:text-blue-700 active:text-blue-800 focus-visible:ring-blue-500',
};

const actionButtonSizeStyles: Record<ButtonSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-16 h-16 text-xl',
};

const loadingSpinnerSize: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
};

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner: Component<{ size: ButtonSize }> = (props) => (
    <svg
        class={`animate-spin ${loadingSpinnerSize[props.size]} shrink-0`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
    </svg>
);

// ─── ActionButton Component ───────────────────────────────────────────────────

const ActionButton: Component<ActionButtonProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'size',
        'loading',
        'icon',
        'class',
        'disabled',
        'aria-label',
    ]);

    const variant = () => local.variant ?? 'primary';
    const size = () => local.size ?? 'md';
    const isDisabled = () => local.disabled || local.loading;

    const baseStyles =
        'custom-border inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-full !p-0 shrink-0';

    return (
        <button
            {...rest}
            disabled={isDisabled()}
            title={props.name}
            aria-label={props.name}
            aria-busy={local.loading}
            class={[
                baseStyles,
                variantStyles[variant()],
                actionButtonSizeStyles[size()],
                local.class ?? '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {local.loading ? (
                <Spinner size={size()} />
            ) : (
                <span class="flex items-center justify-center">{local.icon}</span>
            )}
        </button>
    );
};

// ─── Convenience Presets ─────────────────────────────────────────────────────

export const IconButton: Component<Omit<ActionButtonProps, 'variant'>> = (props) => (
    <ActionButton variant="ghost" {...props} />
);

export const PrimaryActionButton: Component<Omit<ActionButtonProps, 'variant'>> = (props) => (
    <ActionButton variant="primary" {...props} />
);

export const DangerActionButton: Component<Omit<ActionButtonProps, 'variant'>> = (props) => (
    <ActionButton variant="danger" {...props} />
);

export default ActionButton;
export type { ActionButtonProps, ButtonVariant, ButtonSize };

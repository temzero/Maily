// components/ui/Button.tsx
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

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
    fullWidth?: boolean;
    isRounded?: boolean;
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
        'bg-transparent text-(--foreground) border border-(--foreground) opacity-80 hover:opacity-100',
    link: 'bg-transparent text-blue-600 border border-transparent hover:underline hover:text-blue-700 active:text-blue-800 focus-visible:ring-blue-500 px-0',
};

const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-xs px-2.5 py-1 gap-1 rounded-xs',
    sm: 'text-sm px-3 py-1.5 gap-1.5 rounded-sm',
    md: 'text-sm px-4 py-2 gap-2 rounded',
    lg: 'text-base px-5 py-2.5 gap-2 rounded-lg',
    xl: 'text-lg px-6 py-3 gap-2.5 rounded-xl',
};

const roundedStyles: Record<ButtonSize, string> = {
    xs: 'rounded-full',
    sm: 'rounded-full',
    md: 'rounded-full',
    lg: 'rounded-full',
    xl: 'rounded-full',
};

const loadingSpinnerSize: Record<ButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5',
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

// ─── Button Component ─────────────────────────────────────────────────────────

const Button: Component<ButtonProps> = (props) => {
    const [local, rest] = splitProps(props, [
        'variant',
        'size',
        'loading',
        'leftIcon',
        'rightIcon',
        'fullWidth',
        'isRounded',
        'class',
        'children',
        'disabled',
    ]);

    const variant = () => local.variant ?? 'primary';
    const size = () => local.size ?? 'md';
    const isDisabled = () => local.disabled || local.loading;

    const baseStyles =
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const getSizeStyles = () => {
        if (local.isRounded) {
            return roundedStyles[size()];
        }
        return sizeStyles[size()];
    };

    return (
        <button
            {...rest}
            disabled={isDisabled()}
            class={[
                baseStyles,
                variantStyles[variant()],
                getSizeStyles(),
                local.fullWidth ? 'w-full' : '',
                local.class ?? '',
            ]
                .filter(Boolean)
                .join(' ')}
            aria-busy={local.loading}
        >
            {/* Show spinner when loading, otherwise show left icon */}
            {local.loading ? (
                <Spinner size={size()} />
            ) : (
                local.leftIcon && <span class="shrink-0">{local.leftIcon}</span>
            )}

            {/* Button text - dim when loading */}
            {local.children && (
                <span class={local.loading ? 'opacity-70' : ''}>{local.children}</span>
            )}

            {/* Right icon - hide when loading */}
            {!local.loading && local.rightIcon && <span class="shrink-0">{local.rightIcon}</span>}
        </button>
    );
};

export default Button;
export type { ButtonProps, ButtonVariant, ButtonSize };

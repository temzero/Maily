import { Component, JSX, splitProps, mergeProps } from 'solid-js';

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
    icon?: JSX.Element;
    label?: string;
    isFullWidth?: boolean;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600/60 backdrop-blur text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 active:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 active:bg-gray-300 focus-visible:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:ring-gray-400',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 focus-visible:ring-red-500',
    success: 'bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500',
    warning: 'bg-amber-500 text-white border border-amber-500 hover:bg-amber-600 hover:border-amber-600 active:bg-amber-700 focus-visible:ring-amber-400',
    outline: 'bg-transparent text-white border-2 border-(--border) bg-(--border)! backdrop-blur hover:bg-blue-500! active:bg-blue-600! focus-visible:ring-blue-500',
    link: 'bg-transparent text-blue-600 border border-transparent hover:underline hover:text-blue-700 active:text-blue-800 focus-visible:ring-blue-500',
};

const sizeStyles: Record<ButtonSize, { button: string; spinner: string; padding: string }> = {
    xs: { button: 'w-8 h-8', spinner: 'w-3 h-3', padding: 'px-2 py-1' },
    sm: { button: 'w-10 h-10', spinner: 'w-3.5 h-3.5', padding: 'px-3 py-1.5' },
    md: { button: 'w-12 h-12', spinner: 'w-5 h-5', padding: 'px-4 py-2' },
    lg: { button: 'w-14 h-14', spinner: 'w-7 h-7', padding: 'px-5 py-2.5' },
    xl: { button: 'w-16 h-16', spinner: 'w-9 h-9', padding: 'px-6 py-3' },
};

// ─── Spinner Component ─────────────────────────────────────────────────────────

const Spinner: Component<{ size: ButtonSize }> = (props) => (
    <svg
        class={`animate-spin ${sizeStyles[props.size].spinner} shrink-0`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

// ─── Button Component ─────────────────────────────────────────────────────────

const Button: Component<ActionButtonProps> = (props) => {
    const defaults = mergeProps({ variant: 'primary', size: 'md' } as const, props);
    const [local, rest] = splitProps(defaults, ['variant', 'size', 'loading', 'icon', 'label', 'class', 'disabled', 'isFullWidth']);

    const isDisabled = () => local.disabled || local.loading;
    const isIconOnly = () => local.icon && !local.label && !props.children;
    const buttonSize = sizeStyles[local.size];

    const baseStyles = `
        inline-flex items-center justify-center font-medium transition-all duration-150 
        cursor-pointer select-none focus:outline-none focus-visible:ring-2 
        focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
        disabled:pointer-events-none shrink-0
    `;

    const roundedClass = isIconOnly() ? 'rounded-full' : 'rounded-lg';
    const sizeClass = isIconOnly() 
        ? buttonSize.button 
        : buttonSize.padding;
    const widthClass = local.isFullWidth ? 'w-full' : '';

    return (
        <button
            {...rest}
            disabled={isDisabled()}
            aria-label={local.label || (isIconOnly() ? 'icon button' : undefined)}
            aria-busy={local.loading}
            class={[
                baseStyles,
                roundedClass,
                variantStyles[local.variant],
                sizeClass,
                widthClass,
                local.class,
            ].filter(Boolean).join(' ')}
        >
            {local.loading ? (
                <Spinner size={local.size} />
            ) : (
                <>
                    {local.icon && <span class={local.label ? 'mr-2' : ''}>{local.icon}</span>}
                    {local.label}
                    {props.children}
                </>
            )}
        </button>
    );
};

export default Button;
export type { ActionButtonProps, ButtonVariant, ButtonSize };
import { Component, JSX, splitProps, mergeProps } from 'solid-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant =
    | 'primary'
    | 'glass'
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
    icon?: JSX.Element;
    label?: string;
    isFullWidth?: boolean;
}

// ─── Style Maps (static, never recreated) ─────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-[var(--primary-glass)] text-white border-[var(--primary)] hover:bg-[var(--primary)] hover:border-[var(--primary)] active:bg-[var(--primary)] focus-visible:ring-[var(--primary)]',

    glass:
        'glass-panel text-white border-(--border) hover:bg-[var(--primary-glass)]! active:bg-[var(--primary)]! focus-visible:ring-[var(--primary)]',

    ghost:
        'bg-transparent text-gray-800 border-transparent hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 focus-visible:ring-gray-400',

    danger:
        'bg-red-600/70 text-white border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 focus-visible:ring-red-500',

    success:
        'bg-emerald-600/70 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500',

    warning:
        'bg-amber-500/70 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 active:bg-amber-700 focus-visible:ring-amber-400',

    outline:
        'bg-transparent border-(--border) hover:border-[var(--primary)]! active:border-[var(--primary)]! active:text-[var(--primary)] focus-visible:ring-[var(--primary)]',

    link:
        'bg-transparent text-[var(--primary)] border-none! underline hover:opacity-80 active:opacity-60 focus-visible:ring-[var(--primary)]',
};

const sizeStyles: Record<ButtonSize, { button: string; spinner: string; padding: string }> = {
    xs: { button: 'w-8 h-8', spinner: 'w-3 h-3', padding: 'px-2 py-1' },
    sm: { button: 'w-10 h-10', spinner: 'w-3.5 h-3.5', padding: 'px-3 py-1.5' },
    md: { button: 'w-12 h-12', spinner: 'w-5 h-5', padding: 'px-4 py-2' },
    lg: { button: 'w-14 h-14', spinner: 'w-7 h-7', padding: 'px-5 py-2.5' },
    xl: { button: 'w-16 h-16', spinner: 'w-9 h-9', padding: 'px-6 py-3' },
};

const baseStyles = 'active:scale-110 border-2 backdrop-blur inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0';

// ─── Spinner Component (no unnecessary memo) ─────────────────────────────────

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

// ─── Button Component (optimized for Solid's fine-grained reactivity) ─────────

const Button: Component<ButtonProps> = (props) => {
    const defaults = mergeProps({ variant: 'primary', size: 'md' } as const, props);
    const [local, rest] = splitProps(defaults, ['variant', 'size', 'loading', 'icon', 'label', 'class', 'disabled', 'isFullWidth']);

    // Direct computations - Solid handles granular updates automatically
    const isDisabled = () => local.disabled || local.loading;
    const isIconOnly = () => local.icon && !local.label && !props.children;
    
    // Get size config once per render (object lookup is cheap)
    const sizeConfig = sizeStyles[local.size];
    
    // Compute classes directly - Solid will only update what changes
    const getClassName = () => {
        const roundedClass = isIconOnly() ? 'rounded-full' : 'rounded-lg';
        const sizeClass = isIconOnly() ? sizeConfig.button : sizeConfig.padding;
        const widthClass = local.isFullWidth ? 'w-full' : '';
        
        return `${baseStyles} ${roundedClass} ${variantStyles[local.variant]} ${sizeClass} ${widthClass} ${local.class || ''}`.trim();
    };

    return (
        <button
            {...rest}
            disabled={isDisabled()}
            aria-label={local.label || (isIconOnly() ? 'icon button' : undefined)}
            aria-busy={local.loading || undefined}
            class={getClassName()}
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

export type { ButtonProps, ButtonVariant, ButtonSize };
export default Button;
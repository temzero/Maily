import { Component, JSX, splitProps, mergeProps } from 'solid-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant =
    'none'
    | 'primary'
    | 'glass'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outline'
    | 'link';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    loading?: boolean;
    icon?: JSX.Element;
    isFullWidth?: boolean;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
    none: 'border-none!', 
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
        'bg-transparent border-(--border) hover:border-[var(--primary)] active:border-[var(--primary)] active:text-[var(--primary)] focus-visible:ring-[var(--primary)]',

    link:
        'bg-transparent text-[var(--primary)] border-none! underline hover:opacity-80 active:opacity-60 focus-visible:ring-[var(--primary)]',
};

const roundedStyles: Record<ButtonRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
};

const sizeStyles: Record<ButtonSize, { button: string; spinner: string; padding: string }> = {
    xs: { button: 'w-8 h-8 text-xs!', spinner: 'w-3 h-3', padding: 'px-2 py-1 text-xs!' },
    sm: { button: 'w-10 h-10 text-sm!', spinner: 'w-3.5 h-3.5', padding: 'px-3 py-1.5 text-sm!' },
    md: { button: 'w-12 h-12 text-base!', spinner: 'w-5 h-5', padding: 'px-4 py-2 text-base!' },
    lg: { button: 'w-14 h-14 text-lg!', spinner: 'w-7 h-7', padding: 'px-5 py-2.5 text-lg!' },
    xl: { button: 'w-16 h-16 text-xl!', spinner: 'w-9 h-9', padding: 'px-6 py-3 text-xl!' },
};

const baseStyles =
    'active:scale-110 border-2 backdrop-blur inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0';

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner: Component<{ size: ButtonSize }> = (props) => (
    <svg
        class={`animate-spin ${sizeStyles[props.size].spinner} shrink-0`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
        />
        <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
    </svg>
);

// ─── Button ───────────────────────────────────────────────────────────────────

const Button: Component<ButtonProps> = (props) => {
    const defaults = mergeProps(
        {
            variant: 'none',
            size: 'md',
            rounded: 'md',
        } as const,
        props
    );

    const [local, rest] = splitProps(defaults, [
        'variant',
        'size',
        'rounded',
        'loading',
        'icon',
        'class',
        'disabled',
        'isFullWidth',
        'children',
    ]);

    const isDisabled = () => local.disabled || local.loading;

    const isIconOnly = () => local.icon && !local.children;

    const sizeConfig = sizeStyles[local.size];

    const getClassName = () => {
        // Use rounded prop instead of conditional logic
        const roundedClass = roundedStyles[local.rounded];
        const shouldUseFixedSize = isIconOnly();
        const sizeClass = shouldUseFixedSize ? sizeConfig.button : sizeConfig.padding;
        
        const widthClass = local.isFullWidth ? 'w-full' : '';

        return `${baseStyles} ${roundedClass} ${variantStyles[local.variant]} ${sizeClass} ${widthClass} ${local.class || ''}`.trim();
    };

    return (
        <button
            {...rest}
            disabled={isDisabled()}
            aria-busy={local.loading || undefined}
            class={getClassName()}
        >
            {local.loading ? (
                <Spinner size={local.size} />
            ) : (
                <>
                    {local.icon && (
                        <span class={local.children ? 'mr-2' : ''}>
                            {local.icon}
                        </span>
                    )}

                    {local.children}
                </>
            )}
        </button>
    );
};

export type { ButtonProps, ButtonVariant, ButtonSize, ButtonRounded };
export default Button;
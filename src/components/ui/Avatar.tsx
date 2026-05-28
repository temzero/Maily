// components/Avatar.tsx
import { createMemo, Show, splitProps } from 'solid-js';

export interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: boolean | 'full' | 'lg' | 'none';
    onClick?: () => void;
    class?: string;
    showStatus?: boolean;
    status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-16 h-16 text-xl',
};

const roundedClasses = {
    none: 'rounded-none',
    lg: 'rounded-lg',
    full: 'rounded-full',
};

const statusSizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
};

const statusColorClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
};

export function Avatar(props: AvatarProps) {
    const [local, others] = splitProps(props, [
        'src',
        'name',
        'size',
        'rounded',
        'onClick',
        'class',
        'showStatus',
        'status',
    ]);

    // Generate fallback avatar from name
    const fallbackUrl = createMemo(() => {
        if (local.name && local.name.trim()) {
            // Get initials (max 2 characters)
            const initials = local.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

            return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=fff&rounded=${local.rounded === 'full'}&bold=true&size=128`;
        }

        // Default fallback
        return 'https://ui-avatars.com/api/?name=User&background=9ca3af&color=fff&rounded=true';
    });

    // Handle image loading error
    const handleImageError = (e: Event) => {
        const img = e.currentTarget as HTMLImageElement;
        img.src = fallbackUrl();
    };

    const sizeClass = () => sizeClasses[local.size || 'md'];
    const roundedClass = () =>
        roundedClasses[local.rounded === true ? 'full' : local.rounded || 'full'];
    const statusSizeClass = () => statusSizeClasses[local.size || 'md'];
    const statusColorClass = () => statusColorClasses[local.status || 'offline'];

    return (
        <div
            class={`
                relative inline-flex shrink-0 pointer-events-none select-none
                ${sizeClass()}
                ${local.class || ''}
            `}
            onClick={local.onClick}
            style={{ cursor: local.onClick ? 'pointer' : 'default' }}
        >
            <img
                src={local.src || fallbackUrl()}
                alt={local.name || 'Avatar'}
                class={`
                    w-full h-full object-cover
                    ${roundedClass()}
                    ${local.onClick ? 'hover:scale-105 transition-transform' : ''}
                `}
                onError={handleImageError}
                {...others}
            />

            {/* Status indicator */}
            <Show when={local.showStatus}>
                <span
                    class={`
                        absolute bottom-0 right-0
                        ${statusSizeClass()}
                        ${statusColorClass()}
                        rounded-full ring-2 ring-white dark:ring-gray-900
                    `}
                />
            </Show>
        </div>
    );
}

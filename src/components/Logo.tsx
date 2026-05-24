import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router'; // or 'solid-start' depending on your router
import { APP_NAME } from '~/data/constants';
import LogoIcon from '~/assets/logo.svg';


interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    class?: string;
    showName?: boolean;
    onClick?: (e: MouseEvent) => void;
    preventDefault?: boolean;
}

const sizeMap = {
    sm: { logoIcon: 'w-3 h-3', name: 'text-sm', gap: 'gap-0.5' }, // 12px
    md: { logoIcon: 'w-5 h-5', name: 'text-base', gap: 'gap-1' }, // 16px
    lg: { logoIcon: 'w-9 h-9', name: 'text-2xl', gap: 'gap-2' }, // 32px
    xl: { logoIcon: 'w-12 h-12', name: 'text-4xl', gap: 'gap-2' }, // 48px
};

const Logo: Component<LogoProps> = (props) => {
    const navigate = useNavigate();
    const size = () => props.size ?? 'md';
    const showName = () => props.showName ?? true;
    const s = () => sizeMap[size()];

    const handleClick = (e: MouseEvent) => {
        if (props.preventDefault) {
            e.preventDefault();
        }

        if (props.onClick) {
            props.onClick(e);
        } else {
            navigate('/inbox');
        }
    };

    return (
        <div
            onClick={handleClick}
            class={`inline-flex items-center cursor-pointer hover:scale-110 transition-all ${s().gap} ${props.class}`}
        >
            <img src={LogoIcon} class={`${s().logoIcon} leading-none select-none`} alt="mail" />
            {showName() && (
                <span
                    style="font-family: 'Lobster', cursive;"
                    class={`${s().name} leading-none select-none`}
                >
                    {APP_NAME}
                </span>
            )}
        </div>
    );
};

export default Logo;
export { APP_NAME };
export type { LogoProps };

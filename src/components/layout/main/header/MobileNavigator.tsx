// components/mobile/MobileNavigator.tsx
import { useLocation } from '@solidjs/router';
import { Component } from 'solid-js';
import { NAVIGATION_ITEMS } from '~/constants/constants';

interface MobileNavigatorProps {
    class?: string;
    onClick?: () => void;
}

const MobileNavigator: Component<MobileNavigatorProps> = (props) => {
    const location = useLocation();

    // Get current page title based on URL path
    const getCurrentTitle = () => {
        const currentPath = location.pathname;
        const currentItem = NAVIGATION_ITEMS.find((item) => item.href === currentPath);
        return currentItem?.name || 'Inbox';
    };

    return (
        <button 
            class={`button-effect button-effect-scale rounded-lg backdrop-blur px-2 text-3xl font-bold cursor-pointer active:scale-110 transition-all cursor-pointer pointer-events-auto! ${props.class}`}
            onClick={() => props.onClick?.()}
        >
            {getCurrentTitle()}
        </button>
    );
};

export default MobileNavigator;
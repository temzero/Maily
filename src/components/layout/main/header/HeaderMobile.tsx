// components/HeaderMobile.tsx - Separate mobile-specific component
import { createSignal, JSX, Show } from 'solid-js';
import { Motion, Presence } from "solid-motionone";
import { FiMenu, FiArrowLeft } from 'solid-icons/fi';
import { useNavigate, useLocation } from '@solidjs/router';
import { Avatar } from '~/components/ui/Avatar';
import { FiFilter } from 'solid-icons/fi'
import { FaSolidSearch } from 'solid-icons/fa';
import MobileNavigator from './MobileNavigator';
import MobileSidebar from './MobileSidebar';


interface MobileHeaderProps {
    class?: string;
}

export default function HeaderMobile(props: MobileHeaderProps) {
    console.log('HeaderMobile')
    const location = useLocation();
    const [isShowSidebar, setIsShowSidebar] = createSignal(false);
        
    return (
        <>
            <MobileNavigator class='text-white' onClick={() => setIsShowSidebar(true)} />

            <MobileSidebar isOpen={isShowSidebar()} onClose={() => setIsShowSidebar(false)} />

            <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 to-transparent pointer-events-none -z-1" />
        </>
    );
}
// routes/(auth).tsx
import { RouteSectionProps } from '@solidjs/router';
import { useMobile } from '~/hooks/useMobile';
import { getActionButtonSize } from '~/utils/button.utils';
import Logo from '~/components/Logo';

export default function AuthLayout(props: RouteSectionProps) {
    const { isMobile } = useMobile();

    return (
        <div class={`w-screen h-screen py-12 flex flex-col gap-10 items-center ${isMobile() ? 'justify-between' : 'justify-center'}`} 
            style="background: var(--gradient-bg)"
        >
            {!isMobile() && 
                <Logo size={getActionButtonSize(isMobile())} class='absolute top-30' />
            }
            <div class="w-full rounded-md flex items-center justify-center p-10 sm:w-111 sm:border-2 border-(--border) sm:p-8 sm:bg-(--blackOrWhite)">
                {props.children} {/* ✅ replaces <Outlet /> */}
            </div>
            {isMobile() && 
                <Logo size={getActionButtonSize(isMobile())} />
            }
        </div>
    );
}

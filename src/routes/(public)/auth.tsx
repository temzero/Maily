import { RouteSectionProps } from '@solidjs/router';
import { useMobile } from '~/hooks/useMobile';
import { getActionButtonSize } from '~/utils/button.utils';
import Logo from '~/components/Logo';

export default function AuthLayout(props: RouteSectionProps) {
    const { isMobile } = useMobile();

    return (
        <div class={`w-screen h-screen p-8 pt-16 flex flex-col gap-10 items-center ${isMobile() ? '' : 'justify-center'}`} 
            style="background: var(--gradient-bg)"
        >
            <Logo size={getActionButtonSize(isMobile())} />
            {props.children}
        </div>
    );
}
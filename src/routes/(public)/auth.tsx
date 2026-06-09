// routes/(auth).tsx
import { RouteSectionProps } from '@solidjs/router';
import Logo from '~/components/Logo';
import { useMobile } from '~/hooks/useMobile';

export default function AuthLayout(props: RouteSectionProps) {
    const { isMobile } = useMobile();

    return (
        <div class="min-h-screen flex flex-col gap-10 items-center justify-center bg-(--background)">
            <Logo size="xl" />
            <div class="w-111 border-2 border-(--border) rounded flex items-center justify-center p-10 sm:p-8 bg-(--blackOrWhite)">
                {props.children} {/* ✅ replaces <Outlet /> */}
            </div>
        </div>
    );
}

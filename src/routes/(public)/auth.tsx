// routes/(auth).tsx
import { RouteSectionProps } from '@solidjs/router';
import Logo from '~/components/Logo';

export default function AuthLayout(props: RouteSectionProps) {
    return (
        <div class="min-h-screen flex flex-col gap-10 items-center justify-center">
            <Logo size="xl" />
            <div class="w-95 border-2 border-(--border) rounded flex items-center justify-center bg-white/10 p-10 sm:p-8">
                {props.children} {/* ✅ replaces <Outlet /> */}
            </div>
        </div>
    );
}

// components/layout/SettingsLayout.tsx
import { JSX } from 'solid-js';

interface SettingsLayoutProps {
    children: JSX.Element;
    footer?: JSX.Element;
    title: string;
    icon?: JSX.Element;
}

export default function SettingsLayout(props: SettingsLayoutProps) {
    return (
        <div class="min-h-screen  bg-(--blackOrWhite)">
            <div class="max-w-4xl mx-auto p-8">
                <div class="flex gap-1.5 items-center mb-6">
                    {props.icon}
                    <h1 class="text-4xl font-bold inline-0!">{props.title}</h1>
                </div>
                <div class="bg-(--background) rounded-lg border border-(--border) shadow overflow-hidden">
                    {props.children}
                </div>
                {props.footer && (
                    <footer class="max-w-4xl mx-auto text-center text-sm opacity-80 mt-4">
                        {props.footer}
                    </footer>
                )}
            </div>
        </div>
    );
}

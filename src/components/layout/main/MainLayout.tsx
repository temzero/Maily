import { JSX } from 'solid-js';
import Header from './Header';
import Footer from './Footer';

interface HomeLayoutProps {
    children: JSX.Element;
    class?: string;
}

export default function MainLayout(props: HomeLayoutProps): JSX.Element {
    return (
        <div class="relative h-screen flex flex-col">
            {/* Header - not fixed, part of flex column */}
            <Header class="z-50" />

            {/* Scrollable content area */}
            <main
                class={`relative flex-1 flex justify-center px-6 py-20  overflow-y-auto z-0 ${props.class}`}
            >
                {props.children}
            </main>

            {/* Footer - not fixed, part of flex column */}
            <Footer class="z-50" />
        </div>
    );
}

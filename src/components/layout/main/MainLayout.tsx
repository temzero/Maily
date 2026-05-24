import { JSX } from 'solid-js';
import Header from './Header';
import Footer from './Footer';
import { headerHeight } from '~/constants/height';
import { Overlay } from '~/components/Overlay';
import { uiStore } from '~/store/ui.store';

interface HomeLayoutProps {
    children: JSX.Element;
    class?: string;
}

export default function MainLayout(props: HomeLayoutProps): JSX.Element {
    return (
        <div class="h-screen flex flex-col">
            {/* Header - not fixed, part of flex column */}
            <Header class="z-50" />

            {/* Scrollable content area */}
            <main
                class={`flex-1 flex justify-center p-20 pt-22  overflow-y-auto z-0 ${props.class}`}
            >
                {props.children}
            </main>

            {/* Footer - not fixed, part of flex column */}
            <Footer class="z-50" />
        </div>
    );
}

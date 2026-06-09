import { JSX } from "solid-js";
import { useMobile } from "~/hooks/useMobile";

// NavigationContainer.tsx - shared positioning logic only
export function NavigationContainer(props: { children: JSX.Element }) {
    const { isMobile } = useMobile();
    return (
        <div class={isMobile() 
            ? "fixed top-3 right-3 flex gap-3 z-10" 
            : "fixed bottom-4 right-4 flex gap-3 z-10"
        }>
            {props.children}
        </div>
    );
}
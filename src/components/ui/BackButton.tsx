// components/zoom/BackButton.tsx
import { AiOutlineClose } from 'solid-icons/ai';
import { AiOutlineArrowLeft } from 'solid-icons/ai'
import { JSX } from 'solid-js';

interface CloseButtonProps {
    onClose: () => void;
    class?: string;
    zIndex?: number | string;
    size?: number; // size in pixels (rem * 4 = px roughly, but we'll use px)
    iconSize?: number;
    style?: JSX.CSSProperties;
}

export function BackButton(props: CloseButtonProps) {
    const size = props.size ?? 50;
    const iconSize = props.iconSize ?? 40;

    return (
        <button
        type="button"
            class={`
                group overflow-hidden fixed left-2 top-2 rounded-full opacity-80 hover:opacity-100 hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer 
                ${props.class}
            `}
            onClick={(e) => {
                e.stopPropagation();
                props.onClose();
            }}
            aria-label="Close"
            style={{
                'z-index': props.zIndex ?? 102,
                color: 'white',
                width: `${size}px`,
                height: `${size}px`,
                ...props.style,
            }}
        >
            <AiOutlineArrowLeft size={iconSize} class='group-active:scale-125 transition-transform' />
        </button>
    );
}

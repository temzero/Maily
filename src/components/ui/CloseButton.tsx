// components/zoom/CloseButton.tsx
import { AiOutlineClose } from 'solid-icons/ai';
import { createMemo, JSX } from 'solid-js';
import { Position } from '~/types/positions.enum';

interface CloseButtonProps {
    onClose: () => void;
    class?: string;
    zIndex?: number | string;
    size?: number;
    iconSize?: number;
    style?: JSX.CSSProperties;
    position?: Position
}

export function CloseButton(props: CloseButtonProps) {
    const size = props.size ?? 40;
    const iconSize = props.iconSize ?? 36;

    const positionStyles = {
        [Position.TOP_LEFT]: { top: '1rem', left: '1rem' },
        [Position.TOP_RIGHT]: { top: '1rem', right: '1rem' },
        [Position.BOTTOM_LEFT]: { bottom: '1rem', left: '1rem' },
        [Position.BOTTOM_RIGHT]: { bottom: '1rem', right: '1rem' }
    };
    
    const positionStyle = createMemo(() => {
        return props.position 
            ? positionStyles[props.position] 
            : positionStyles[Position.TOP_RIGHT];
    });


    return (
        <button
            type="button"
            class={`
                group overflow-hidden fixed rounded-full opacity-60 hover:opacity-100 
                hover:bg-red-500/80 flex items-center justify-center transition-all cursor-pointer 
                ${props.class}
            `}
            onClick={(e) => {
                e.stopPropagation();
                props.onClose();
            }}
            aria-label="Close"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                'z-index': props.zIndex,
                ...positionStyle(),
                ...props.style
            }}
        >
            <AiOutlineClose size={iconSize} class='group-active:scale-125 transition-transform' />
        </button>
    );
}
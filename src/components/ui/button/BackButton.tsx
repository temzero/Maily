// components/zoom/BackButton.tsx
import { JSX } from 'solid-js';
import { VsArrowLeft } from 'solid-icons/vs';
import Button, { ButtonSize } from './Button';

interface CloseButtonProps {
    onClose: () => void;
    class?: string;
    size?: ButtonSize;
    iconSize?: number;
    isFixed?: boolean;
}

export function BackButton(props: CloseButtonProps) {
    const size = props.size ?? 'md';
    const iconSize = props.iconSize ?? 32;

    const fixedPositionClass = props.isFixed ? 'absolute top-3 left-3 z-999' : ''

    return (
        <Button 
            onClick={props.onClose}
            icon={<VsArrowLeft size={iconSize} />}
            rounded='full'
            variant="glass"
            size={size}
            name="Back"
            class={`${fixedPositionClass} ${props.class}`}
        />
    );
}

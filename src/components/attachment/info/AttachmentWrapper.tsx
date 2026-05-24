import { JSX } from 'solid-js';

type Props = {
    children: JSX.Element;
    class?: string;
    showHoverEffects?: boolean;
};

export const AttachmentWrapper = (props: Props) => {
    const showHoverEffects = props.showHoverEffects ?? true;

    return (
        <div
            class={`relative rounded overflow-hidden custom-border bg-(--border) backdrop-blur ${showHoverEffects ? 'group' : ''} ${props.class || ''}`}
        >
            {props.children}
        </div>
    );
};

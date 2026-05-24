import { Show } from 'solid-js';
import { FiX } from 'solid-icons/fi';

type Props = {
    onRemove?: () => void;
    class?: string;
    size?: number;
};

export const RemoveButton = (props: Props) => {
    return (
        <Show when={props.onRemove}>
            <button
                onClick={() => props.onRemove?.()}
                classList={{
                    'w-8 h-8 flex items-center justify-center text-white/80 bg-(--border) hover:bg-red-600 rounded-full hover:text-white transition-colors': true,
                    ...(props.class && { [props.class]: true }),
                }}
                aria-label="Remove"
                title="Remove"
            >
                <FiX size={props.size || 24} />
            </button>
        </Show>
    );
};

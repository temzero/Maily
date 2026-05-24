import { FaSolidSearch } from 'solid-icons/fa';
import { createSignal, onMount, onCleanup } from 'solid-js';
import { Motion } from 'solid-motionone';

type Props = {
    value: string;
    placeholder?: string;
    class?: string;
    onInput: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
};

export default function SearchInput(props: Props) {
    let inputRef: HTMLInputElement | undefined;
    const [isFocused, setIsFocused] = createSignal(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        // Don't trigger if user is already typing in an input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            // Specifically handle Escape when on the search input
            if (e.key === 'Escape' && target === inputRef) {
                e.preventDefault();
                target.blur();
                handleBlur();
            }
            return;
        }

        // Focus on '/' key
        if (e.key === '/') {
            e.preventDefault(); // Prevent '/' from being typed in the page
            inputRef?.focus();
        }
    };

    onMount(() => {
        document.addEventListener('keydown', handleKeyDown);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', handleKeyDown);
    });

    // Determine if input should be visible
    const shouldShowInput = () => {
        return isFocused() || props.value !== '';
    };

    return (
        <Motion
            animate={{
                y: shouldShowInput() ? '0%' : '300%',
            }}
            transition={{
                duration: 0.2,
            }}
        >
            <div
                class={` ${props.class || ''} flex items-center gap-2 lg:w-150 sm:w-80 p-1 px-1.5 rounded nav-panel`}
            >
                <FaSolidSearch size={22} />
                <input
                    ref={inputRef}
                    type="text"
                    value={props.value}
                    placeholder={props.placeholder}
                    onInput={props.onInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    class="w-full h-full text-lg outline-none focus:outline-none focus:ring-0 "
                />
            </div>
        </Motion>
    );
}

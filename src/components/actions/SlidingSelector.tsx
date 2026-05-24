import { createSignal, onMount, onCleanup } from 'solid-js';

export interface SlidingSelectorOption<T = string> {
    value: T;
    id?: string;
    label?: string;
    icon?: string;
    fontClass?: string;
    textSize?: string;
}

interface SlidingSelectorProps<T = string> {
    options: SlidingSelectorOption<T>[];
    selected: T;
    onSelect: (value: T) => void;
    className?: string;
    sliderClassName?: string;
    buttonClassName?: string;
    height?: number;
    borderWidth?: number;
}

export const SlidingSelector = <T extends string | number | symbol>(
    props: SlidingSelectorProps<T>
) => {
    let containerRef: HTMLDivElement | undefined;
    let sliderRef: HTMLDivElement | undefined;
    let buttonRefs: (HTMLButtonElement | null)[] = [];

    const [isDragging, setIsDragging] = createSignal(false);
    const [sliderLeft, setSliderLeft] = createSignal(0);
    const [sliderWidth, setSliderWidth] = createSignal(0);

    // Track local selected index for instant UI updates
    const [localSelectedIndex, setLocalSelectedIndex] = createSignal<number | null>(null);

    const selectedIndex = () => {
        // Use local index if available (during drag/click), otherwise use props
        const localIdx = localSelectedIndex();
        if (localIdx !== null) return localIdx;
        return props.options.findIndex((opt) => opt.value === props.selected);
    };

    const itemCount = () => props.options.length;

    let startX = 0;
    let startLeft = 0;

    const updateSliderPosition = () => {
        if (!containerRef || !buttonRefs[selectedIndex()]) return;

        const selectedButton = buttonRefs[selectedIndex()];
        const containerRect = containerRef.getBoundingClientRect();
        const buttonRect = selectedButton!.getBoundingClientRect();

        const newLeft = buttonRect.left - containerRect.left;
        const newWidth = buttonRect.width;

        setSliderWidth(newWidth);
        if (sliderRef) {
            sliderRef.style.width = `${newWidth}px`;
        }
        setSliderLeft(newLeft);
    };

    // Parent container handles drag start
    const handleContainerMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        startX = e.clientX;
        startLeft = sliderLeft();

        if (sliderRef) {
            sliderRef.style.cursor = 'grabbing';
        }
    };

    const handleDragMove = (e: MouseEvent) => {
        if (!isDragging() || !containerRef) return;

        const deltaX = e.clientX - startX;
        let newLeft = startLeft + deltaX;

        // Constrain bounds
        const maxLeft = containerRef.offsetWidth - sliderWidth();
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));

        setSliderLeft(newLeft);

        // Update local selected index instantly while dragging
        const hoveredIndex = Math.round(
            newLeft / (containerRef.offsetWidth / props.options.length)
        );
        const boundedIndex = Math.max(0, Math.min(hoveredIndex, props.options.length - 1));
        setLocalSelectedIndex(boundedIndex);
    };

    const handleDragEnd = () => {
        if (!isDragging()) return;

        setIsDragging(false);

        // Find which button we're closest to
        let closestIndex = 0;
        let minDistance = Infinity;

        buttonRefs.forEach((button, idx) => {
            if (button && containerRef) {
                const containerRect = containerRef.getBoundingClientRect();
                const buttonRect = button.getBoundingClientRect();
                const buttonCenter = (buttonRect.left + buttonRect.right) / 2;
                const sliderCenter = containerRect.left + sliderLeft() + sliderWidth() / 2;
                const distance = Math.abs(buttonCenter - sliderCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = idx;
                }
            }
        });

        // Snap to the closest button position
        const closestButton = buttonRefs[closestIndex];
        if (closestButton && containerRef) {
            const containerRect = containerRef.getBoundingClientRect();
            const buttonRect = closestButton.getBoundingClientRect();
            const snapLeft = buttonRect.left - containerRect.left;
            const snapWidth = buttonRect.width;

            setSliderLeft(snapLeft);
            setSliderWidth(snapWidth);
            if (sliderRef) {
                sliderRef.style.width = `${snapWidth}px`;
            }

            // Update local index and trigger select
            setLocalSelectedIndex(closestIndex);
            props.onSelect(props.options[closestIndex].value);

            // Clear local index after a short delay to let parent sync
            setTimeout(() => {
                if (!isDragging()) {
                    setLocalSelectedIndex(null);
                }
            }, 100);
        }

        if (sliderRef) {
            sliderRef.style.cursor = 'grab';
        }
    };

    const handleClick = (value: T, index: number) => {
        if (!isDragging()) {
            const clickedButton = buttonRefs[index];
            if (clickedButton && containerRef) {
                const containerRect = containerRef.getBoundingClientRect();
                const buttonRect = clickedButton.getBoundingClientRect();
                const newLeft = buttonRect.left - containerRect.left;
                const newWidth = buttonRect.width;

                setSliderLeft(newLeft);
                setSliderWidth(newWidth);
                if (sliderRef) {
                    sliderRef.style.width = `${newWidth}px`;
                }

                // Update local index instantly
                setLocalSelectedIndex(index);
                props.onSelect(value);

                // Clear local index after a short delay
                setTimeout(() => {
                    if (!isDragging()) {
                        setLocalSelectedIndex(null);
                    }
                }, 100);
            }
        }
    };

    onMount(() => {
        updateSliderPosition();
        window.addEventListener('resize', updateSliderPosition);

        // Global event listeners for drag
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);

        onCleanup(() => {
            window.removeEventListener('resize', updateSliderPosition);
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
        });
    });

    return (
        <div
            ref={containerRef}
            style={{ height: `${props.height || 48}px` }}
            class={`relative nav-panel rounded-full! select-none ${props.className || ''}`}
            onMouseDown={handleContainerMouseDown}
        >
            {props.borderWidth && props.borderWidth > 0 && (
                <div
                    class="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        'box-shadow': `inset 0 0 0 ${props.borderWidth || 2}px var(--border-dark)`,
                    }}
                />
            )}

            {/* Slider - below buttons, no mouse events */}
            <div
                ref={sliderRef}
                style={{
                    left: `${sliderLeft()}px`,
                    height: `${(props.height || 48) - (props.borderWidth || 0) * 2}px`,
                    width: `${sliderWidth()}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
                class={`absolute rounded-full bg-black/60 shadow-lg z-0 ${props.sliderClassName || ''}`}
            />

            {/* Options - above slider, clickable */}
            <div class="relative z-10 flex items-center w-full h-full">
                {props.options.map((option, idx) => (
                    <button
                        ref={(el) => (buttonRefs[idx] = el)}
                        onClick={() => handleClick(option.value, idx)}
                        style={{ height: `${props.height || 48}px` }}
                        class={`flex-1 px-4 rounded-full text-lg  flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                            selectedIndex() === idx
                                ? 'text-blue-400 font-bold '
                                : 'opacity-80 hover:opacity-100'
                        } ${props.buttonClassName || ''}`}
                    >
                        {option.icon && (
                            <i
                                class={`material-symbols-outlined mr-1 ${option.fontClass || ''} ${option.textSize || ''}`}
                            >
                                {option.icon}
                            </i>
                        )}
                        {option.label || String(option.value)}
                    </button>
                ))}
            </div>
        </div>
    );
};

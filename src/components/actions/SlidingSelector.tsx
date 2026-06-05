import { createSignal, createEffect, onMount, onCleanup } from "solid-js";

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
  props: SlidingSelectorProps<T>,
) => {
  const height = props.height ?? 60;
  const borderWidth = props.borderWidth ?? 2;
  const totalHeight = height + borderWidth * 2;
  const sliderHeight = height - borderWidth * 2;
  const roundedClass = `rounded-full!`;

  let containerRef: HTMLDivElement | undefined;
  let sliderRef: HTMLDivElement | undefined;
  let buttonRefs: (HTMLButtonElement | null)[] = [];

  const [isDragging, setIsDragging] = createSignal(false);
  const [sliderLeft, setSliderLeft] = createSignal(0);
  const [sliderWidth, setSliderWidth] = createSignal(0);
  const [selectedIndex, setSelectedIndex] = createSignal(
    props.options.findIndex((opt) => opt.value === props.selected),
  );

  let startX = 0;
  let startLeft = 0;

  const syncSliderToIndex = (idx: number) => {
    const button = buttonRefs[idx];

    if (!button || !containerRef) return;

    const containerRect = containerRef.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    if (buttonRect.width === 0) return;

    setSliderLeft(buttonRect.left - containerRect.left);
    setSliderWidth(buttonRect.width);
  };

  createEffect(() => {
    const idx = props.options.findIndex((opt) => opt.value === props.selected);

    if (idx !== -1) {
      setSelectedIndex(idx);
      syncSliderToIndex(idx);
    }
  });

  // Helper to get clientX from both mouse and touch events
  const getClientX = (e: MouseEvent | TouchEvent): number => {
    if (e instanceof TouchEvent && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    if (e instanceof MouseEvent) {
      return e.clientX;
    }
    return 0;
  };

  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);

    startX = getClientX(e);
    startLeft = sliderLeft();
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging() || !containerRef) return;

    const currentX = getClientX(e);
    const deltaX = currentX - startX;

    const maxLeft = containerRef.offsetWidth - sliderWidth();
    const newLeft = Math.max(0, Math.min(startLeft + deltaX, maxLeft));

    setSliderLeft(newLeft);

    const hoveredIndex = Math.round(
      newLeft / (containerRef.offsetWidth / props.options.length),
    );

    setSelectedIndex(
      Math.max(0, Math.min(hoveredIndex, props.options.length - 1)),
    );
  };

  const handleDragEnd = () => {
    if (!isDragging()) return;

    setIsDragging(false);

    let closestIndex = 0;
    let minDistance = Infinity;

    buttonRefs.forEach((button, idx) => {
      if (!button || !containerRef) return;

      const containerRect = containerRef.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const buttonCenter = (buttonRect.left + buttonRect.right) / 2;
      const sliderCenter =
        containerRect.left + sliderLeft() + sliderWidth() / 2;
      const distance = Math.abs(buttonCenter - sliderCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setSelectedIndex(closestIndex);
    props.onSelect(props.options[closestIndex].value);
  };

  const handleClick = (value: T, index: number) => {
    if (isDragging()) return;
    setSelectedIndex(index);
    props.onSelect(value);
  };

  const handleResize = () => {
    syncSliderToIndex(selectedIndex());
  };

  // Prevent scroll while dragging on touch devices
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging()) {
      e.preventDefault();
    }
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);
    
    // Mouse events
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    
    // Touch events
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
    window.addEventListener("touchcancel", handleDragEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
    
    // Mouse events
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("mouseup", handleDragEnd);
    
    // Touch events
    window.removeEventListener("touchmove", handleDragMove);
    window.removeEventListener("touchend", handleDragEnd);
    window.removeEventListener("touchcancel", handleDragEnd);
    window.removeEventListener("touchmove", handleTouchMove);
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${totalHeight}px` }}
      class={`relative nav-panel ${roundedClass} select-none touch-action-none ${
        props.className || ""
      }`}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {borderWidth > 0 && (
        <div
          class={`absolute inset-0 ${roundedClass} pointer-events-none`}
          style={{
            "box-shadow": `inset 0 0 0 ${borderWidth}px var(--border-dark)`,
          }}
        />
      )}

      <div
        ref={sliderRef}
        style={{
          left: `${sliderLeft()}px`,
          height: `${sliderHeight}px`,
          width: `${sliderWidth()}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        class={`absolute ${roundedClass} bg-black/60 shadow-lg z-0 ${
          props.sliderClassName || ""
        }`}
      />

      <div class="relative z-10 flex items-center w-full h-full">
        {props.options.map((option, idx) => (
          <button
            ref={(el) => (buttonRefs[idx] = el)}
            onClick={() => handleClick(option.value, idx)}
            style={{ height: `${height}px` }}
            class={`flex-1 px-4 ${roundedClass} text-xl flex items-center justify-center cursor-pointer transition-all duration-100 ease-out touch-manipulation ${
              selectedIndex() === idx
                ? "text-blue-400 scale-110 font-semibold"
                : "opacity-80 hover:opacity-100"
            } ${props.buttonClassName || ""}`}
          >
            {option.icon && (
              <i
                class={`material-symbols-outlined mr-1 ${
                  option.fontClass || ""
                } ${option.textSize || ""}`}
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
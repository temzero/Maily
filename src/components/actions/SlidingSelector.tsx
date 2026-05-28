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

  const handleContainerMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    setIsDragging(true);

    startX = e.clientX;
    startLeft = sliderLeft();
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging() || !containerRef) return;

    const deltaX = e.clientX - startX;

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

  onMount(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("mouseup", handleDragEnd);
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `${props.height || 48}px` }}
      class={`relative nav-panel rounded-full! select-none ${
        props.className || ""
      }`}
      onMouseDown={handleContainerMouseDown}
    >
      {props.borderWidth && props.borderWidth > 0 && (
        <div
          class="absolute inset-0 rounded-full pointer-events-none"
          style={{
            "box-shadow": `inset 0 0 0 ${props.borderWidth}px var(--border-dark)`,
          }}
        />
      )}

      <div
        ref={sliderRef}
        style={{
          left: `${sliderLeft()}px`,
          height: `${(props.height || 48) - (props.borderWidth || 0) * 2}px`,
          width: `${sliderWidth()}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        class={`absolute rounded-full bg-black/60 shadow-lg z-0 ${
          props.sliderClassName || ""
        }`}
      />

      <div class="relative z-10 flex items-center w-full h-full">
        {props.options.map((option, idx) => (
          <button
            ref={(el) => (buttonRefs[idx] = el)}
            onClick={() => handleClick(option.value, idx)}
            style={{ height: `${props.height || 48}px` }}
            class={`flex-1 px-4 rounded-full text-xl flex items-center justify-center cursor-pointer transition-colors duration-150 ${
              selectedIndex() === idx
                ? "text-blue-400 font-bold"
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

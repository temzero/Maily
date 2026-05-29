import { Show, createSignal, onCleanup, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { ChromePicker } from "solid-color";

type ColorPickerButtonProps = {
  color?: string | null;
  onChange: (hex: string) => void;
  shape?: "circle" | "square";
  size?: string;
  label?: string;
  offsetX?: number;
  offsetY?: number;
};

export default function ColorPickerButton(props: ColorPickerButtonProps) {
  const [open, setOpen] = createSignal(false);
  const [pickerPosition, setPickerPosition] = createSignal({ top: 0, left: 0 });
  let swatchRef: HTMLDivElement | undefined;
  let pickerRef: HTMLDivElement | undefined;

  const shapeClass = props.shape === "circle" ? "rounded-full" : "rounded";
  const sizeClass = props.size ?? "w-6 h-6";

  const hasColor = () => {
    const color = props.color;
    return color && color.trim() !== "" && color !== "transparent";
  };

  const displayColor = (): string =>
    hasColor() ? props.color! : "transparent";

  const handleChange = (color: {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
  }) => {
    const { r, g, b, a = 1 } = color.rgb;
    const value = a === 1 ? color.hex : `rgba(${r}, ${g}, ${b}, ${a})`;
    props.onChange(value);
  };

  const calculatePosition = () => {
    if (!swatchRef) return;

    const rect = swatchRef.getBoundingClientRect();

    const left = rect.left + (props.offsetX || 0);
    const top = rect.top + (props.offsetY || 0);

    setPickerPosition({ top, left });
  };

  const handleOpen = () => {
    calculatePosition();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle click outside using createEffect
  createEffect(() => {
    if (!open()) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideSwatch = swatchRef?.contains(target);
      const isClickInsidePicker = pickerRef?.contains(target);

      if (!isClickInsideSwatch && !isClickInsidePicker) {
        handleClose();
      }
    };

    // Add listener after a short delay to avoid immediately closing
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    onCleanup(() => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <div class="relative group">
      <div
        ref={swatchRef}
        class={`relative ${sizeClass} ${shapeClass} cursor-pointer border-2 border-white/70 hover:border-white transition-all hover:scale-110`}
        style={{
          background: displayColor(),
          ...(!hasColor() && {
            backgroundImage: `repeating-linear-gradient(45deg, #666 0px, #666 2px, transparent 2px, transparent 8px)`,
          }),
        }}
        onClick={handleOpen}
        title={
          props.label ||
          (hasColor() ? (props.color ?? "transparent") : "transparent")
        }
      >
        {!hasColor() && (
          <div class="absolute top-1/2 left-1/2 w-full h-0.5 bg-red-500 rotate-135 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>

      <Show when={props.label}>
        <div class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] bg-black/70 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {props.label}
        </div>
      </Show>

      <Show when={open()}>
        <Portal>
          <div
            ref={pickerRef}
            class="fixed z-99999"
            style={{
              top: `${pickerPosition().top}px`,
              left: `${pickerPosition().left}px`,
            }}
          >
            <ChromePicker
              color={hasColor() ? props.color! : "#000000"}
              onChange={handleChange}
            />
          </div>
        </Portal>
      </Show>
    </div>
  );
}

import { CompactPicker } from "solid-color";
import { ChromePicker } from "solid-color";
import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

type TextColorPickerProps = {
  color?: string | null;
  onChange: (hex: string) => void;
  shape?: "circle" | "square";
  size?: string;
  label?: string;
  offsetX?: number;
  offsetY?: number;
};

export default function TextColorPicker(props: TextColorPickerProps) {
  const [open, setOpen] = createSignal(false);
  const [pickerPosition, setPickerPosition] = createSignal({ top: 0, left: 0 });
  let swatchRef: HTMLDivElement | undefined;
  let savedSelection: Range | null = null;

  const shapeClass = props.shape === "circle" ? "rounded-full" : "rounded";
  const sizeClass = props.size ?? "w-6 h-6";

  const hasColor = () => {
    const color = props.color;
    return color && color.trim() !== "" && color !== "transparent";
  };

  const displayColor = (): string =>
    hasColor() ? props.color! : "transparent";

  // Save current selection
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection = selection.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection and focus
  const restoreSelectionAndFocus = () => {
    if (savedSelection) {
      // Focus the editor first
      const editor = document.querySelector(
        '[contenteditable="true"]',
      ) as HTMLElement;
      if (editor) {
        editor.focus();
      }

      // Restore the selection
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection);
      }
      savedSelection = null;
    }
  };

  const handleChange = (color: {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
  }) => {
    const { r, g, b, a = 1 } = color.rgb;
    const value = a === 1 ? color.hex : `rgba(${r}, ${g}, ${b}, ${a})`;

    // Restore selection and focus BEFORE applying color
    restoreSelectionAndFocus();

    // Apply the color
    props.onChange(value);

    // Close the picker
    // setOpen(false);

    // Ensure focus stays on editor after closing
    const editor = document.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    if (editor) {
      editor.focus();
      if (savedSelection) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(savedSelection);
        savedSelection = null;
      }
    }
  };

  const calculatePosition = () => {
    if (!swatchRef) return;
    const rect = swatchRef.getBoundingClientRect();
    const left = rect.left + (props.offsetX || 0);
    const top = rect.top + (props.offsetY || 0);
    setPickerPosition({ top, left });
  };

  const handleMouseDown = (e: MouseEvent) => {
    // Prevent button from stealing focus
    e.preventDefault();

    // Save current selection before opening
    saveSelection();

    calculatePosition();
    setOpen(true);
  };

  const handleClose = () => {
    restoreSelectionAndFocus();
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open()) {
      handleClose();
    }
  };

  createEffect(() => {
    if (open()) {
      document.addEventListener("keydown", handleKeyDown);
      onCleanup(() => {
        document.removeEventListener("keydown", handleKeyDown);
      });
    }
  });
  return (
    <div class="relative group">
      <div
        ref={swatchRef}
        class={`relative ${sizeClass} ${shapeClass} cursor-pointer border-2 border-white/70 hover:border-white transition-all hover:scale-110 shadow-sm`}
        style={{
          background: displayColor(),
          ...(!hasColor() && {
            backgroundImage: `repeating-linear-gradient(45deg, #666 0px, #666 2px, transparent 2px, transparent 8px)`,
          }),
        }}
        onMouseDown={handleMouseDown}
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
        <div class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium">
          {props.label}
        </div>
      </Show>

      <Show when={open()}>
        <Portal>
          <div
            class="fixed inset-0 z-99998"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClose}
          />
          <div
            class="fixed z-99999"
            style={{
              top: `${pickerPosition().top}px`,
              left: `${pickerPosition().left}px`,
            }}
            onMouseDown={(e) => e.preventDefault()}
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

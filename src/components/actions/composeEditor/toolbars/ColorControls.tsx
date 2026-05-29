// components/actions/ColorControls.tsx
import { RiSystemResetLeftFill } from "solid-icons/ri";
import { ACTION_BUTTON_HOVER_CLASSES } from "../constants";
import TextColorPicker from "~/components/colorPicker/TextColorPicker";
import { Accessor, Setter } from "solid-js";

interface Props {
  textColor: Accessor<string>; // Accessor type for text color signal
  highlightColor: Accessor<string>; // Accessor type for highlight color signal
  setTextColor: Setter<string>; // Setter type for text color
  setHighlightColor: Setter<string>; // Setter type for highlight color
  defaultTextColor: string;
  defaultHighlightColor: string;
}

const ColorControls = ({
  textColor,
  highlightColor,
  setTextColor,
  setHighlightColor,
  defaultTextColor,
  defaultHighlightColor,
}: Props) => {
  const resetTextColor = () => {
    setTextColor(defaultTextColor);
  };

  const resetHighlightColor = () => {
    setHighlightColor(defaultHighlightColor);
  };

  return (
    <div
      class="flex flex-col gap-0.5"
      // Make this clickable because parent already set disable default to not lost focus
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* TEXT COLOR */}
      <div class="flex items-center gap-1">
        <div class={ACTION_BUTTON_HOVER_CLASSES}>
          <TextColorPicker
            color={textColor()}
            onChange={setTextColor}
            offsetX={30}
            offsetY={12}
            shape="circle"
          />
        </div>
        {textColor() !== defaultTextColor && (
          <ResetButton onClick={resetTextColor} title="Reset text color" />
        )}
      </div>

      {/* HIGHLIGHT COLOR */}
      <div class="flex items-center gap-1">
        <div class={ACTION_BUTTON_HOVER_CLASSES}>
          <TextColorPicker
            color={highlightColor()}
            onChange={setHighlightColor}
            offsetX={30}
            offsetY={12}
            shape="square"
          />
        </div>
        {highlightColor() !== defaultHighlightColor && (
          <ResetButton
            onClick={resetHighlightColor}
            title="Reset highlight color"
          />
        )}
      </div>
    </div>
  );
};

const ResetButton = ({
  onClick,
  title,
}: {
  onClick: () => void;
  title: string;
}) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault(); // This prevents focus loss
      onClick();
    }}
    class="rounded-full flex items-center justify-center hover:scale-110 opacity-80 hover:opacity-100 transition-all"
    title={title}
  >
    <RiSystemResetLeftFill size={18} />
  </button>
);

export default ColorControls;

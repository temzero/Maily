// components/actions/FontSizeControls.tsx
import { Accessor, createMemo, Setter } from "solid-js";
import {
  ACTION_BUTTON_CLASSES,
  ACTIVE_BUTTON_CLASSES,
  BUTTON_CONTAINER_CLASSES,
} from "../constants";
import { FontSize } from "~/types/preferences/preferences.enums";


interface Props {
  fontSize: Accessor<FontSize>;
  setFontSize: Setter<FontSize>;
}

const FontSizeControls = ({ fontSize, setFontSize }: Props) => {
  const isSmall = createMemo(() => fontSize() === FontSize.S);
  const isMedium = createMemo(() => fontSize() === FontSize.M);
  const isLarge = createMemo(() => fontSize() === FontSize.L);

  return (
    <div class={BUTTON_CONTAINER_CLASSES}>
      <FontSizeButton
        label="S"
        className="text-lg"
        isActive={isSmall}
        onClick={() => setFontSize(FontSize.S)}
      />
      <FontSizeButton
        label="M"
        className="text-xl"
        isActive={isMedium}
        onClick={() => setFontSize(FontSize.M)}
      />
      <FontSizeButton
        label="L"
        className="text-3xl"
        isActive={isLarge}
        onClick={() => setFontSize(FontSize.L)}
      />
    </div>
  );
};

const FontSizeButton = ({
  label,
  className,
  isActive,
  onClick,
}: {
  label: string;
  className: string;
  isActive: () => boolean;
  onClick: () => void;
}) => (
  <button
    class={`${ACTION_BUTTON_CLASSES} ${className} ${isActive() ? ACTIVE_BUTTON_CLASSES : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default FontSizeControls;

// components/actions/FormattingControls.tsx
import {
  FaSolidBold,
  FaSolidItalic,
  FaSolidUnderline,
} from "solid-icons/fa";
import {
  ACTION_BUTTON_CLASSES,
  ACTIVE_BUTTON_CLASSES,
  BUTTON_CONTAINER_CLASSES,
} from "../constants";
import { Accessor } from "solid-js";

const buttonSize = 20;

interface Props {
 isBold: Accessor<boolean>;
  isItalic: Accessor<boolean>;
  isUnderline: Accessor<boolean>;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
}

const FormattingControls = ({ 
  isBold, 
  isItalic, 
  isUnderline, 
  onToggleBold, 
  onToggleItalic, 
  onToggleUnderline 
}: Props) => {
  return (
    <div class={BUTTON_CONTAINER_CLASSES}
    >
      <FormatButton
        icon={FaSolidBold}
        isActive={isBold}
        onClick={onToggleBold}
        ariaLabel="Bold"
      />
      <FormatButton
        icon={FaSolidItalic}
        isActive={isItalic}
        onClick={onToggleItalic}
        ariaLabel="Italic"
      />
      <FormatButton
        icon={FaSolidUnderline}
        isActive={isUnderline}
        onClick={onToggleUnderline}
        ariaLabel="Underline"
      />
    </div>
  );
};

const FormatButton = ({ icon: Icon, isActive, onClick, ariaLabel }: {
  icon: any;
  isActive: () => boolean;
  onClick: () => void;
  ariaLabel: string;
}) => (
  <button
    class={`${ACTION_BUTTON_CLASSES} ${isActive() ? ACTIVE_BUTTON_CLASSES : ""}`}
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={isActive()}
  >
    <Icon size={buttonSize} />
  </button>
);

export default FormattingControls;
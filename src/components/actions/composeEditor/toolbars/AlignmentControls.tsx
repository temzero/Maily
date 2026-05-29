// components/actions/AlignmentControls.tsx
import { Accessor, createMemo, Setter } from "solid-js";
import {
  FaSolidAlignLeft,
  FaSolidAlignCenter,
  FaSolidAlignRight,
  FaSolidAlignJustify,
} from "solid-icons/fa";
import {
  ACTION_BUTTON_CLASSES,
  ACTIVE_BUTTON_CLASSES,
  BUTTON_CONTAINER_CLASSES,
} from "../constants";

const buttonSize = 20;

interface Props {
  alignment: Accessor<string>;
  setAlignment: Setter<string>;
}

const AlignmentControls = ({ alignment, setAlignment }: Props) => {
  const isLeft = createMemo(() => alignment() === "justifyLeft");
  const isCenter = createMemo(() => alignment() === "justifyCenter");
  const isRight = createMemo(() => alignment() === "justifyRight");
  const isJustify = createMemo(() => alignment() === "justifyFull");

  return (
    <div class={BUTTON_CONTAINER_CLASSES}
    >
      <AlignmentButton
        icon={FaSolidAlignLeft}
        isActive={isLeft}
        onClick={() => setAlignment("justifyLeft")}
        ariaLabel="Align left"
      />
      <AlignmentButton
        icon={FaSolidAlignCenter}
        isActive={isCenter}
        onClick={() => setAlignment("justifyCenter")}
        ariaLabel="Align center"
      />
      <AlignmentButton
        icon={FaSolidAlignRight}
        isActive={isRight}
        onClick={() => setAlignment("justifyRight")}
        ariaLabel="Align right"
      />
      <AlignmentButton
        icon={FaSolidAlignJustify}
        isActive={isJustify}
        onClick={() => setAlignment("justifyFull")}
        ariaLabel="Justify"
      />
    </div>
  );
};

const AlignmentButton = ({
  icon: Icon,
  isActive,
  onClick,
  ariaLabel,
}: {
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

export default AlignmentControls;

// components/actions/ComposeEditor.tsx
import { createEffect, createSignal, onCleanup } from "solid-js";

import FontFamilySelect from "./toolbars/FontFamilySelect";
import ColorControls from "./toolbars/ColorControls";
import FontSizeControls from "./toolbars/FontSizeControls";
import FormattingControls from "./toolbars/FormattingControls";
import AlignmentControls from "./toolbars/AlignmentControls";

import { DEFAULT_HIGHLIGHT_COLOR, DEFAULT_TEXT_COLOR } from "./constants";
import { useTypingStyle } from "./hooks/useTypingStyle";
import { FontSize } from "~/types/preferences/preferences.enums";
import { FontFamily } from "~/types/font-family.enums";

const ComposeEditor = () => {
  const [textColor, setTextColor] = createSignal(DEFAULT_TEXT_COLOR);
  const [highlightColor, setHighlightColor] = createSignal(
    DEFAULT_HIGHLIGHT_COLOR,
  );
  const [fontFamily, setFontFamily] = createSignal<FontFamily>(FontFamily.ARIAL);
  const [fontSize, setFontSize] = createSignal<FontSize>(FontSize.M);

  const [isBold, setBold] = createSignal<boolean>(false);
  const [isItalic, setItalic] = createSignal<boolean>(false);
  const [isUnderline, setUnderline] = createSignal<boolean>(false);

  const [alignment, setAlignment] = createSignal<string>(
    "justifyLeft",
  );

  useTypingStyle({
    textColor,
    highlightColor,

    fontFamily,
    fontSize,

    isBold,
    isItalic,
    isUnderline,

    alignment,
  });

  return (
    <div
      class="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6"
      onPointerDown={(e) => e.preventDefault()}
    >
      <FontFamilySelect fontFamily={fontFamily} setFontFamily={setFontFamily} />

      <ColorControls
        textColor={textColor}
        highlightColor={highlightColor}
        setTextColor={setTextColor}
        setHighlightColor={setHighlightColor}
        defaultTextColor={DEFAULT_TEXT_COLOR}
        defaultHighlightColor={DEFAULT_HIGHLIGHT_COLOR}
      />

      <FontSizeControls fontSize={fontSize} setFontSize={setFontSize} />

      <FormattingControls
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        onToggleBold={() => setBold((prev) => !prev)}
        onToggleItalic={() => setItalic((prev) => !prev)}
        onToggleUnderline={() => setUnderline((prev) => !prev)}
      />

      <AlignmentControls
        alignment={alignment}
        setAlignment={setAlignment}
      />
    </div>
  );
};

export default ComposeEditor;

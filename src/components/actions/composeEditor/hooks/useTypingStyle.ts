// useTypingStyle.ts
import { Accessor, createEffect } from "solid-js";
import { FontFamily } from "~/types/font-family.enums";
import { FontSize } from "~/types/preferences/preferences.enums";

const sizeMap: Record<FontSize, string> = {
  [FontSize.S]: "1rem", // 16px
  [FontSize.M]: "1.25rem", // 20px
  [FontSize.L]: "1.75rem", // 24px
};

type UseTypingStyleProps = {
  textColor: Accessor<string>;
  highlightColor: Accessor<string>;

  fontFamily: Accessor<FontFamily>;
  fontSize: Accessor<FontSize>;

  isBold: Accessor<boolean>;
  isItalic: Accessor<boolean>;
  isUnderline: Accessor<boolean>;

  alignment: Accessor<string>;
};

export function useTypingStyle(props: UseTypingStyleProps) {
  let prevBold = false;
  let prevItalic = false;
  let prevUnderline = false;

  let prevFontSize = "";
  let prevFontFamily = "";

  let prevTextColor = "";
  let prevHighlightColor = "";

  let prevAlignment = "";

  const getEditableElement = () => {
    const activeElement = document.activeElement as HTMLElement;

    if (!activeElement) return null;
    if (!activeElement.isContentEditable) return null;

    return activeElement;
  };

  const exec = (command: string, value?: string) => {
    const el = getEditableElement();

    if (!el) return;

    document.execCommand(command, false, value);
  };

  const applyFontStyles = () => {
    const currentFontFamily = props.fontFamily();
    const currentFontSize = props.fontSize();

    // Only apply if something changed
    if (
      currentFontFamily === prevFontFamily &&
      currentFontSize === prevFontSize
    )
      return;

    const selection = window.getSelection();

    // Build CSS
    let css = "";
    if (currentFontFamily) {
      css += `font-family: ${currentFontFamily};`;
    }
    if (currentFontSize && sizeMap[currentFontSize]) {
      css += `font-size: ${sizeMap[currentFontSize]};`;
    }

    if (!css) return;

    if (selection && !selection.isCollapsed) {
      // Apply to selected/highlighted text
      const range = selection.getRangeAt(0);

      // Check if we're already inside a span with styles
      const selectedContent = range.extractContents();
      const span = document.createElement("span");
      span.style.cssText = css;

      // Preserve existing styles by wrapping the content
      span.appendChild(selectedContent);
      range.insertNode(span);

      // Re-select the text so user can see what was changed
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } else if (selection?.isCollapsed) {
      // Apply to future typing
      exec("insertHTML", `<span style="${css}">&#8203;</span>`);
    }

    prevFontFamily = currentFontFamily;
    prevFontSize = currentFontSize;
  };

  const applyColors = () => {
    const currentTextColor = props.textColor();
    const currentHighlightColor = props.highlightColor();

    if (currentTextColor !== prevTextColor) {
      exec("foreColor", currentTextColor);
      prevTextColor = currentTextColor;
    }

    if (currentHighlightColor !== prevHighlightColor) {
      exec("hiliteColor", currentHighlightColor);
      prevHighlightColor = currentHighlightColor;
    }
  };

  const applyFormatting = () => {
    const currentBold = props.isBold();
    const currentItalic = props.isItalic();
    const currentUnderline = props.isUnderline();

    if (currentBold !== prevBold) {
      exec("bold");
      prevBold = currentBold;
    }

    if (currentItalic !== prevItalic) {
      exec("italic");
      prevItalic = currentItalic;
    }

    if (currentUnderline !== prevUnderline) {
      exec("underline");
      prevUnderline = currentUnderline;
    }
  };

  const applyAlignment = () => {
    const currentAlignment = props.alignment();

    if (!currentAlignment) return;

    if (currentAlignment === prevAlignment) return;

    const alignCommand = currentAlignment.toLowerCase();

    if (alignCommand === "justifyleft") {
      exec("justifyLeft");
    } else if (alignCommand === "justifycenter") {
      exec("justifyCenter");
    } else if (alignCommand === "justifyright") {
      exec("justifyRight");
    } else if (alignCommand === "justifyfull") {
      exec("justifyFull");
    }

    prevAlignment = currentAlignment;
  };

  createEffect(() => {
    props.textColor();
    props.highlightColor();
    applyColors();
  });

  createEffect(() => {
    props.fontFamily();
    props.fontSize();
    applyFontStyles();
  });

  createEffect(() => {
    props.isBold();
    props.isItalic();
    props.isUnderline();
    applyFormatting();
  });

  createEffect(() => {
    props.alignment();
    applyAlignment();
  });
}

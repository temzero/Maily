// components/actions/ComposeEditor.tsx
import { createSignal, onCleanup } from "solid-js";

import FontFamilySelect from "./toolbars/FontFamilySelect";
import ColorControls from "./toolbars/ColorControls";
import FontSizeControls from "./toolbars/FontSizeControls";
import FormattingControls from "./toolbars/FormattingControls";
import AlignmentControls from "./toolbars/AlignmentControls";

import {
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_TEXT_COLOR,
} from "./constants";

const ComposeEditor = () => {
  const [textColor, setTextColor] = createSignal(DEFAULT_TEXT_COLOR);
  const [highlightColor, setHighlightColor] = createSignal(
    DEFAULT_HIGHLIGHT_COLOR,
  );

  const [activeFontSize, setActiveFontSize] =
    createSignal<string | null>("medium");

  const [activeFontFamily, setActiveFontFamily] =
    createSignal<string | null>(null);

  const [activeFormatting, setActiveFormatting] = createSignal<string[]>([]);

  const [activeAlignment, setActiveAlignment] =
    createSignal<string | null>("justifyLeft");

  // persistent typing styles
  let currentTextColor = DEFAULT_TEXT_COLOR;
  let currentHighlightColor = DEFAULT_HIGHLIGHT_COLOR;
  let currentFontSize = "16px";
  let currentFontFamily = "";
  let currentFormatting: string[] = [];

  const getEditor = (): HTMLElement | null => {
    return document.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
  };

  const preventEditorBlur = (e: MouseEvent | PointerEvent) => {
    e.preventDefault();
  };

  const exec = (command: string, value?: string) => {
    const editor = getEditor();
    if (!editor) return;

    editor.focus();

    document.execCommand(command, false, value);

    editor.dispatchEvent(
      new Event("input", { bubbles: true }),
    );
  };

  const getFontSizeInPx = (size: string): string => {
    switch (size) {
      case "small":
        return "12px";

      case "medium":
        return "16px";

      case "large":
        return "24px";

      default:
        return "16px";
    }
  };

  // apply persistent typing styles
  const handleInput = () => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) return;

    const node = selection.anchorNode;

    if (!node || node.nodeType !== Node.TEXT_NODE) return;

    const parent = node.parentElement;

    if (!parent) return;

    const needColor =
      currentTextColor !== DEFAULT_TEXT_COLOR &&
      parent.style.color !== currentTextColor;

    const needHighlight =
      currentHighlightColor !== DEFAULT_HIGHLIGHT_COLOR &&
      parent.style.backgroundColor !== currentHighlightColor;

    const needFontSize =
      parent.style.fontSize !== currentFontSize;

    const needFontFamily =
      currentFontFamily &&
      parent.style.fontFamily !== currentFontFamily;

    const needFormatting =
      (currentFormatting.includes("bold") &&
        parent.style.fontWeight !== "bold") ||
      (currentFormatting.includes("italic") &&
        parent.style.fontStyle !== "italic") ||
      (currentFormatting.includes("underline") &&
        parent.style.textDecoration !== "underline");

    if (
      !needColor &&
      !needHighlight &&
      !needFontSize &&
      !needFontFamily &&
      !needFormatting
    ) {
      return;
    }

    const range = document.createRange();

    range.selectNodeContents(node);

    const span = document.createElement("span");

    if (currentTextColor !== DEFAULT_TEXT_COLOR) {
      span.style.color = currentTextColor;
    }

    if (
      currentHighlightColor !== DEFAULT_HIGHLIGHT_COLOR
    ) {
      span.style.backgroundColor =
        currentHighlightColor;
    }

    span.style.fontSize = currentFontSize;

    if (currentFontFamily) {
      span.style.fontFamily = currentFontFamily;
    }

    if (currentFormatting.includes("bold")) {
      span.style.fontWeight = "bold";
    }

    if (currentFormatting.includes("italic")) {
      span.style.fontStyle = "italic";
    }

    if (currentFormatting.includes("underline")) {
      span.style.textDecoration = "underline";
    }

    span.appendChild(range.extractContents());

    range.insertNode(span);

    selection.removeAllRanges();

    const newRange = document.createRange();

    newRange.selectNodeContents(span);

    newRange.collapse(false);

    selection.addRange(newRange);
  };

  const applyStyle = (
    style: string,
    value: string,
  ) => {
    const editor = getEditor();

    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();

    if (!selection) return;

    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);

      const span = document.createElement("span");

      switch (style) {
        case "color":
          span.style.color = value;
          break;

        case "backgroundColor":
          span.style.backgroundColor = value;
          break;

        case "fontSize":
          span.style.fontSize = value;
          break;

        case "fontFamily":
          span.style.fontFamily = value;
          break;
      }

      if (currentFormatting.includes("bold")) {
        span.style.fontWeight = "bold";
      }

      if (currentFormatting.includes("italic")) {
        span.style.fontStyle = "italic";
      }

      if (currentFormatting.includes("underline")) {
        span.style.textDecoration = "underline";
      }

      span.appendChild(range.extractContents());

      range.insertNode(span);

      selection.removeAllRanges();

      const newRange = document.createRange();

      newRange.selectNodeContents(span);

      newRange.collapse(false);

      selection.addRange(newRange);
    } else {
      const span = document.createElement("span");

      switch (style) {
        case "color":
          span.style.color = value;
          break;

        case "backgroundColor":
          span.style.backgroundColor = value;
          break;

        case "fontSize":
          span.style.fontSize = value;
          break;

        case "fontFamily":
          span.style.fontFamily = value;
          break;
      }

      if (currentFormatting.includes("bold")) {
        span.style.fontWeight = "bold";
      }

      if (currentFormatting.includes("italic")) {
        span.style.fontStyle = "italic";
      }

      if (currentFormatting.includes("underline")) {
        span.style.textDecoration = "underline";
      }

      span.innerHTML = "&#8203;";

      document.execCommand(
        "insertHTML",
        false,
        span.outerHTML,
      );
    }

    editor.dispatchEvent(
      new Event("input", { bubbles: true }),
    );
  };

  // colors
  const applyTextColor = (color: string) => {
    currentTextColor = color;

    setTextColor(color);

    applyStyle("color", color);
  };

  const resetTextColor = () => {
    currentTextColor = DEFAULT_TEXT_COLOR;

    setTextColor(DEFAULT_TEXT_COLOR);

    document.execCommand("removeFormat", false);
  };

  const applyHighlightColor = (color: string) => {
    currentHighlightColor = color;

    setHighlightColor(color);

    applyStyle("backgroundColor", color);
  };

  const resetHighlightColor = () => {
    currentHighlightColor =
      DEFAULT_HIGHLIGHT_COLOR;

    setHighlightColor(DEFAULT_HIGHLIGHT_COLOR);

    document.execCommand("removeFormat", false);
  };

  // formatting
  const format = (command: string) => {
    exec(command);

    setActiveFormatting((prev) => {
      const next = prev.includes(command)
        ? prev.filter((f) => f !== command)
        : [...prev, command];

      currentFormatting = next;

      return next;
    });
  };

  // alignment
  const setAlignment = (command: string) => {
    exec(command);

    setActiveAlignment(command);
  };

  // font size
  const setFontSize = (size: string) => {
    setActiveFontSize(size);

    const px = getFontSizeInPx(size);

    currentFontSize = px;

    applyStyle("fontSize", px);
  };

  // font family
  const setFontFamily = (font: string) => {
    setActiveFontFamily(font);

    currentFontFamily = font;

    applyStyle("fontFamily", font);
  };

  // setup editor listener
  const setupInputListener = () => {
    const editor = getEditor();

    if (
      editor &&
      !editor.dataset.listenerAttached
    ) {
      editor.addEventListener(
        "input",
        handleInput,
      );

      editor.dataset.listenerAttached = "true";
    }
  };

  const observer = new MutationObserver(() => {
    const editor = getEditor();

    if (editor) {
      setupInputListener();

      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  onCleanup(() => {
    observer.disconnect();

    const editor = getEditor();

    if (editor) {
      editor.removeEventListener(
        "input",
        handleInput,
      );
    }
  });

  return (
    <div
      class="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6"
      onMouseDown={preventEditorBlur}
      onPointerDown={preventEditorBlur}
    >
      <FontFamilySelect
        onFontChange={setFontFamily}
      />

      <ColorControls
        textColor={textColor()}
        highlightColor={highlightColor()}
        onTextColorChange={applyTextColor}
        onHighlightColorChange={
          applyHighlightColor
        }
        onResetTextColor={resetTextColor}
        onResetHighlightColor={
          resetHighlightColor
        }
        defaultTextColor={
          DEFAULT_TEXT_COLOR
        }
        defaultHighlightColor={
          DEFAULT_HIGHLIGHT_COLOR
        }
      />

      <FontSizeControls
        activeFontSize={activeFontSize()}
        onFontSizeChange={setFontSize}
      />

      <FormattingControls
        activeFormatting={
          activeFormatting()
        }
        onFormat={format}
      />

      <AlignmentControls
        activeAlignment={
          activeAlignment()
        }
        onAlignmentChange={setAlignment}
      />
    </div>
  );
};

export default ComposeEditor;
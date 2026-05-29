// components/actions/ComposeEditor.tsx
import {
  FaSolidBold,
  FaSolidItalic,
  FaSolidAlignLeft,
  FaSolidAlignCenter,
  FaSolidAlignRight,
  FaSolidAlignJustify,
  FaSolidUnderline,
} from "solid-icons/fa";

import { createSignal } from "solid-js";
import { RiSystemResetLeftFill } from "solid-icons/ri";
import TextColorPicker from "../colorPicker/TextColorPicker";

const DefaultTextColor = "#000000";
const DefaultHighlightColor = "transparent";
const buttonSize = 20;

const ComposeEditor = () => {
  const [textColor, setTextColor] = createSignal(DefaultTextColor);
  const [highlightColor, setHighlightColor] = createSignal(
    DefaultHighlightColor
  );

  const [activeFontSize, setActiveFontSize] =
    createSignal<string | null>("medium");

  const [activeFormatting, setActiveFormatting] = createSignal<string[]>([]);

  const [activeAlignment, setActiveAlignment] =
    createSignal<string | null>("justifyLeft");

  const actionButtonHoverClasses =
    "opacity-80 hover:opacity-100 hover:scale-125 transition-all origin-left";

  const actionButtonClasses = `w-7 h-6 pl-1 flex items-center justify-start text-center rounded ${actionButtonHoverClasses}`;

  const activeButtonClasses = "bg-blue-500 text-white";

  const buttonContainerClasses = "flex flex-col gap-2";

  // =========================================
  // HELPERS
  // =========================================

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

  const applyCurrentTypingStyles = () => {
    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    let container = range.startContainer as HTMLElement;

    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentElement as HTMLElement;
    }

    if (!(container instanceof HTMLElement)) return;

    container.style.color = textColor();

    container.style.backgroundColor = highlightColor();

    if (activeFontSize()) {
      container.style.fontSize = getFontSizeInPx(activeFontSize()!);
    }
  };

  const handleEditorInput = () => {
    applyCurrentTypingStyles();
  };

  const getEditor = (): HTMLElement | null => {
    const editor = document.querySelector(
      '[contenteditable="true"]'
    ) as HTMLElement;

    if (editor && !editor.dataset.listenerAttached) {
      editor.addEventListener("input", handleEditorInput);

      editor.dataset.listenerAttached = "true";
    }

    return editor;
  };

  // =========================================
  // APPLY STYLE TO SELECTION
  // =========================================

  const applyStyle = (style: string, value: string) => {
    const editor = getEditor();

    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();

    if (!selection || !selection.rangeCount) return;

    // Apply to selected text
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
      }

      span.appendChild(range.extractContents());

      range.insertNode(span);

      // Move cursor to end
      selection.removeAllRanges();

      const newRange = document.createRange();

      newRange.selectNodeContents(span);

      newRange.collapse(false);

      selection.addRange(newRange);
    }

    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // =========================================
  // TEXT COLOR
  // =========================================

  const applyTextColor = (color: string) => {
    setTextColor(color);

    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      applyStyle("color", color);
    }
  };

  const resetTextColor = () => {
    setTextColor(DefaultTextColor);
  };

  // =========================================
  // HIGHLIGHT COLOR
  // =========================================

  const applyHighlightColor = (color: string) => {
    setHighlightColor(color);

    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      applyStyle("backgroundColor", color);
    }
  };

  const resetHighlightColor = () => {
    setHighlightColor(DefaultHighlightColor);
  };

  // =========================================
  // FORMAT
  // =========================================

  const format = (command: string) => {
    const editor = getEditor();

    if (!editor) return;

    editor.focus();

    document.execCommand(command, false);

    if (command === "bold") {
      setActiveFormatting((prev) =>
        prev.includes("bold")
          ? prev.filter((f) => f !== "bold")
          : [...prev, "bold"]
      );
    } else if (command === "italic") {
      setActiveFormatting((prev) =>
        prev.includes("italic")
          ? prev.filter((f) => f !== "italic")
          : [...prev, "italic"]
      );
    } else if (command === "underline") {
      setActiveFormatting((prev) =>
        prev.includes("underline")
          ? prev.filter((f) => f !== "underline")
          : [...prev, "underline"]
      );
    }

    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // =========================================
  // ALIGNMENT
  // =========================================

  const setAlignment = (command: string) => {
    const editor = getEditor();

    if (!editor) return;

    editor.focus();

    document.execCommand(command, false);

    setActiveAlignment(command);

    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  // =========================================
  // FONT SIZE
  // =========================================

  const setFontSize = (size: string) => {
    setActiveFontSize(size);

    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      applyStyle("fontSize", getFontSizeInPx(size));
    }
  };

  // =========================================
  // FONT FAMILY
  // =========================================

  const setFontFamily = (font: string) => {
    const editor = getEditor();

    if (!editor) return;

    editor.focus();

    document.execCommand("fontName", false, font);

    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <div class="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
      {/* FONT FAMILY */}

      <select
        class={`py-1 bg-(--border) rounded ${actionButtonHoverClasses}`}
        onChange={(e) => setFontFamily(e.currentTarget.value)}
      >
        <option class="text-black bg-white rounded-t">Arial</option>

        <option class="text-black bg-white">Serif</option>

        <option class="text-black bg-white rounded-b">Mono</option>
      </select>

      {/* COLORS */}

      <div class="flex flex-col gap-0.5">
        {/* TEXT COLOR */}

        <div class="flex items-center gap-1">
          <div class={actionButtonHoverClasses}>
            <TextColorPicker
              color={textColor()}
              onChange={(color) => applyTextColor(color)}
              offsetX={30}
              offsetY={12}
              shape="circle"
            />
          </div>

          {textColor() !== DefaultTextColor && (
            <button
              onClick={resetTextColor}
              class="rounded-full flex items-center justify-center hover:scale-110 opacity-80 hover:opacity-100 transition-all"
              title="Reset text color"
            >
              <RiSystemResetLeftFill size={18} />
            </button>
          )}
        </div>

        <div />

        {/* HIGHLIGHT COLOR */}

        <div class="flex items-center gap-1">
          <div class={actionButtonHoverClasses}>
            <TextColorPicker
              color={highlightColor()}
              onChange={(color) => applyHighlightColor(color)}
              offsetX={30}
              offsetY={12}
              shape="square"
            />
          </div>

          {highlightColor() !== DefaultHighlightColor && (
            <button
              onClick={resetHighlightColor}
              class="rounded-full flex items-center justify-center hover:scale-110 opacity-80 hover:opacity-100 transition-all"
              title="Reset highlight color"
            >
              <RiSystemResetLeftFill size={18} />
            </button>
          )}
        </div>
      </div>

      {/* FONT SIZE */}

      <div class={buttonContainerClasses}>
        <button
          class={`${actionButtonClasses} text-lg ${
            activeFontSize() === "small" ? activeButtonClasses : ""
          }`}
          onClick={() => setFontSize("small")}
        >
          S
        </button>

        <button
          class={`${actionButtonClasses} text-xl ${
            activeFontSize() === "medium" ? activeButtonClasses : ""
          }`}
          onClick={() => setFontSize("medium")}
        >
          M
        </button>

        <button
          class={`${actionButtonClasses} text-3xl ${
            activeFontSize() === "large" ? activeButtonClasses : ""
          }`}
          onClick={() => setFontSize("large")}
        >
          L
        </button>
      </div>

      {/* FORMATTING */}

      <div class={buttonContainerClasses}>
        <button
          class={`${actionButtonClasses} ${
            activeFormatting().includes("bold")
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => format("bold")}
        >
          <FaSolidBold size={buttonSize} />
        </button>

        <button
          class={`${actionButtonClasses} ${
            activeFormatting().includes("italic")
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => format("italic")}
        >
          <FaSolidItalic size={buttonSize} />
        </button>

        <button
          class={`${actionButtonClasses} ${
            activeFormatting().includes("underline")
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => format("underline")}
        >
          <FaSolidUnderline size={buttonSize} />
        </button>
      </div>

      {/* ALIGNMENT */}

      <div class={buttonContainerClasses}>
        <button
          class={`${actionButtonClasses} ${
            activeAlignment() === "justifyLeft"
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => setAlignment("justifyLeft")}
        >
          <FaSolidAlignLeft size={buttonSize} />
        </button>

        <button
          class={`${actionButtonClasses} ${
            activeAlignment() === "justifyCenter"
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => setAlignment("justifyCenter")}
        >
          <FaSolidAlignCenter size={buttonSize} />
        </button>

        <button
          class={`${actionButtonClasses} ${
            activeAlignment() === "justifyRight"
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => setAlignment("justifyRight")}
        >
          <FaSolidAlignRight size={buttonSize} />
        </button>

        <button
          class={`${actionButtonClasses} ${
            activeAlignment() === "justifyFull"
              ? activeButtonClasses
              : ""
          }`}
          onClick={() => setAlignment("justifyFull")}
        >
          <FaSolidAlignJustify size={buttonSize} />
        </button>
      </div>
    </div>
  );
};

export default ComposeEditor;
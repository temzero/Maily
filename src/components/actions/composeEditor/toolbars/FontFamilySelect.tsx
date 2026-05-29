// components/actions/FontFamilySelect.tsx
import { Accessor, Setter } from "solid-js";
import { ACTION_BUTTON_HOVER_CLASSES } from "../constants";
import { FontFamily } from "~/types/font-family.enums";

interface Props {
  fontFamily: Accessor<FontFamily>;
  setFontFamily: Setter<FontFamily>;
}

const FontFamilySelect = ({ fontFamily, setFontFamily }: Props) => {
  const handleChange = (e: Event) => {
    const value = (e.currentTarget as HTMLSelectElement).value as FontFamily;
    setFontFamily(value);

    // Refocus the editor after changing font
    const editor = document.getElementById("html-content-editor");
    if (editor) {
      editor.focus();
    }
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <select
        class={`py-1 bg-(--border) rounded ${ACTION_BUTTON_HOVER_CLASSES}`}
        value={fontFamily() || FontFamily.ARIAL}
        onChange={handleChange}
      >
        <option class="text-black bg-white rounded-t" value={FontFamily.ARIAL}>
          {FontFamily.ARIAL}
        </option>
        <option class="text-black bg-white" value={FontFamily.SERIF}>
          {FontFamily.SERIF}
        </option>
        <option
          class="text-black bg-white rounded-b"
          value={FontFamily.MONOSPACE}
        >
          {FontFamily.MONOSPACE}
        </option>
      </select>
    </div>
  );
};

export default FontFamilySelect;

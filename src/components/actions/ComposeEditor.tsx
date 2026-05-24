// components/actions/ComposeEditor.tsx
import {
    FaSolidBold,
    FaSolidItalic,
    FaSolidAlignLeft,
    FaSolidAlignCenter,
    FaSolidAlignRight,
    FaSolidAlignJustify,
    FaSolidUnderline,
} from 'solid-icons/fa';
import { createSignal } from 'solid-js';
import { RiSystemResetLeftFill } from 'solid-icons/ri';
import TextColorPicker from '../colorPicker/TextColorPicker';

const DefaultTextColor = '#000000';
const DefaultHighlightColor = 'transparent';

const ComposeEditor = () => {
    const [textColor, setTextColor] = createSignal(DefaultTextColor);
    const [highlightColor, setHighlightColor] = createSignal(DefaultHighlightColor);

    const actionButtonHoverClasses =
        'opacity-80 hover:opacity-100 hover:scale-125 transition-all  origin-left';
    const actionButtonClasses = `w-7 h-6 pl-1 flex items-center justify-start text-center rounded ${actionButtonHoverClasses}`;

    const buttonContainerClasses = 'flex flex-col gap-1';

    // Helper function to format text in the active contentEditable element
    const format = (command: string, value?: string) => {
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editor) {
            editor.focus();
            document.execCommand(command, false, value || '');
            // Trigger input event to update state
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const applyTextColor = (color: string) => {
        setTextColor(color);
        format('foreColor', color);
    };

    const resetTextColor = () => {
        setTextColor(DefaultTextColor);
        format('foreColor', DefaultTextColor);
    };

    const applyHighlightColor = (color: string) => {
        setHighlightColor(color);
        format('hiliteColor', color);
    };

    const resetHighlightColor = () => {
        setHighlightColor(DefaultHighlightColor);
        format('hiliteColor', DefaultHighlightColor);
    };

    // Handle font size
    const setFontSize = (size: string) => {
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (!editor) return;

        editor.focus();

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const selectedContent = range.extractContents();

        const span = document.createElement('span');
        switch (size) {
            case 'small':
                span.style.fontSize = '12px';
                break;
            case 'medium':
                span.style.fontSize = '16px';
                break;
            case 'large':
                span.style.fontSize = '24px';
                break;
        }

        span.appendChild(selectedContent);
        range.insertNode(span);

        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);

        editor.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // Handle font family
    const setFontFamily = (font: string) => {
        format('fontName', font);
    };

    return (
        <div class="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5">
            {/* Font Selection */}
            <select
                class={`py-1 text-sm bg-(--border) rounded ${actionButtonHoverClasses}`}
                onChange={(e) => setFontFamily(e.currentTarget.value)}
            >
                <option class="text-black bg-white rounded-t">Arial</option>
                <option class="text-black bg-white">Serif</option>
                <option class="text-black bg-white rounded-b">Mono</option>
            </select>

            <div class={buttonContainerClasses}>
                <div class="flex items-center gap-1">
                    <div class={actionButtonHoverClasses}>
                        <TextColorPicker
                            color={textColor()}
                            onChange={(color) => applyTextColor(color)}
                            offsetX={30}
                            offsetY={2}
                            shape="circle"
                        />
                    </div>

                    {textColor() !== DefaultTextColor && (
                        <button
                            onClick={resetTextColor}
                            class="rounded-full flex items-center justify-center hover:scale-110 opacity-80 hover:opacity-100 transition-all"
                        >
                            <RiSystemResetLeftFill size={18} />
                        </button>
                    )}
                </div>
                <div />

                <div class="flex items-center gap-1">
                    <div class={actionButtonHoverClasses}>
                        <TextColorPicker
                            color={highlightColor()}
                            onChange={(color) => applyHighlightColor(color)}
                            offsetX={30}
                            offsetY={2}
                            shape="square"
                        />
                    </div>

                    {highlightColor() !== DefaultHighlightColor && (
                        <button
                            onClick={resetHighlightColor}
                            class="rounded-full flex items-center justify-center hover:scale-110 opacity-80 hover:opacity-100 transition-all"
                        >
                            <RiSystemResetLeftFill size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Font Size */}
            <div class={buttonContainerClasses}>
                <button
                    class={`${actionButtonClasses} text-md`}
                    onClick={() => setFontSize('small')}
                >
                    S
                </button>
                <button
                    class={`${actionButtonClasses} text-lg`}
                    onClick={() => setFontSize('medium')}
                >
                    M
                </button>
                <button
                    class={`${actionButtonClasses} text-2xl`}
                    onClick={() => setFontSize('large')}
                >
                    L
                </button>
            </div>

            {/* Text Formatting */}
            <div class={buttonContainerClasses}>
                <button class={actionButtonClasses} onClick={() => format('bold')}>
                    <FaSolidBold size={16} />
                </button>
                <button class={actionButtonClasses} onClick={() => format('italic')}>
                    <FaSolidItalic size={16} />
                </button>
                <button class={actionButtonClasses} onClick={() => format('underline')}>
                    <FaSolidUnderline size={16} />
                </button>
            </div>

            {/* Alignment */}
            <div class={buttonContainerClasses}>
                <button class={actionButtonClasses} onClick={() => format('justifyLeft')}>
                    <FaSolidAlignLeft size={16} />
                </button>
                <button class={actionButtonClasses} onClick={() => format('justifyCenter')}>
                    <FaSolidAlignCenter size={16} />
                </button>
                <button class={actionButtonClasses} onClick={() => format('justifyRight')}>
                    <FaSolidAlignRight size={16} />
                </button>
                <button class={actionButtonClasses} onClick={() => format('justifyFull')}>
                    <FaSolidAlignJustify size={16} />
                </button>
            </div>
        </div>
    );
};

export default ComposeEditor;

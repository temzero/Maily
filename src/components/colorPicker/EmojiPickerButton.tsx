// components/colorPicker/EmojiPickerButton.tsx

import { Show, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { MdSharpEmoji_emotions } from 'solid-icons/md';
import { BsEmojiSmile } from 'solid-icons/bs';
import 'emoji-picker-element';

type EmojiPickerButtonProps = {
    shape?: 'circle' | 'square';
    size?: string;
    label?: string;
    offsetX?: number;
    offsetY?: number;
    defaultEmoji?: string;
};

export default function EmojiPickerButton(props: EmojiPickerButtonProps) {
    const [open, setOpen] = createSignal(false);
    const [pickerPosition, setPickerPosition] = createSignal({ top: 0, left: 0 });
    let swatchRef: HTMLDivElement | undefined;
    let savedSelection: { node: HTMLElement; range: Range } | null = null;

    const shapeClass = props.shape === 'circle' ? 'rounded-full' : 'rounded';
    const sizeClass = props.size ?? 'w-6 h-6';

    // Save both the range AND the element that was focused
    const saveSelection = () => {
        const active = document.activeElement as HTMLElement | null;
        const selection = window.getSelection();

        if (active && active.isContentEditable && selection && selection.rangeCount > 0) {
            savedSelection = {
                node: active,
                range: selection.getRangeAt(0).cloneRange(),
            };
        } else {
            savedSelection = null;
        }
    };

    // const insertEmojiAtCursor = (emoji: string) => {
    //     if (!savedSelection) return;

    //     const { node, range } = savedSelection;

    //     // Restore focus to the editor first
    //     node.focus();

    //     const selection = window.getSelection();
    //     if (selection) {
    //         selection.removeAllRanges();
    //         selection.addRange(range);
    //     }

    //     // Insert emoji text node
    //     range.deleteContents();
    //     const textNode = document.createTextNode(emoji);
    //     range.insertNode(textNode);

    //     // Advance cursor past the inserted emoji
    //     range.setStartAfter(textNode);
    //     range.collapse(true);
    //     if (selection) {
    //         selection.removeAllRanges();
    //         selection.addRange(range);
    //     }

    //     // Notify the editor of the change
    //     node.dispatchEvent(new Event('input', { bubbles: true }));

    //     savedSelection = null;
    // };
    const insertEmojiAtCursor = (emoji: string) => {
        if (!savedSelection) return;

        const { node, range } = savedSelection;

        node.focus();

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        range.deleteContents();
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.collapse(true);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        node.dispatchEvent(new Event('input', { bubbles: true }));

        // Update savedSelection to current cursor position instead of nulling it
        savedSelection = { node, range: range.cloneRange() };
    };
    
    const calculatePosition = () => {
        if (!swatchRef) return;
        const rect = swatchRef.getBoundingClientRect();
        setPickerPosition({
            top: rect.top + (props.offsetY ?? 0),
            left: rect.left + (props.offsetX ?? 0),
        });
    };

    const handleMouseDown = (e: MouseEvent) => {
        // Must preventDefault BEFORE saving selection, otherwise blur fires first
        e.preventDefault();
        saveSelection();
        calculatePosition();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        savedSelection = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
    };

    // Attach emoji-click via ref callback so it fires when the
    // custom element actually enters the DOM (Show renders it)
    const attachPickerRef = (el: HTMLElement) => {
        el.addEventListener('emoji-click', (event: any) => {
            insertEmojiAtCursor(event.detail.unicode);
            // setOpen(false);
        });
    };

    onCleanup(() => {
        document.removeEventListener('keydown', handleKeyDown);
    });

    // Manage keydown listener alongside open state
    const toggle = (isOpen: boolean) => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }
    };

    return (
        <div class="relative group">
            <div
                ref={swatchRef}
                class={`relative ${sizeClass} ${shapeClass} cursor-pointer transition-all flex items-center justify-center`}
                onMouseDown={handleMouseDown}
            >
                {open() ? <MdSharpEmoji_emotions size={28} class='text-yellow-500' /> : <BsEmojiSmile size={24} />}
            </div>

            <Show when={props.label}>
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] bg-black/70 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {props.label}
                </div>
            </Show>

            <Show when={open()}>
                {(_) => {
                    toggle(true);
                    onCleanup(() => toggle(false));
                    return (
                        <Portal>
                            <div
                                class="fixed inset-0 z-999998"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClose}
                            />
                            <div
                                class="fixed z-999999"
                                style={{
                                    top: `${pickerPosition().top}px`,
                                    left: `${pickerPosition().left}px`,
                                }}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {/* @ts-ignore - Custom element */}
                                <emoji-picker ref={attachPickerRef} style={{ '--border-radius': '4px' }}/>
                            </div>
                        </Portal>
                    );
                }}
            </Show>
        </div>
    );
}

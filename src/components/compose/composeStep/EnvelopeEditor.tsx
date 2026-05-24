// EnvelopeEditor.tsx
import { Accessor, For, Show } from 'solid-js';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlinePlusCircle } from 'solid-icons/ai';
import { HiOutlineTrash } from 'solid-icons/hi';
import { EnvelopeType, BorderStyle, HiddenBorderSide } from '~/types/envelop/envelop.type';
import { FontStyle } from '~/types/font.style';
import HiddenBorderPicker from './envelopeEditor/HiddenBorderPicker';
import ColorPickerButton from '~/components/colorPicker/ColorPickerButton';
import { getNewCustomEnvelope } from '~/data/envelop.mock';
import { MAX_ENVELOPES } from '~/store/envelope.store';
import toast from 'solid-toast';

type EnvelopeEditorProps = {
    envelope: EnvelopeType;
    currentViewIndex: number;
    setCurrentViewIndex: (index: number) => void;
    localEnvelopes: Accessor<EnvelopeType[]>;
    setLocalEnvelopes: (
        envelopes: EnvelopeType[] | ((prev: EnvelopeType[]) => EnvelopeType[])
    ) => void;
};

export default function EnvelopeEditor(props: EnvelopeEditorProps) {
    const currentId = () => props.envelope?.id;

    // All mutations go through local state only
    const update = (updates: Partial<EnvelopeType>) => {
        const id = currentId();
        if (!id) return;
        props.setLocalEnvelopes((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
    };

    const fontOptions = [FontStyle.ARIAL, FontStyle.SERIF, FontStyle.GEORGIA, FontStyle.MONOSPACE];
    const borderStyles = [
        BorderStyle.SOLID,
        BorderStyle.DASHED,
        BorderStyle.DOTTED,
        BorderStyle.DOUBLE,
        BorderStyle.STRIPED,
        BorderStyle.NONE,
    ];

    const currentBorderStyle = () => props.envelope?.borderStyle || BorderStyle.SOLID;

    const currentBorderColors = () => {
        const colors = props.envelope?.borderColors || [];
        const style = currentBorderStyle();
        if (style === BorderStyle.DOUBLE || style === BorderStyle.STRIPED) {
            return [colors[0], colors[1], colors[2]];
        }
        return colors;
    };

    const updateBorderColor = (index: number, color: string) => {
        const currentColors = props.envelope?.borderColors || [];
        const newColors = [...currentColors];
        while (newColors.length <= index) newColors.push(undefined as any);
        newColors[index] = color;
        update({ borderColors: newColors });
    };

    const handleBorderToggle = (side: HiddenBorderSide) => {
        const current = props.envelope?.hiddenBorders || [];
        const updated = current.includes(side)
            ? current.filter((s) => s !== side)
            : [...current, side];

        const allSides: HiddenBorderSide[] = ['top', 'right', 'bottom', 'left'];
        const allHidden = allSides.every((s) => updated.includes(s));

        update({
            hiddenBorders: updated,
            ...(allHidden ? { borderStyle: BorderStyle.NONE } : {}),
        });
    };

    const newEnvelope = () => {
        if (props.localEnvelopes().length >= MAX_ENVELOPES) {
            toast.error(`You cannot have more than ${MAX_ENVELOPES} envelopes`);
            return;
        }

        const insertIndex = props.currentViewIndex + 1;
        props.setLocalEnvelopes((prev) => [
            ...prev.slice(0, insertIndex),
            getNewCustomEnvelope(),
            ...prev.slice(insertIndex),
        ]);
        props.setCurrentViewIndex(insertIndex);
    };

    const moveEnvelopeToTheLeft = () => {
        const id = currentId();
        if (!id) return;
        const arr = [...props.localEnvelopes()];
        const idx = arr.findIndex((e) => e.id === id);
        const swapIdx = idx - 1;
        if (swapIdx < 0) return;
        [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
        props.setLocalEnvelopes(arr);
        props.setCurrentViewIndex(swapIdx);
    };

    const moveEnvelopeToTheRight = () => {
        const id = currentId();
        if (!id) return;
        const arr = [...props.localEnvelopes()];
        const idx = arr.findIndex((e) => e.id === id);
        const swapIdx = idx + 1;
        if (swapIdx >= arr.length) return;
        [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
        props.setLocalEnvelopes(arr);
        props.setCurrentViewIndex(swapIdx);
    };

    const deleteEnvelope = () => {
        const id = currentId();
        if (!id) return;
        const current = props.localEnvelopes();
        if (current.length <= 1) {
            console.warn('Cannot delete the last envelope');
            return;
        }
        const removedIndex = current.findIndex((e) => e.id === id);
        const previousIndex = Math.max(0, removedIndex - 1);
        props.setLocalEnvelopes((prev) => prev.filter((e) => e.id !== id));
        props.setCurrentViewIndex(previousIndex);
    };

    return (
        <div class="flex items-center gap-2 rounded-t-2xl p-2 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur text-white z-50">
            <button onClick={newEnvelope} class="opacity-70 hover:opacity-100">
                <AiOutlinePlusCircle size={28} />
            </button>

            <button onClick={moveEnvelopeToTheLeft} class="opacity-70 hover:opacity-100">
                <AiOutlineArrowLeft size={28} />
            </button>

            <div class="flex items-center gap-2 justify-center mx-1 w-100">
                {/* Text Color + Font */}
                <div class="flex gap-1.5 items-center">
                    <h1
                        style={{
                            'font-family': props.envelope?.fontStyle ?? FontStyle.ARIAL,
                        }}
                        class="text-2xl leading-none"
                    >
                        T
                    </h1>
                    <ColorPickerButton
                        color={props.envelope?.textColor}
                        onChange={(hex) => update({ textColor: hex })}
                        shape="circle"
                        offsetY={-245}
                    />
                    <select
                        class="bg-black/50 rounded py-1 text-sm"
                        onChange={(e) => update({ fontStyle: e.currentTarget.value as FontStyle })}
                        value={props.envelope?.fontStyle || 'Arial'}
                    >
                        <For each={fontOptions}>
                            {(font) => <option value={font}>{font}</option>}
                        </For>
                    </select>
                </div>

                <div id="divider" class="w-px h-6 bg-white/20 mx-1" />

                {/* Background Color */}
                <ColorPickerButton
                    color={props.envelope?.backgroundColor}
                    onChange={(hex) => update({ backgroundColor: hex })}
                    shape="square"
                    offsetY={-245}
                />

                <div id="divider" class="w-px h-6 bg-white/20 mx-1" />

                {/* Border Style */}
                <select
                    class="bg-black/50 rounded py-1 text-sm"
                    onChange={(e) => {
                        const newStyle = e.currentTarget.value as BorderStyle;
                        update({
                            borderStyle: newStyle,
                            ...(newStyle !== BorderStyle.NONE ? { hiddenBorders: [] } : {}),
                        });
                    }}
                    value={currentBorderStyle()}
                >
                    <For each={borderStyles}>
                        {(style) => <option value={style}>{style}</option>}
                    </For>
                </select>

                <Show
                    when={
                        currentBorderStyle() !== BorderStyle.NONE &&
                        currentBorderStyle() !== BorderStyle.STRIPED
                    }
                >
                    <HiddenBorderPicker
                        hiddenBorders={props.envelope?.hiddenBorders}
                        onToggle={handleBorderToggle}
                    />
                </Show>

                <Show when={currentBorderStyle() !== BorderStyle.NONE}>
                    <Show
                        when={
                            currentBorderStyle() === BorderStyle.DOUBLE ||
                            currentBorderStyle() === BorderStyle.STRIPED
                        }
                        fallback={
                            <ColorPickerButton
                                color={currentBorderColors()[0]}
                                onChange={(hex) => updateBorderColor(0, hex)}
                                shape="square"
                                size="w-5 h-6"
                                offsetY={-245}
                            />
                        }
                    >
                        <div class="flex gap-1">
                            <For each={[0, 1, 2]}>
                                {(index) => (
                                    <ColorPickerButton
                                        color={currentBorderColors()[index]}
                                        onChange={(hex) => updateBorderColor(index, hex)}
                                        shape="square"
                                        size="w-5 h-6"
                                        label={String(index + 1)}
                                        offsetY={-245}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </Show>
            </div>

            <button onClick={moveEnvelopeToTheRight} class="opacity-70 hover:opacity-100">
                <AiOutlineArrowRight size={28} />
            </button>

            <button onClick={deleteEnvelope} class="opacity-70 hover:opacity-100">
                <HiOutlineTrash size={28} />
            </button>
        </div>
    );
}

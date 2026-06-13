// MobileEnvelopeEditor.tsx
import { createSignal, Accessor, For, Show } from 'solid-js';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlinePlusCircle } from 'solid-icons/ai';
import { HiOutlineTrash } from 'solid-icons/hi';
import { EnvelopeType, BorderStyle, HiddenBorderSide } from '~/types/envelop/envelop.type';
import { FontFamily } from "~/types/font-family.enums";
import { getNewCustomEnvelope } from '~/data/envelop.mock';
import { MAX_ENVELOPES } from '~/stores/envelope.store';
import ColorPickerButton from '~/components/colorPicker/ColorPickerButton';
import HiddenBorderPicker from './envelopeEditor/HiddenBorderPicker';
import toast from 'solid-toast';
import { TbOutlineBackground } from 'solid-icons/tb'

type EnvelopeEditorProps = {
    envelope: EnvelopeType;
    currentViewIndex: number;
    setCurrentViewIndex: (index: number) => void;
    localEnvelopes: Accessor<EnvelopeType[]>;
    setLocalEnvelopes: (
        envelopes: EnvelopeType[] | ((prev: EnvelopeType[]) => EnvelopeType[])
    ) => void;
};

const enum SettingModes {
    TEXT,
    BACKGROUND,
    BORDERS
}

export default function MobileEnvelopeEditor(props: EnvelopeEditorProps) {
    const [settingMode, setSettingMode] = createSignal<SettingModes | null>(null)

    const currentId = () => props.envelope?.id;

    // All mutations go through local state only
    const update = (updates: Partial<EnvelopeType>) => {
        const id = currentId();
        if (!id) return;
        props.setLocalEnvelopes((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
    };

    const fontOptions = [FontFamily.ARIAL, FontFamily.SERIF, FontFamily.GEORGIA, FontFamily.MONOSPACE];
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
    <div class="w-full flex flex-col rounded-t-xl fixed bottom-0 bg-white/20 text-white z-50 overflow-hidden">
        {/* Mode Selection Buttons */}
                {/* Conditional Editor Panels */}
         <Show when={settingMode() !== null}>
            <div class="p-2 border border-(--primary)! rounded-xl -mb-2">
                <Show when={settingMode() === SettingModes.TEXT}>
                    <div class="flex gap-2 items-center justify-around">
                        <ColorPickerButton
                            color={props.envelope?.textColor}
                            onChange={(hex) => update({ textColor: hex })}
                            shape="circle"
                            offsetY={-245}
                        />
                        <select
                            class="bg-black/50 rounded py-1 text-sm"
                            onChange={(e) => update({ fontStyle: e.currentTarget.value as FontFamily })}
                            value={props.envelope?.fontStyle || 'Arial'}
                        >
                            <For each={fontOptions}>
                                {(font) => <option value={font}>{font}</option>}
                            </For>
                        </select>
                    </div>
                </Show>

                <Show when={settingMode() === SettingModes.BACKGROUND}>
                    <div class="flex gap-2 items-center">
                        <ColorPickerButton
                            color={props.envelope?.backgroundColor}
                            onChange={(hex) => update({ backgroundColor: hex })}
                            shape="square"
                            offsetY={-245}
                        />
                    </div>
                </Show>

                <Show when={settingMode() === SettingModes.BORDERS}>
                    <div class="flex items-center justify-around gap-2">
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
                </Show>
            </div>
        </Show>

        <div class="w-full flex items-center gap-1 justify-around p-2">
            <button onClick={() => setSettingMode(settingMode() === SettingModes.TEXT ? null : SettingModes.TEXT)} class={`w-8 h-8 flex items-center justify-center rounded-b ${settingMode() === SettingModes.TEXT ? "bg-(--primary)! text-white!" : ""}`}>
                <h1 class='text-2xl'>T</h1>
            </button>

            <button onClick={() => setSettingMode(settingMode() === SettingModes.BACKGROUND ? null : SettingModes.BACKGROUND)} class={`w-8 h-8 flex items-center justify-center rounded-b ${settingMode() === SettingModes.BACKGROUND ? "bg-(--primary)! text-white!" : ""}`}>
                <TbOutlineBackground size={24} />
            </button>
            
            <button onClick={() => setSettingMode(settingMode() === SettingModes.BORDERS ? null : SettingModes.BORDERS)} class={`w-8 h-8 flex items-center justify-center P-1 rounded-b ${settingMode() === SettingModes.BORDERS ? "bg-(--primary)! text-white!" : ""}`}>
                <div class={`h-5 w-5 border-2 ${settingMode() === SettingModes.BORDERS ? 'border-white' : ''}`}/>
            </button>
        </div>

        {/* Navigation Buttons */}
        <div class='w-full flex items-center justify-around p-2 border-t border-(--border)'>
            <button onClick={newEnvelope} class="opacity-70 hover:opacity-100">
                <AiOutlinePlusCircle size={28} />
            </button>

            <button onClick={moveEnvelopeToTheLeft} class="opacity-70 hover:opacity-100">
                <AiOutlineArrowLeft size={28} />
            </button>

            <button onClick={moveEnvelopeToTheRight} class="opacity-70 hover:opacity-100">
                <AiOutlineArrowRight size={28} />
            </button>

            <button onClick={deleteEnvelope} class="opacity-70 hover:opacity-100">
                <HiOutlineTrash size={28} />
            </button>
        </div>
    </div>
);
}
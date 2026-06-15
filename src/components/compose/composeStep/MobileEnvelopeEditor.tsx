// MobileEnvelopeEditor.tsx
import { createSignal, Accessor, For, Show } from 'solid-js';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlinePlusCircle } from 'solid-icons/ai';
import { HiOutlineTrash } from 'solid-icons/hi';
import { TbOutlineBackground } from 'solid-icons/tb'
import { FontFamily } from "~/types/font-family.enums";
import { getNewCustomEnvelope } from '~/data/envelop.mock';
import { MAX_ENVELOPES } from '~/stores/envelope.store';
import { EnvelopeType, BorderStyle, HiddenBorderSide } from '~/types/envelop/envelop.type';
import HiddenBorderPicker from './envelopeEditor/HiddenBorderPicker';
import ColorPickerList from '~/components/colorPicker/ColorPickerList';
import FontPickerList from '~/components/picker/FontPickerList';
import BorderStylePicker from '~/components/picker/BorderStylePicker';
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

const enum SettingModes {
    TEXT,
    BACKGROUND,
    BORDERS
}

export default function MobileEnvelopeEditor(props: EnvelopeEditorProps) {
    const [settingMode, setSettingMode] = createSignal<SettingModes | null>(null)
    const currentId = () => props.envelope?.id;
    let actionButtonsRef: HTMLDivElement | undefined;

    // All mutations go through local state only
    const update = (updates: Partial<EnvelopeType>) => {
        const id = currentId();
        if (!id) return;
        props.setLocalEnvelopes((prev) =>
            prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
        );
    };

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
         <Show when={settingMode() !== null}>
            <div class="border-3 border-(--border)! bg-black/60 backdrop-blur rounded-t-xl">
                <Show when={settingMode() === SettingModes.TEXT}>
                    <div>
                        <ColorPickerList
                            selectedColor={props.envelope?.textColor}
                            onChange={(hex) => update({ textColor: hex })}
                            isRounded={true}
                        />      
                        <FontPickerList
                            selectedFont={props.envelope?.fontStyle}
                            onChange={(font) => update({ fontStyle: font as FontFamily })}
                            isFullWidth
                            class='border-t border-(--border)'
                        />
                    </div>
                </Show>

                <Show when={settingMode() === SettingModes.BACKGROUND}>
                    <ColorPickerList
                        selectedColor={props.envelope?.backgroundColor}
                        onChange={(hex) => update({ backgroundColor: hex })}
                    />
                </Show>

                <Show when={settingMode() === SettingModes.BORDERS}>
                    <div>
                        <Show when={currentBorderStyle() !== BorderStyle.NONE}>
                            <Show
                                when={
                                    currentBorderStyle() === BorderStyle.DOUBLE ||
                                    currentBorderStyle() === BorderStyle.STRIPED
                                }
                                fallback={
                                    <ColorPickerList
                                        selectedColor={currentBorderColors()[0]}
                                        onChange={(hex) => updateBorderColor(0, hex)}
                                        isRounded={false}
                                        hasTransparent={true}
                                        class='border-b border-(--border)'
                                    />
                                }
                            >
                                <div class="flex flex-col gap-2">
                                    <For each={[0, 1, 2]}>
                                        {(index) => (
                                            <div class="flex items-center justify-center">
                                                <span class="text-lg px-2">{index + 1}</span>
                                                <ColorPickerList
                                                    selectedColor={currentBorderColors()[index]}
                                                    onChange={(hex) => updateBorderColor(index, hex)}
                                                    isRounded={false}
                                                    hasTransparent={true}
                                                    class='border-b border-(--border)'
                                                />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </Show>

                        <Show
                            when={
                                currentBorderStyle() !== BorderStyle.NONE &&
                                currentBorderStyle() !== BorderStyle.STRIPED
                            }
                        >
                            <HiddenBorderPicker
                                hiddenBorders={props.envelope?.hiddenBorders}
                                onToggle={handleBorderToggle}
                                isSeperate={true}
                                isFullWidth={true}
                                class='custom-border'
                            />
                        </Show>

                        <BorderStylePicker
                            selectedStyle={currentBorderStyle()}
                            onChange={(newStyle) => {
                                update({
                                    borderStyle: newStyle,
                                    ...(newStyle !== BorderStyle.NONE ? { hiddenBorders: [] } : {}),
                                });
                            }}
                            class='border-t border-(--border)'
                        />

                    </div>
                </Show>
            </div>
        </Show>

        <div class="w-full flex items-center gap-1 justify-around transition-all">
            <button onClick={() => setSettingMode(settingMode() === SettingModes.TEXT ? null : SettingModes.TEXT)} class={`w-full h-12 flex items-center justify-center rounded ${settingMode() === SettingModes.TEXT ? "bg-(--primary)! text-white!" : ""}`}>
                <h1 class='text-2xl'>T</h1>
            </button>

            <button onClick={() => setSettingMode(settingMode() === SettingModes.BACKGROUND ? null : SettingModes.BACKGROUND)} class={`w-full h-12 flex items-center justify-center rounded ${settingMode() === SettingModes.BACKGROUND ? "bg-(--primary)! text-white!" : ""}`}>
                <TbOutlineBackground size={24} />
            </button>
            
            <button onClick={() => setSettingMode(settingMode() === SettingModes.BORDERS ? null : SettingModes.BORDERS)} class={`w-full h-12 flex items-center justify-center P-1 rounded ${settingMode() === SettingModes.BORDERS ? "bg-(--primary)! text-white!" : ""}`}>
                <div class={`h-5 w-5 border-2 ${settingMode() === SettingModes.BORDERS ? 'border-white' : ''}`}/>
            </button>
        </div>

        {/* Action Buttons */}
        <div 
            ref={actionButtonsRef} 
            class='w-full flex items-center justify-between py-2 px-4 border-t border-(--border)'
            style={{
                'margin-bottom': settingMode() !== null ? `-${actionButtonsRef?.offsetHeight || 0}px` : '0px',
                'transition': 'margin-bottom 0.3s ease-in-out'
            }}
        >
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
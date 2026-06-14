// components/FontPickerList.tsx
import { For } from 'solid-js';
import { FontFamily } from '~/types/font-family.enums';

type FontPickerListProps = {
    selectedFont?: string;
    onChange: (font: string) => void;
    isFullWidth?: boolean;
    class?: string;
};

const FONT_OPTIONS = [
    { value: FontFamily.ARIAL, label: 'Arial', style: 'font-sans' },
    { value: FontFamily.SERIF, label: 'Serif', style: 'font-serif' },
    { value: FontFamily.GEORGIA, label: 'Georgia', style: 'font-georgia' },
    { value: FontFamily.MONOSPACE, label: 'Monospace', style: 'font-mono' },
];

export default function FontPickerList(props: FontPickerListProps) {
    return (
        <div class={`flex items-center! ${props.class} ${props.isFullWidth ? 'w-full' : ''}`}>
            <For each={FONT_OPTIONS}>
                {(font) => (
                    <div
                        class={`text-center p-2 transition-all border-r border-(--border) ${font.style} ${props.isFullWidth && 'w-full'}`}
                        classList={{
                            'bg-(--primary)! text-white': props.selectedFont === font.value,
                            'text-white/80': props.selectedFont !== font.value
                        }}
                        onClick={() => props.onChange(font.value)}
                    >
                        {font.label}
                    </div>
                )}
            </For>
        </div>
    );
}
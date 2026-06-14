// components/BorderStylePicker.tsx
import { For } from 'solid-js';
import { BorderStyle } from '~/types/envelop/envelop.type';
import { BsThreeDots } from 'solid-icons/bs'
import { CgBorderStyleDashed } from 'solid-icons/cg'
import { VsCircleSlash } from 'solid-icons/vs'
import { BsDashLg } from 'solid-icons/bs'
import { TbOutlineEqual } from 'solid-icons/tb'

type BorderStylePickerProps = {
    selectedStyle?: BorderStyle;
    onChange: (style: BorderStyle) => void;
    class?: string;
};

const BORDER_STYLE_OPTIONS = [
    { value: BorderStyle.NONE, label: 'None', icon: VsCircleSlash },
    { value: BorderStyle.SOLID, label: 'Solid', icon: BsDashLg },
    { value: BorderStyle.DASHED, label: 'Dashed', icon: CgBorderStyleDashed },
    { value: BorderStyle.DOTTED, label: 'Dotted', icon: BsThreeDots },
    { value: BorderStyle.DOUBLE, label: 'Double', icon: TbOutlineEqual },
    { value: BorderStyle.STRIPED, label: 'Striped', icon: null }, // Custom implementation
];

export default function BorderStylePicker(props: BorderStylePickerProps) {
    return (
        <div class={`flex items-center! justify-around ${props.class}`}>
            <For each={BORDER_STYLE_OPTIONS}>
                {(style) => {
                    const Icon = style.icon;
                    return (
                        <div
                            class={`transition-all cursor-pointer flex items-center justify-center w-full h-10 border-r border-(--border)`}
                            classList={{
                                'bg-(--primary) text-white': props.selectedStyle === style.value,
                                // 'bg-(--border) text-white/80': props.selectedStyle !== style.value,
                                'text-red-500!': style.value === BorderStyle.NONE,
                            }}
                            onClick={() => props.onChange(style.value)}
                            title={style.label}
                        >
                            {Icon ? (
                                <Icon class="w-8 h-8" />
                            ) : (
                                <div>///</div>
                            )}
                        </div>
                    );
                }}
            </For>
        </div>
    );
}
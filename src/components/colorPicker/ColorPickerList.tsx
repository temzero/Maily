// components/ColorPickerList.tsx
import { For, onMount, createEffect, on } from 'solid-js';

type ColorPickerListProps = {
    selectedColor?: string;
    onChange: (color: string) => void;
    isRounded?: boolean;
    hasTransparent?: boolean;
    class?: string
};

const PRESET_COLORS = [
    // Neutrals
    '#FFFFFF', '#F5F5F5', '#E0E0E0', '#CCCCCC', '#999999', '#666666', '#333333', '#000000',
    // Reds/Pinks
    '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828',
    '#F8BBD0', '#F48FB1', '#F06292', '#EC407A', '#E91E63', '#D81B60', '#C2185B', '#AD1457',
    // Purples
    '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A',
    // Blues
    '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0',
    '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#01579B',
    // Teals/Cyans
    '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F',
    // Greens
    '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32',
    // Yellows/Oranges
    '#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825',
    '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00',
];

// Create colors array with optional transparent at the beginning
const getDisplayColors = (hasTransparent: boolean): string[] => {
    if (hasTransparent) {
        return ['transparent', ...PRESET_COLORS];
    }
    return PRESET_COLORS;
};

export default function ColorPickerList(props: ColorPickerListProps) {
    let containerRef: HTMLDivElement | undefined;
    
    const displayColors = () => getDisplayColors(props.hasTransparent || false);
    
    // Determine the active color - if no selectedColor and hasTransparent is true, use 'transparent'
    const activeColor = () => {
        if (props.selectedColor) return props.selectedColor;
        if (props.hasTransparent) return 'transparent';
        return undefined;
    };
    
    // Function to scroll to active color
    const scrollToActiveColor = () => {
        if (!containerRef) return;
        
        const activeButton = containerRef.querySelector('[data-active="true"]');
        if (activeButton) {
            activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };
    
    // Scroll on mount
    onMount(() => {
        scrollToActiveColor();
    });
    
    // Scroll when selectedColor changes
    createEffect(
        on(activeColor, () => {
            scrollToActiveColor();
        })
    );
    
    return (
        <div 
            ref={containerRef}
            class={`flex gap-2 overflow-x-auto p-2 ${props.class}`}
        >
          <For each={displayColors()}>
            {(color) => (
                <div class="relative flex items-center justify-center">
                    <button
                        data-active={activeColor() === color}
                        class={`w-8 h-8 border-2 border-(--border) flex-shrink-0 transition-all relative overflow-hidden ${props.isRounded ? 'rounded-full' : 'rounded-md'}`}
                        style={{ 
                            'background-color': color === 'transparent' 
                                ? ''
                                : color,
                            'transform': activeColor() === color ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onClick={() => props.onChange(color)}
                        title={color === 'transparent' ? 'Transparent' : color}
                    >
                        {color === 'transparent' && (
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                            </div>
                        )}
                    </button>
                    {activeColor() === color && (
                        <div class={`absolute inset-0 -m-0.5 ${props.isRounded ? 'rounded-full' : 'rounded-lg'} ring-4 ring-(--primary) pointer-events-none`} />
                    )}
                </div>
            )}
            </For>
        </div>
    );
}
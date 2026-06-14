import { HiddenBorderSide } from '~/types/envelop/envelop.type';

type HiddenBorderPickerProps = {
    hiddenBorders?: HiddenBorderSide[];
    onToggle: (side: HiddenBorderSide) => void;
    isSeperate?: boolean
    isFullWidth?: boolean;
    class?: string;
};

export default function HiddenBorderPicker(props: HiddenBorderPickerProps) {
    const sizeClass = `relative h-10! ${props.isFullWidth ? 'w-full' : 'w-10 rounded'}`

    if (props.isSeperate) return (
       <div class={`flex ${props.class} ${props.isFullWidth ? '' : 'gap-2'}`}>
            {/* Left Button */}
            <div 
                class={`${sizeClass} border-(--border) ${props.isFullWidth ? 'border p-1' : 'border-2 p-0.5'} ${props.hiddenBorders?.includes('left') ? '' : 'bg-(--primary)'}`}
                onClick={() => props.onToggle('left')}
            >
                <div class="w-1 h-full bg-white border"/>
            </div>
            {/* Top Button */}
            <div 
                class={`${sizeClass} border-(--border) ${props.isFullWidth ? 'border p-1' : 'border-2 p-0.5'} ${props.hiddenBorders?.includes('top') ? '' : 'bg-(--primary)'}`}
                onClick={() => props.onToggle('top')}
            >
                <div class="w-full h-1 bg-white border"/>
            </div>
            {/* Bottom Button */}
            <div 
                class={`${sizeClass} border-(--border) flex items-end ${props.isFullWidth ? 'border p-1' : 'border-2 p-0.5'} ${props.hiddenBorders?.includes('bottom') ? '' : 'bg-(--primary)'}`}
                onClick={() => props.onToggle('bottom')}
            >
                <div class="w-full h-1 bg-white border"/>
            </div>
            {/* Right Button */}
            <div 
                class={`${sizeClass} border-(--border) flex justify-end ${props.isFullWidth ? 'border p-1' : 'border-2 p-0.5'} ${props.hiddenBorders?.includes('right') ? '' : 'bg-(--primary)'}`}
                onClick={() => props.onToggle('right')}
            >
                <div class="w-1 h-full bg-white border"/>
            </div>
        </div>
    )

    return (
        <div class={`${sizeClass} ${props.class}`}>
            <button
                class={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 hover:opacity-80 ${
                    props.hiddenBorders?.includes('top') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('top')}
            />
            <button
                class={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 hover:opacity-80 ${
                    props.hiddenBorders?.includes('right') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('right')}
            />
            <button
                class={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 hover:opacity-80 ${
                    props.hiddenBorders?.includes('bottom') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('bottom')}
            />
            <button
                class={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 hover:opacity-80 ${
                    props.hiddenBorders?.includes('left') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('left')}
            />
        </div>
    );
}

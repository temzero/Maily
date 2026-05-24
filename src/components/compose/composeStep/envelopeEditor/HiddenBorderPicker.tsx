import { HiddenBorderSide } from '~/types/envelop/envelop.type';

type HiddenBorderPickerProps = {
    hiddenBorders?: HiddenBorderSide[];
    onToggle: (side: HiddenBorderSide) => void;
};

export default function HiddenBorderPicker(props: HiddenBorderPickerProps) {
    return (
        <div class="relative w-6 h-6">
            <button
                class={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1.5 hover:opacity-80 ${
                    props.hiddenBorders?.includes('top') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('top')}
            />
            <button
                class={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 hover:opacity-80 ${
                    props.hiddenBorders?.includes('right') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('right')}
            />
            <button
                class={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1.5 hover:opacity-80 ${
                    props.hiddenBorders?.includes('bottom') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('bottom')}
            />
            <button
                class={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 hover:opacity-80 ${
                    props.hiddenBorders?.includes('left') ? 'bg-white/25' : 'bg-white'
                }`}
                onClick={() => props.onToggle('left')}
            />
        </div>
    );
}

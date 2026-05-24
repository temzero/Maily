// components/LabelIcon.tsx
import { createMemo, JSX } from 'solid-js';
import { getIcon } from '~/utils/icon-registry';
import { isLabelActive, labelStore } from '~/store/label.store';

interface LabelIconProps {
    labelId: number;
    iconId: string;
    size?: number;
    color?: string;
}

export const LabelIcon = (props: LabelIconProps): JSX.Element => {
    const size = props.size || 20;

    const iconData = createMemo(() => {
        const isActive = isLabelActive(props.labelId);
        const variant = isActive() ? 'solid' : 'outline';
        const color = isActive() ? props.color : undefined; // Use color only for active state
        return {
            variant,
            IconComponent: getIcon(props.iconId, variant, size, color) as JSX.Element,
        };
    });


    // Use a key to force re-rendering when variant changes
    return <div data-key={iconData().variant}>{iconData().IconComponent}</div>;
};

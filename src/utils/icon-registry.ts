// ~/utils/icon-registry.ts
import { JSX } from 'solid-js';
import { AiOutlineStar, AiFillStar, AiFillHeart, AiOutlineHeart } from 'solid-icons/ai';
import { FaSolidBriefcase, FaSolidGlobe } from 'solid-icons/fa';
import { BsCreditCard, BsCreditCardFill } from 'solid-icons/bs';
import { VsBriefcase, VsGlobe, VsKey } from 'solid-icons/vs';
import { ImKey } from 'solid-icons/im';
import { TbFillLabelImportant, TbOutlineLabelImportant } from 'solid-icons/tb';
import { Label, toggleLabel } from '~/store/label.store';

export interface IconSet {
    outline: (props: any) => JSX.Element;
    solid: (props: any) => JSX.Element;
}

export const iconRegistry: Record<string, IconSet> = {
    star: {
        outline: AiOutlineStar,
        solid: AiFillStar,
    },
    important: {
        outline: TbOutlineLabelImportant,
        solid: TbFillLabelImportant,
    },
    heart: {
        outline: AiOutlineHeart,
        solid: AiFillHeart,
    },
    briefcase: {
        outline: VsBriefcase,
        solid: FaSolidBriefcase,
    },
    globe: {
        outline: VsGlobe,
        solid: FaSolidGlobe,
    },
    creditCard: {
        outline: BsCreditCard,
        solid: BsCreditCardFill,
    },
    key: {
        outline: VsKey,
        solid: ImKey,
    },
};

export function getIcon(
    iconId: string,
    variant: 'outline' | 'solid' = 'outline',
    size: number = 24,
    color?: string
): JSX.Element | null {
    const iconSet = iconRegistry[iconId];
    if (!iconSet) {
        console.warn(`Icon "${iconId}" not found in registry`);
        return null;
    }

    const IconComponent = variant === 'outline' ? iconSet.outline : iconSet.solid;
    return IconComponent({ size, color });
}

// Helper to generate labels with auto-incrementing id and order
export const createInitialLabels = (
    labelsData: Omit<Label, 'id' | 'order' | 'createdAt'>[]
): Label[] => {
    return labelsData.map((labelData, index) => ({
        ...labelData,
        id: index + 1,
        order: index + 1,
        onClick: () => {
            toggleLabel(index + 1, true);
        },
        createdAt: new Date(),
    }));
};

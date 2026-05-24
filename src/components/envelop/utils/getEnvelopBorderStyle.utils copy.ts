// components/envelope/styles/getEnvelopeBorder.ts
import { BorderStyle } from '~/types/envelop/envelop.type';

export interface BorderStyleProps {
    borderWidth?: number;
    borderColors?: string[];
    hiddenBorders?: ('top' | 'right' | 'bottom' | 'left')[];
    isUnsealed?: boolean;
}

const DEFAULT_BORDER_WIDTH = 8;
const DEFAULT_STRIPE_SIZE = 8;
const DEFAULT_BORDER_COLORS = ['transparent', 'transparent', 'transparent'];
const DEFAULT_STRIPE_COLORS = ['transparent', 'transparent', 'transparent'];

// =======================
// Helpers
// =======================
const getColor = (colors: string[] | undefined, index: number, fallback: string[]) => {
    if (!colors) return fallback[index];
    return colors[index] || colors[colors.length - 1] || fallback[index];
};

const getVisibleSides = (hidden?: BorderStyleProps['hiddenBorders'], isUnsealed?: boolean) => ({
    top: !hidden?.includes('top') && !isUnsealed,
    right: !hidden?.includes('right'),
    bottom: !hidden?.includes('bottom'),
    left: !hidden?.includes('left'),
});

// =======================
// SOLID
// =======================
export const getSolidBorderStyle = ({
    borderWidth = DEFAULT_BORDER_WIDTH,
    borderColors,
    hiddenBorders,
    isUnsealed = false,
}: BorderStyleProps) => {
    const color = borderColors?.[0] || DEFAULT_BORDER_COLORS[0];
    const s = getVisibleSides(hiddenBorders, isUnsealed);

    const shadows = [
        s.top && `inset 0 ${borderWidth}px 0 0 ${color}`,
        s.right && `inset -${borderWidth}px 0 0 0 ${color}`,
        s.bottom && `inset 0 -${borderWidth}px 0 0 ${color}`,
        s.left && `inset ${borderWidth}px 0 0 0 ${color}`,
    ].filter(Boolean);

    return { 'box-shadow': shadows.join(',') };
};

// =======================
// DASHED
// =======================
export const getDashedBorderStyle = ({
    borderWidth = DEFAULT_BORDER_WIDTH,
    borderColors,
    hiddenBorders,
    isUnsealed = false,
}: BorderStyleProps) => {
    const color = borderColors?.[0] || DEFAULT_BORDER_COLORS[0];
    const dash = 6;
    const s = getVisibleSides(hiddenBorders, isUnsealed);

    return {
        padding: `${borderWidth}px`,
        background: [
            s.top &&
                `repeating-linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px ${
                    dash * 2
                }px) top / 100% ${borderWidth}px no-repeat`,
            s.bottom &&
                `repeating-linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px ${
                    dash * 2
                }px) bottom / 100% ${borderWidth}px no-repeat`,
            s.left &&
                `repeating-linear-gradient(0deg, ${color} 0 ${dash}px, transparent ${dash}px ${
                    dash * 2
                }px) left / ${borderWidth}px 100% no-repeat`,
            s.right &&
                `repeating-linear-gradient(0deg, ${color} 0 ${dash}px, transparent ${dash}px ${
                    dash * 2
                }px) right / ${borderWidth}px 100% no-repeat`,
        ]
            .filter(Boolean)
            .join(','),
    };
};

// =======================
// DOTTED
// =======================
export const getDottedBorderStyle = ({
    borderWidth = DEFAULT_BORDER_WIDTH,
    borderColors,
    hiddenBorders,
    isUnsealed = false,
}: BorderStyleProps) => {
    const color = borderColors?.[0] || DEFAULT_BORDER_COLORS[0];
    const size = 4;
    const s = getVisibleSides(hiddenBorders, isUnsealed);

    return {
        padding: `${borderWidth}px`,
        background: [
            s.top &&
                `radial-gradient(circle, ${color} 60%, transparent 61%) top / ${size}px ${size}px repeat-x`,
            s.bottom &&
                `radial-gradient(circle, ${color} 60%, transparent 61%) bottom / ${size}px ${size}px repeat-x`,
            s.left &&
                `radial-gradient(circle, ${color} 60%, transparent 61%) left / ${size}px ${size}px repeat-y`,
            s.right &&
                `radial-gradient(circle, ${color} 60%, transparent 61%) right / ${size}px ${size}px repeat-y`,
        ]
            .filter(Boolean)
            .join(','),
    };
};

// =======================
// DOUBLE
// =======================
export const getDoubleBorderStyle = ({
    borderWidth = DEFAULT_BORDER_WIDTH,
    borderColors,
    hiddenBorders,
    isUnsealed = false,
}: BorderStyleProps) => {
    const each = borderWidth / 3;

    const c1 = getColor(borderColors, 0, DEFAULT_BORDER_COLORS);
    const c2 = getColor(borderColors, 1, DEFAULT_BORDER_COLORS);
    const c3 = getColor(borderColors, 2, DEFAULT_BORDER_COLORS);

    const s = getVisibleSides(hiddenBorders, isUnsealed);

    const buildLayer = (w: number, color: string) => [
        s.top && `inset 0 ${w}px 0 0 ${color}`,
        s.right && `inset -${w}px 0 0 0 ${color}`,
        s.bottom && `inset 0 -${w}px 0 0 ${color}`,
        s.left && `inset ${w}px 0 0 0 ${color}`,
    ];

    return {
        'box-shadow': [
            ...buildLayer(each, c1),
            ...buildLayer(each * 2, c2),
            ...buildLayer(borderWidth, c3),
        ]
            .filter(Boolean)
            .join(','),
    };
};

// =======================
// STRIPES (NO border-image)
// =======================
export const getStripesBorderStyle = ({
    borderWidth = DEFAULT_BORDER_WIDTH,
    borderColors,
    isUnsealed = false,
}: BorderStyleProps) => {
    const s = borderWidth || DEFAULT_STRIPE_SIZE;
    const c1 = borderColors?.[0] || DEFAULT_STRIPE_COLORS[0];
    const c2 = borderColors?.[1] || DEFAULT_STRIPE_COLORS[1];
    const c3 = borderColors?.[2] || DEFAULT_STRIPE_COLORS[2];

    const stripePattern = `repeating-linear-gradient(
        135deg,
        ${c1},
        ${c1} ${s}px,
        ${c2} ${s}px,
        ${c2} ${s * 2}px,
        ${c3} ${s * 2}px,
        ${c3} ${s * 3}px,
        ${c2} ${s * 3}px,
        ${c2} ${s * 4}px
    )`;

    if (isUnsealed) {
        return {
            'border-top': 'none',
            'border-right': `${borderWidth}px solid transparent`,
            'border-bottom': `${borderWidth}px solid transparent`,
            'border-left': `${borderWidth}px solid transparent`,
            'border-image': `${stripePattern} ${borderWidth} stretch`,
        };
    }

    return {
        border: `${borderWidth}px solid transparent`,
        'border-image': `${stripePattern} ${borderWidth} stretch`,
    };
};
// =======================
// MAIN SWITCH
// =======================
export interface GetEnvelopeBorderProps {
    borderType?: BorderStyle;
    borderWidth?: number;
    borderColors?: string[];
    hiddenBorders?: ('top' | 'right' | 'bottom' | 'left')[];
    isUnsealed?: boolean;
}

export const getEnvelopeBorderStyle = ({
    borderType = BorderStyle.NONE,
    borderColors,
    borderWidth = DEFAULT_BORDER_WIDTH,
    hiddenBorders,
    isUnsealed = false,
}: GetEnvelopeBorderProps) => {
    switch (borderType) {
        case BorderStyle.SOLID:
            return getSolidBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });

        case BorderStyle.DASHED:
            return getDashedBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });

        case BorderStyle.DOTTED:
            return getDottedBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });

        case BorderStyle.DOUBLE:
            return getDoubleBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });

        case BorderStyle.STRIPED:
            return getStripesBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });

        case BorderStyle.NONE:
            return null;

        default:
            return getSolidBorderStyle({ borderWidth, borderColors, hiddenBorders, isUnsealed });
    }
};

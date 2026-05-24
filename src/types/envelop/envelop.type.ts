import { FontStyle } from "../font.style";

// Envelope Interface with Enums
export interface EnvelopeType {
    id: string;
    name?: string;
    textColor?: string; // Hex, RGB, or CSS color
    fontStyle?: FontStyle; // e.g., 'Arial', 'Times New Roman'
    borderStyle?: BorderStyle;
    borderColors?: string[]; // Hex, RGB, or CSS color
    hiddenBorders?: HiddenBorderSide[];
    backgroundColor?: string; // Hex, RGB, or CSS color
    backgroundUrl?: string; // URL to background image/pattern
    stampUrl?: Stamp;
    seal?: Seal;
}

// Stamp Interface
export interface Stamp {
    imageUrl?: string;
}

// Seal Interface
export interface Seal {
    color?: string;
    icon?: string;
    imageUrl?: string;
}

export enum BorderStyle {
    SOLID = 'Solid',
    DASHED = 'Dashed',
    DOTTED = 'Dotted',
    DOUBLE = 'Double',
    STRIPED = 'Striped',
    NONE = 'None',
}

export type HiddenBorderSide = 'top' | 'right' | 'bottom' | 'left';

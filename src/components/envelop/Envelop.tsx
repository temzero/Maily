// components/envelope/EnvelopeLayout.tsx
import { Component, JSX } from 'solid-js';
import { mailDimensions } from '~/data/constants';
import { BorderStyle, EnvelopeType } from '~/types/envelop/envelop.type';
import { getEnvelopeBorderStyle } from './utils/getEnvelopBorderStyle.utils';
import { FontFamily } from "~/types/font-family.enums";
import { getBackgroundStyle } from '~/utils/getBackgroundStyle';

interface EnvelopeLayoutProps {
    envelope?: EnvelopeType | null;
    width?: number;
    height?: number;
    class?: string;
    onClick?: () => void;
    children?: JSX.Element;
    borderWidth?: number;
    isUnsealed?: boolean;
    isShadow?: boolean;
}

const defaultSettings = {
    textColor: 'black',
    fontStyle: FontFamily.ARIAL,
    backgroundColor: 'linear-gradient(to left, #cccccc, white)',
    borderWidth: 6,
    padding: 12,
    isShadow: true,
} as const;

export const Envelope: Component<EnvelopeLayoutProps> = (props) => {
    const width: number = props.width ?? mailDimensions.width;
    let height: number = props.height ?? mailDimensions.height;
    if (props.isUnsealed) {
        height = height * 0.3;
    }

    const borderWidth = props.borderWidth ?? defaultSettings.borderWidth;
    const padding = borderWidth / 3;
    const textColor = props.envelope?.textColor ?? defaultSettings.textColor;
    const fontStyle = props.envelope?.fontStyle ?? defaultSettings.fontStyle;
    const backgroundColor = props.envelope?.backgroundColor ?? defaultSettings.backgroundColor;
    const backgroundUrl = props.envelope?.backgroundUrl;
    const isShadow = props.isShadow ?? defaultSettings.isShadow;

    const borderStyleObj = getEnvelopeBorderStyle({
        borderType: props.envelope?.borderStyle,
        borderColors: props.envelope?.borderColors,
        borderWidth,
        hiddenBorders: props.envelope?.hiddenBorders,
        isUnsealed: props.isUnsealed ?? false,
    });

    return (
        <div class={`${isShadow && 'teared-shadow'}`}>
            <div
                id={`envelope ${props.envelope?.id}`}
                class={`relative ${props.isUnsealed ? 'teared-shape' : ''}`}
                onClick={props.onClick}
            >
                <div
                    id={`envelope-background ${props.envelope?.id}`}
                    class={`overflow-hidden transition-all duration-200 ${props.class ?? ''}`}
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        'font-family': fontStyle,
                        ...getBackgroundStyle(backgroundColor, backgroundUrl),
                        'border-radius': props.isUnsealed ? '0 0 1px 1px' : '1px',
                        ...borderStyleObj,
                    }}
                />

                <div
                    id={`envelope-content ${props.envelope?.id}`}
                    class={`absolute top-0 left-0 overflow-hidden transition-all`}
                    style={{
                        color: textColor,
                        padding: props.isUnsealed
                            ? `0 ${padding}px ${padding}px ${padding}px`
                            : `${padding}px`,
                        top: `${borderWidth}px`,
                        left: `${borderWidth}px`,
                        right: `${borderWidth}px`,
                        bottom: `${borderWidth}px`,
                        width: 'auto',
                        height: 'auto',
                        // 'pointer-events': 'none', // So clicks pass through to background
                    }}
                >
                    {props.children}
                </div>
            </div>
        </div>
    );
};

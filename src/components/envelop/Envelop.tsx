// components/envelope/EnvelopeLayout.tsx
import { Component, createMemo, Show, mergeProps, JSX } from 'solid-js';
import { mailDimensions } from '~/constants/constants';
import { EnvelopeType } from '~/types/envelop/envelop.type';
import { getEnvelopeBorderStyle } from './utils/getEnvelopBorderStyle.utils';
import { FontFamily } from "~/types/font-family.enums";
import { getBackgroundStyle } from '~/utils/getBackgroundStyle';

interface EnvelopeLayoutProps {
    envelope?: EnvelopeType | null;
    width?: number;
    height?: number;
    isFullWidth?: boolean;
    class?: string;
    onClick?: () => void;
    children?: JSX.Element;
    borderWidth?: number;
    isUnsealed?: boolean;
    isShadow?: boolean;
    isDarken?: boolean;
}

const DEFAULT_SETTINGS = {
    textColor: 'black',
    fontStyle: FontFamily.ARIAL,
    backgroundColor: 'linear-gradient(to left, #cccccc, white)',
    borderWidth: 6,
    isShadow: true,
    aspectRatio: 2
} as const;

const CONTENT_BASE_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 'auto',
    height: 'auto',
    overflow: 'hidden',
} as const;

export const Envelope: Component<EnvelopeLayoutProps> = (props) => {    

    const borderWidth = () => props.borderWidth ?? DEFAULT_SETTINGS.borderWidth;
    const padding = createMemo(() => borderWidth() / 3);
    
    const textColor = () => props.envelope?.textColor ?? DEFAULT_SETTINGS.textColor;
    const fontStyle = () => props.envelope?.fontStyle ?? DEFAULT_SETTINGS.fontStyle;
    const backgroundColor = () => props.envelope?.backgroundColor ?? DEFAULT_SETTINGS.backgroundColor;
    const backgroundUrl = () => props.envelope?.backgroundUrl;
    const isShadow = () => props.isShadow ?? DEFAULT_SETTINGS.isShadow;
    const aspectRatio = DEFAULT_SETTINGS.aspectRatio;


    const containerStyle = createMemo(() => {
        if (props.isFullWidth) {
            if (props.height) {
                return {
                    width: "100%",
                    height: `${props.height}px`,
                };
            }
            return {
                width: "100%",
                "aspect-ratio": props.isUnsealed
                    ? aspectRatio / 0.3
                    : aspectRatio,
            };
        }

        const width = props.width ?? mailDimensions.width;
        const height = props.height 
            ? props.height 
            : (width / aspectRatio) * (props.isUnsealed ? 0.3 : 1);

        return {
            width: `${width}px`,
            height: `${height}px`,
        };
    });
    
    const backgroundStyle = createMemo(() => ({
        'font-family': fontStyle(),
        ...getBackgroundStyle(backgroundColor(), backgroundUrl()),
        'border-radius': props.isUnsealed ? '0 0 1px 1px' : '1px',
        ...getEnvelopeBorderStyle({
            borderType: props.envelope?.borderStyle,
            borderColors: props.envelope?.borderColors,
            borderWidth: borderWidth(),
            hiddenBorders: props.envelope?.hiddenBorders,
            isUnsealed: props.isUnsealed ?? false,
        })
    }));
    
    const contentStyle = createMemo(() => ({
        ...CONTENT_BASE_STYLE,
        color: textColor(),
        padding: props.isUnsealed
            ? `0 ${padding()}px ${padding()}px ${padding()}px`
            : `${padding()}px`,
        top: `${borderWidth()}px`,
        left: `${borderWidth()}px`,
        right: `${borderWidth()}px`,
        bottom: `${borderWidth()}px`,
    }));
    
    return (
        <div
            id={`envelope ${props.envelope?.id}`}
            classList={{ 'envelope-shadow': isShadow() }}
            style={containerStyle()}
            onClick={props.onClick}
        >
            <div
                class={`relative w-full h-full overflow-hidden ${props.class ?? ''} ${props.isUnsealed ? 'teared-shape' : ''} ${isShadow() && 'envelope-shadow'}`}
            >   
                <div class={`w-full h-full`} style={backgroundStyle()}/>
                <Show when={props.children}>
                    <div
                        id={`envelope-content ${props.envelope?.id}`}
                        class="transition-all"
                        style={contentStyle()}
                    >
                        <div class='relative w-full h-full'>
                            {props.children}
                        </div>
                    </div>
                </Show>

                <Show when={props.isDarken}>
                    <div class="darken-overlay" />
                </Show>
            </div>
            
        </div>
    );
};
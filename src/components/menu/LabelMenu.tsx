// LabelMenu.tsx
import { Component, For, Show } from 'solid-js';
import { MenuItem } from './MenuItem';
import { useSortedLabels, clearActiveLabels } from '~/stores/label.store';
import { LabelIcon } from '../label/LabelIcon';
import { labelSize } from '~/constants/constants';
import { AiOutlineClose } from 'solid-icons/ai';
import { Motion, Presence } from 'solid-motionone';
import { easings } from '~/constants/easings';

interface LabelMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LabelMenu: Component<LabelMenuProps> = (props) => {
    const labels = useSortedLabels();

    return (
        <>
            {/* Overlay - show conditionally */}
            <Show when={props.isOpen}>
                <div 
                    class="fixed inset-0 z-40 bg-black/50"
                    onClick={props.onClose}
                />
            </Show>
            
            {/* Menu with Presence */}
            <Presence>
                <Show when={props.isOpen}>
                    <Motion 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4, easing: easings.bounceHeavy }}
                        style={{ "transform-origin": "bottom left" }}
                        class="fixed glass-panel border-2 border-(--border) min-w-[160px] rounded-xl pointer-events-auto! z-50"
                    >
                        <For each={labels()}>
                            {(label) => (
                                <MenuItem
                                    name={label.name}
                                    icon={<LabelIcon labelId={label.id} iconId={label.iconId} size={labelSize} color={label.color} />}
                                    onClick={() => {
                                        label.onClick?.();
                                        props.onClose();
                                    }}
                                />
                            )}
                        </For>
                        <div class='w-[90%] mx-auto border-b border-(--border) mt-1'/>
                        <MenuItem
                            name='Clear'
                            danger
                            icon={<AiOutlineClose size={24} />}
                            onClick={() => {
                                clearActiveLabels();
                                props.onClose();
                            }}
                        />
                    </Motion>
                </Show>
            </Presence>
        </>
    );
};
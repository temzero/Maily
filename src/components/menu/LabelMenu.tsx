// LabelMenu.tsx
import { Component, For } from 'solid-js';
import { MenuItem } from './MenuItem';
import { useSortedLabels } from '~/store/label.store';
import { LabelIcon } from '../label/LabelIcon';
import { labelSize } from '~/constants/constants';

interface LabelMenuProps {
    onClose: () => void;
}

export const LabelMenu: Component<LabelMenuProps> = (props) => {
    const labels = useSortedLabels();

    return (
        <>
            {/* Overlay */}
            <div 
                class="fixed inset-0 z-40 bg-black/50"
                onClick={props.onClose}
            />
            
            {/* Menu */}
            <div class="bg-(--border) backdrop-blur rounded-xl pointer-events-auto! custom-border absolute bottom-4 left-4 z-50">
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
            </div>
        </>
    );
};
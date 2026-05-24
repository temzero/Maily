// ContextMenu.tsx
import { Component } from 'solid-js';
import { Menu, MenuPosition, MenuProps } from './Menu';

interface ContextMenuProps extends MenuProps {
    onOpen?: () => void;
    onClose?: () => void;
}

export const ContextMenu: Component<ContextMenuProps> = (props) => {
    return <Menu {...props} position={props.position || MenuPosition.CURSOR} isContextMenu={true} />;
};

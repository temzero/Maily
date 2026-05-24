// DropdownMenu.tsx
import { Component } from 'solid-js';
import { Menu, MenuPosition, MenuProps } from './Menu';

export const DropdownMenu: Component<MenuProps> = (props) => {
    return <Menu {...props} position={props.position || MenuPosition.BOTTOM_LEFT} />;
};

// components/Header.tsx
import Logo from '~/components/Logo';
import Navigator from './Navigator';
import { useNavigate } from '@solidjs/router';
import { headerHeight } from '~/constants/height';
import { FiUser, FiSettings, FiLogOut, FiHelpCircle } from 'solid-icons/fi';
import { MenuItemType } from '~/components/menu/MenuItem';
import { ContextMenu } from '~/components/menu/ContextMenu';
import { MenuPosition } from '~/components/menu/Menu';
import { currentUser, logout } from '~/store/auth.store';
import { Avatar } from '~/components/ui/Avatar';
import { Motion } from 'solid-motionone';
import { getSlideAnimation } from '~/utils/animations';

export default function Header(props: { class: string }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const menuItems: MenuItemType[] = [
        {
            name: 'Profile',
            icon: <FiUser />,
            onClick: () => navigate('/profile'),
        },
        {
            name: 'Settings',
            icon: <FiSettings />,
            onClick: () => navigate('/settings'),
        },
        {
            name: 'Help',
            icon: <FiHelpCircle />,
            onClick: () => navigate('/help'),
        },
        {
            divider: true,
            name: '',
            onClick: () => {},
        },
        {
            name: 'Logout',
            icon: <FiLogOut />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <header
            style={{ height: `${headerHeight}px` }}
            class={`${props.class} fixed inset-x-0 top-0 bg-linear-to-b from-black/30 to-transparent pointer-events-none flex items-center justify-between px-4`}
        >
            <Logo class="pointer-events-auto pr-1 rounded backdrop-blur" />

            <div class="absolute left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <Motion {...getSlideAnimation(-200, 0.9)}>
                    <Navigator />
                </Motion>
            </div>

            <ContextMenu items={menuItems} position={MenuPosition.BOTTOM_RIGHT}>
                <Avatar
                    src={currentUser()?.avatarUrl}
                    name={`${currentUser()?.firstName} ${currentUser()?.lastName}`}
                    size="sm"
                    rounded="full"
                    showStatus={true}
                    status="online"
                    class="pointer-events-auto!"
                    onClick={() => navigate('/profile')}
                />
            </ContextMenu>
        </header>
    );
}

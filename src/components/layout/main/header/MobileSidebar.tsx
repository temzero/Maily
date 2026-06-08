// components/mobile/MobileSidebar.tsx
import { createSignal, JSX, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useNavigate, useLocation } from '@solidjs/router';
import { FiX, FiInbox, FiSend, FiFileText, FiAlertCircle, FiTrash2, FiStar, FiHelpCircle, FiSettings, FiLogOut } from 'solid-icons/fi';
import { NAVIGATION_ITEMS } from '~/constants/constants';
import { Avatar } from '~/components/ui/Avatar';
import { currentUser, logout } from '~/store/auth.store';
import { IoMailUnreadOutline } from 'solid-icons/io'
import { VsArrowLeft } from 'solid-icons/vs'
import { Motion, Presence } from "solid-motionone";
import { getUnreadEmailCount } from '~/store/email/email.selectors';
import Button from '~/components/ui/Button';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavigationAction {
    name: string;
    href: string;
    icon: JSX.Element;
    showBadge?: boolean;
}

interface SystemAction {
    name: string;
    onClick: () => void;
    icon: JSX.Element;
    isDanger?: boolean;
}

export default function MobileSidebar(props: MobileSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    // Prevent body scroll when sidebar is open
    onMount(() => {
        if (props.isOpen) {
            document.body.style.overflow = 'hidden';
        }
    });

    onCleanup(() => {
        document.body.style.overflow = '';
    });

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.isOpen) {
            props.onClose();
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onCleanup(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    const getIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'unread':
                return <IoMailUnreadOutline size={28} />;
            case 'inbox':
                return <FiInbox size={28} />;
            case 'sent':
                return <FiSend size={28} />;
            case 'drafts':
                return <FiFileText size={28} />;
            case 'spam':
                return <FiAlertCircle size={28} />;
            case 'trash':
                return <FiTrash2 size={28} />;
            default:
                return <FiInbox size={28} />;
        }
    };

    const getSystemIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'helps':
                return <FiHelpCircle size={24} />;
            case 'settings':
                return <FiSettings size={24} />;
            case 'logout':
                return <FiLogOut size={24} />;
            default:
                return <FiHelpCircle size={24} />;
        }
    };

    const getNavigationActions = (): NavigationAction[] => {
        return NAVIGATION_ITEMS.map(item => ({
            name: item.name,
            href: item.href,
            icon: getIcon(item.name),
            showBadge: item.name === 'Unread'
        }));
    };

    const getSystemActions = (): SystemAction[] => {
        return [
            {
                name: 'Helps',
                onClick: () => {
                    navigate('/helps');
                    props.onClose();
                },
                icon: getSystemIcon('helps'),
                isDanger: false
            },
            {
                name: 'Settings',
                onClick: () => {
                    navigate('/settings');
                    props.onClose();
                },
                icon: getSystemIcon('settings'),
                isDanger: false
            },
            {
                name: 'Logout',
                onClick: handleLogout,
                icon: getSystemIcon('logout'),
                isDanger: true
            }
        ];
    };

    return (
        <Portal>
            {/* Backdrop - show conditionally */}
            <Show when={props.isOpen}>
                <div 
                    class="fixed inset-0 bg-black/50 z-50"
                    onClick={props.onClose}
                />
            </Show>
            
            {/* Sidebar with Presence */}
            <Presence>
                <Show when={props.isOpen}>
                    <Motion
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '-100%' }}
                        transition={{ 
                            duration: 0.5, 
                            easing: [0.32, 0.72, 0, 1]
                        }}
                        class="fixed inset-y-0 left-0 w-full flex flex-col gap-5 p-3 bg-(--blackOrWhite) text-white shadow-xl z-50"
                    >
                        {/* Header */}
                        <div class="flex items-center justify-between">
                            <Button
                                onClick={props.onClose}
                                icon={<VsArrowLeft size={32} />}
                                variant="outline"
                                size="md"
                                name="Close sidebar"
                            />

                            <Avatar
                                src={currentUser()?.avatarUrl}
                                name={`${currentUser()?.firstName} ${currentUser()?.lastName}`}
                                size="sm"
                                rounded="full"
                                status="online"
                                onClick={() => {
                                    navigate('/profile');
                                    props.onClose();
                                }}
                            />
                        </div>

                        {/* Navigation Items */}
                        <div class='bg-(--background) custom-border rounded-lg overflow-hidden'>
                            {getNavigationActions().map((action) => (
                                <button
                                    onClick={() => {
                                        navigate(action.href);
                                        props.onClose();
                                    }}
                                    class={`w-full flex items-center gap-4 px-4 py-3 border-b border-(--border) button-effect ${
                                        location.pathname === action.href
                                            ? 'bg-blue-200 text-blue-600 font-semibold'
                                            : 'hover:bg-(--border)'
                                    }`}
                                >
                                    <span class={`${location.pathname === action.href ? 'text-blue-600' : ''}`}>
                                        {action.icon}
                                    </span>
                                    <span class={`text-md ${
                                        location.pathname === action.href ? 'text-blue-600 font-semi-bold' : ''
                                    }`}>
                                        {action.name}
                                    </span>
                                    {action.showBadge && (
                                        <span class="ml-auto bg-red-500 text-white text-md px-2 rounded-full">
                                            {getUnreadEmailCount()}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* System Navigation */}
                        <div class="mt-auto bg-(--background) custom-border rounded-lg overflow-hidden">
                            {getSystemActions().map((action) => (
                                <button
                                    onClick={action.onClick}
                                    class={`w-full flex items-center gap-4 px-4 py-3 border-b border-(--border) button-effect ${
                                        action.isDanger
                                            ? 'text-red-600 hover:bg-red-50'
                                            : location.pathname === `/${action.name.toLowerCase()}`
                                                ? 'bg-blue-200 text-blue-600 font-semibold'
                                                : 'hover:bg-(--border)'
                                    } ${action.isDanger ? 'last:border-b-0' : ''}`}
                                >
                                    <span class={`${action.isDanger ? 'text-red-600' : location.pathname === `/${action.name.toLowerCase()}` ? 'text-blue-600' : ''}`}>
                                        {action.icon}
                                    </span>
                                    <span class={`text-md ${
                                        !action.isDanger && location.pathname === `/${action.name.toLowerCase()}`
                                            ? 'text-blue-600 font-semi-bold'
                                            : action.isDanger
                                                ? 'text-red-600'
                                                : ''
                                    }`}>
                                        {action.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Motion>
                </Show>
            </Presence>
        </Portal>
    );
}
// routes/settings/profile.tsx (or routes/profile.tsx)
import SettingsLayout from '~/components/layout/SettingsLayout';
import Button from '~/components/ui/Button';
import { For, Show, createMemo, createSignal } from 'solid-js';
import { currentUser, logout, useAuth } from '~/store/auth.store';
import { useNavigate } from '@solidjs/router';
import { Avatar } from '~/components/ui/Avatar';
import { formatDate } from '~/utils/formatDate';
import { BiSolidPencil } from 'solid-icons/bi';
import EditProfileModal from '~/components/modal/EditProfileModal';
// import { User, Mail, Phone, MapPin, Calendar, Edit, ChevronRight } from 'lucide-solid';

export default function Profile() {
    const navigate = useNavigate();
    const [editingField, setEditingField] = createSignal<string | null>(null);
    const [isModalOpen, setIsModalOpen] = createSignal(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const handleEditClick = (field: string) => {
        setEditingField(field);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingField(null);
    };

    const handleUpdateSuccess = () => {
        // Optionally refresh user data or show success message
        setIsModalOpen(false);
        setEditingField(null);
    };

    const profileFields = createMemo(() => {
        const userData = currentUser();

        return [
            {
                title: 'Bio',
                value: userData?.bio || 'Not set',
                onclick: () => handleEditClick('bio'),
            },
            {
                title: 'Email',
                value: userData?.email || 'Not set',
                subtitle: userData?.emailVerified ? '✓ Verified' : '⚠️ Not verified',
                onclick: () => handleEditClick('email'),
            },
            // {
            //     title: 'Alternative Emails',
            //     value: userData?.alternativeEmails?.length
            //         ? userData.alternativeEmails
            //         : ['Not set'],
            //     onclick: () => handleEditClick('alternativeEmails'),
            // },
            {
                title: 'Phone',
                value: userData?.phone || 'Not set',
                onclick: () => handleEditClick('phone'),
            },
            {
                title: 'Company',
                value: userData?.company || 'Not set',
                onclick: () => handleEditClick('company'),
            },
            {
                title: 'Job Title',
                value: userData?.jobTitle || 'Not set',
                onclick: () => handleEditClick('jobTitle'),
            },
            {
                title: 'Timezone',
                value: userData?.timezone || 'Not set',
                onclick: () => handleEditClick('timezone'),
            },
        ];
    });

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return (
                <div class="space-y-1">
                    <For each={value}>
                        {(item) => <p class="text-gray-900 dark:text-white">{item}</p>}
                    </For>
                </div>
            );
        }
        return <p class="text-gray-900 dark:text-white">{value || '—'}</p>;
    };

    // Get user initials for fallback
    const userInitials = createMemo(() => {
        const userData = currentUser();
        if (userData?.firstName && userData?.lastName) {
            return `${userData.firstName[0]}${userData.lastName[0]}`;
        }
        if (userData?.displayName) {
            return userData.displayName.slice(0, 2).toUpperCase();
        }
        return 'U';
    });

    const userFullName = createMemo(() => {
        const userData = currentUser();
        if (userData?.firstName && userData?.lastName) {
            return `${userData.firstName} ${userData.lastName}`;
        }
        if (userData?.displayName) {
            return userData.displayName;
        }
        return userData?.email?.split('@')[0] || 'User';
    });

    const userUsername = createMemo(() => {
        const userData = currentUser();
        return userData?.email?.split('@')[0] || 'username';
    });

    // Format the member since date
    const memberSince = createMemo(() => {
        const userData = currentUser();
        if (userData?.createdAt) {
            return formatDate(userData.createdAt);
        }
        return 'Recently';
    });

    return (
        <>
            <SettingsLayout
                title="Profile"
                footer={<h1 class="text-sm opacity-60">Member since {memberSince()}</h1>}
            >
                <Show
                    when={currentUser()}
                    fallback={<div class="p-8 text-center">Loading profile...</div>}
                >
                    {/* Profile Header */}
                    <div class="flex justify-between p-4 border-b border-(--border)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <Avatar
                                    src={currentUser()?.avatarUrl}
                                    name={userFullName()}
                                    size="lg"
                                    rounded="full"
                                />
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                        {userFullName()}
                                    </h2>
                                    <p class="text-gray-600 dark:text-gray-400">
                                        @{userUsername()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button size="sm" variant="link" onClick={handleLogout} class='text-red-500! hover:text-red-400!'>
                            Logout
                        </Button>
                    </div>

                    {/* Profile Information */}
                    <div class="divide-y divide-(--border)">
                        <For each={profileFields()}>
                            {(field) => (
                                <div class="flex items-center justify-between px-6 py-4 hover:bg-(--blackOrWhite) cursor-pointer group transition-colors">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                {field.title}
                                            </p>
                                            <Show when={field.subtitle}>
                                                <span class="text-xs text-gray-400 dark:text-gray-500">
                                                    {field.subtitle}
                                                </span>
                                            </Show>
                                        </div>
                                        {renderValue(field.value)}
                                    </div>
                                    <div
                                        onclick={field.onclick}
                                        class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-500 cursor-pointer"
                                    >
                                        <BiSolidPencil size={22} />
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </SettingsLayout>

            <Show when={isModalOpen()}>
                <EditProfileModal
                    field={editingField()}
                    currentValue={(() => {
                        const userData = currentUser();
                        switch (editingField()) {
                            case 'bio':
                                return userData?.bio || '';
                            case 'email':
                                return userData?.email || '';
                            case 'alternativeEmails':
                                return userData?.alternativeEmails || [];
                            case 'phone':
                                return userData?.phone || '';
                            case 'company':
                                return userData?.company || '';
                            case 'jobTitle':
                                return userData?.jobTitle || '';
                            case 'timezone':
                                return userData?.timezone || '';
                            default:
                                return '';
                        }
                    })()}
                    isOpen={isModalOpen()}
                    onClose={handleCloseModal}
                    onSuccess={handleUpdateSuccess}
                />
            </Show>
        </>
    );
}

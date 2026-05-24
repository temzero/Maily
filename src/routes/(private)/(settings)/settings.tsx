// routes/settings/index.tsx or routes/settings.tsx
import SettingsLayout from '~/components/layout/SettingsLayout';
import { For } from 'solid-js';

export default function Settings() {
    const settingsOptions = [
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your email and push notifications',
            // icon: Bell,
            iconColor: 'text-blue-500',
            buttonText: 'Configure',
            onClick: () => console.log('Navigate to notifications'),
            href: '/settings/notifications',
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            description: 'Control your privacy and security settings',
            // icon: Lock,
            iconColor: 'text-green-500',
            buttonText: 'Configure',
            onClick: () => console.log('Navigate to privacy'),
            href: '/settings/privacy',
        },
        {
            id: 'language',
            title: 'Language & Region',
            description: 'Change language, timezone, and region settings',
            // icon: Globe,
            iconColor: 'text-purple-500',
            buttonText: 'Configure',
            onClick: () => console.log('Navigate to language'),
            href: '/settings/language',
        },
        {
            id: 'appearance',
            title: 'Appearance',
            description: 'Customize the look and feel of your inbox',
            // icon: Moon,
            iconColor: 'text-yellow-500',
            buttonText: 'Configure',
            onClick: () => console.log('Navigate to appearance'),
            href: '/settings/appearance',
        },
        {
            id: 'accounts',
            title: 'Connected Accounts',
            description: 'Manage your connected social media and email accounts',
            // icon: Users,
            iconColor: 'text-indigo-500',
            buttonText: 'Manage',
            onClick: () => console.log('Navigate to accounts'),
            href: '/settings/accounts',
        },
        {
            id: 'privacy',
            title: 'Data & Privacy',
            description: 'Control your data and privacy settings',
            // icon: Shield,
            iconColor: 'text-red-500',
            buttonText: 'Review',
            onClick: () => console.log('Navigate to data privacy'),
            href: '/settings/data-privacy',
        },
    ];

    return (
        <SettingsLayout title="Settings">
            <For each={settingsOptions}>
                {(option) => (
                    <div
                        onClick={option.onClick}
                        class="p-6 hover:bg-(--blackOrWhite)! border-b border-(--border) hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div class="flex items-center gap-4">
                            {/* <option.icon class={`w-6 h-6 ${option.iconColor}`} /> */}
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {option.title}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </For>
        </SettingsLayout>
    );
}

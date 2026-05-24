// routes/settings/help.tsx or routes/help.tsx
import SettingsLayout from '~/components/layout/SettingsLayout';
import { For } from 'solid-js';
import { IoHelpCircleOutline } from 'solid-icons/io'
// import {
//     HelpCircle,
//     FileText,
//     MessageCircle,
//     BookOpen,
//     Mail,
//     Phone,
//     MessageSquare,
// } from 'lucide-solid';

export default function Helps() {
    const helpOptions = [
        {
            id: 'faq',
            title: 'Frequently Asked Questions',
            description: 'Find quick answers to common questions',
            // icon: HelpCircle,
            iconColor: 'text-blue-500',
            buttonText: 'Browse FAQ',
            onClick: () => console.log('Navigate to FAQ'),
            href: '/help/faq',
        },
        {
            id: 'documentation',
            title: 'Documentation',
            description: 'Read our comprehensive guides and tutorials',
            // icon: FileText,
            iconColor: 'text-green-500',
            buttonText: 'Learn more',
            onClick: () => console.log('Navigate to documentation'),
            href: '/help/docs',
        },
        {
            id: 'live-chat',
            title: 'Live Chat',
            description: 'Chat with our support team in real-time',
            // icon: MessageCircle,
            iconColor: 'text-purple-500',
            buttonText: 'Start chat',
            onClick: () => console.log('Start live chat'),
            href: '/help/chat',
        },
        {
            id: 'email',
            title: 'Email Support',
            description: "Send us an email and we'll get back to you",
            // icon: Mail,
            iconColor: 'text-red-500',
            buttonText: 'support@example.com',
            onClick: () => console.log('Email support'),
            href: 'mailto:support@example.com',
        },
        {
            id: 'phone',
            title: 'Phone Support',
            description: 'Call our support team for urgent issues',
            // icon: Phone,
            iconColor: 'text-indigo-500',
            buttonText: 'Call us',
            onClick: () => console.log('Show phone number'),
            href: 'tel:+1-555-123-4567',
        },
    ];

    return (
        <SettingsLayout title="Help & Support" icon={<IoHelpCircleOutline size={48} />}>
            <For each={helpOptions}>
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

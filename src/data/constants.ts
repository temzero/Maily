export const APP_NAME = 'Maily';
export const APP_VERSION = '1.0.0';

export const mailDimensions = {
    width: 260,
    height: 140,
};

export const exampleAvatarUrl =
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80';

export const NAVIGATION_ITEMS = [
    { name: 'Unread', href: '/unread', current: false },
    { name: 'Inbox', href: '/inbox', current: true },
    { name: 'Sent', href: '/sent', current: false },
    { name: 'Drafts', href: '/drafts', current: false },
    { name: 'Spam', href: '/spam', current: false },
    { name: 'Trash', href: '/trash', current: false },
];

export const EMAIL_CATEGORIES = ['Primary', 'Social', 'Promotions', 'Updates', 'Forums'];

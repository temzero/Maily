// routes/email/[id].tsx (route version - kept for backward compatibility)
import { useLocation } from '@solidjs/router';
import { Show } from 'solid-js';
import { MailContent } from '~/components/email/MailContent';

export default function Email() {
    const location = useLocation();

    const emailId = () => {
        const parts = location.pathname.split('/');
        return parts[parts.length - 1];
    };

    return (
        <Show when={emailId()} fallback={<div>Loading...</div>}>
            <MailContent id={emailId()} />
        </Show>
    );
}

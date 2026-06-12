// routes/email/[id].tsx (route version - kept for backward compatibility)
import { useLocation } from '@solidjs/router';
import { Show } from 'solid-js';
import { MailContent } from '~/components/email/MailContent';
import {getEmailById} from '~/stores/email/email.selectors';

export default function Email() {
    const location = useLocation();

    const emailId = () => {
        const parts = location.pathname.split('/');
        return parts[parts.length - 1];
    };

    const email = () => getEmailById(emailId())  // Make it a signal/accessor

    return (
        <Show when={email()} fallback={<div>Loading...</div>}>
            <MailContent email={email()!} />
        </Show>
    );
}
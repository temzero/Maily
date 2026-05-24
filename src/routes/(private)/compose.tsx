// routes/compose.tsx
import { onMount, Show } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { Email, EmailFolder } from '~/types/email/email.type';
import Compose from '~/components/compose/Compose';
import { ModalWrapper } from '~/components/modal/ModalWrapper';

export default function ComposePage() {
    const navigate = useNavigate();
    const location = useLocation();

    let draftEmail: Email | undefined;
    let replyToEmail: Email | undefined;
    let forwardEmail: Email | undefined;

    onMount(() => {
        // Get state data from navigation
        const state = location.state as any;

        if (state?.type === 'draft') {
            // Load draft data
            draftEmail = {
                id: state.draftData?.id || Date.now().toString(),
                subject: state.draftData?.subject || '',
                content: state.draftData?.content || '',
                to: state.draftData?.to || [],
                from: 'me@example.com',
                folder: EmailFolder.DRAFTS,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                read: false,
            } as unknown as Email;
        } else if (state?.type === 'reply') {
            // Load reply data
            replyToEmail = state.replyTo as Email;
        } else if (state?.type === 'forward') {
            // Load forward data
            forwardEmail = state.forwardEmail as Email;
        }
    });

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <ModalWrapper
            isOpen={true}
            zIndex={9999}
            onClose={handleClose}
            closeOnBackdropClick={true}
            disableBackdropBlur={true}
            showCloseButton={true}
        >
            <Compose
                // draftMail={draftEmail}
                // replyTo={replyToEmail}
                // forwardEmail={forwardEmail}
                onClose={handleClose}
            />
        </ModalWrapper>
    );
}

import MainLayout from '~/components/layout/main/MainLayout';
import { onMount, ParentProps } from 'solid-js';
import { useLocation } from '@solidjs/router';
import LabelsAction from '~/components/actions/LabelsAction';
import { addedMails } from '~/data/email.mock';
import { addEmail } from '~/stores/email/email.actions';
import { setAgentMessages } from '~/stores/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';
import { useDevice } from '~/stores/device.store';

interface HomeLayoutProps extends ParentProps {
    isGrid?: boolean;
}

export default function HomeLayout(props: HomeLayoutProps) {
    const { isMobile } = useDevice();

    onMount(() => {
        setAgentMessages(mockAgentMessages.home);

        // Add first email after 3 seconds
        setTimeout(() => {
            addEmail(addedMails[0]);
            // toast('New email arrived!');

            // Add second email after 1 more second
            setTimeout(() => {
                addEmail(addedMails[1]);

                // toast('New email arrived!');

                // Add third email after 1 more second
                setTimeout(() => {
                    addEmail(addedMails[2]);
                    // toast('New email arrived!');
                }, 7000);
            }, 2000);
        }, 3000);
    });

    return (
        <MainLayout>
            {props.children}
            {!isMobile() && <LabelsAction />}
        </MainLayout>
    );
}

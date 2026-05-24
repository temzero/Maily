import MainLayout from '~/components/layout/main/MainLayout';
import { onMount, ParentProps } from 'solid-js';
import { useLocation } from '@solidjs/router';
import LabelsAction from '~/components/actions/LabelsAction';
import { addedMails } from '~/data/email.mock';
import { addEmail } from '~/store/email/email.actions';
import { setAgentMessages } from '~/store/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';

interface HomeLayoutProps extends ParentProps {
    isGrid?: boolean;
}

export default function HomeLayout(props: HomeLayoutProps) {
    const location = useLocation();

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
            <LabelsAction />
        </MainLayout>
    );
}

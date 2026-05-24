// components/compose/ComposeTopIcon.tsx
import { ImQuill, ImReply } from 'solid-icons/im';
import { FaSolidArrowRight } from 'solid-icons/fa';
import { BiRegularPaperPlane } from 'solid-icons/bi';
import { BsEnvelope } from 'solid-icons/bs';
import { ComposeStepType } from './Compose';
import { composeModalStore, ComposeModalType } from '~/store/modal/composeModal.store';

export interface ComposeTopIconProps {
    step: () => ComposeStepType;
}

export default function ComposeTopIcon(props: ComposeTopIconProps) {
    const isDraftMode = () => composeModalStore.type === ComposeModalType.DRAFT;
    const isReplyMode = () => composeModalStore.type === ComposeModalType.REPLY;
    const isForwardMode = () => composeModalStore.type === ComposeModalType.FORWARD;

    const getIcon = () => {
        switch (props.step()) {
            case ComposeStepType.COMPOSE:
                if (isDraftMode() || (!isReplyMode() && !isForwardMode()))
                    return <ImQuill size={40} />;
                if (isReplyMode()) return <ImReply size={40} style={{ transform: 'scaleX(-1)' }} />;
                if (isForwardMode()) return <FaSolidArrowRight size={40} />;
                return <ImQuill size={40} />;

            case ComposeStepType.SEND:
                return <BiRegularPaperPlane size={46} />;

            case ComposeStepType.ENVELOPE:
                return <BsEnvelope size={46} />;

            default:
                return <ImQuill size={40} />;
        }
    };

    return (
        <div class="fixed top-4 left-4 hidden sm:inline-flex shrink-0 transition-transform z-10">
            {getIcon()}
        </div>
    );
}

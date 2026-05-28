// ReadMailActions.jsx
import ActionBar from './ActionBar';
import { FaRegularAlarmClock, FaSolidAlarmClock } from 'solid-icons/fa';
import { getRenderLabelsByIds, useSortedLabels } from '~/store/label.store';
import { createMemo } from 'solid-js';
import { BsPin, BsPinFill } from 'solid-icons/bs';
import { IoArrowForwardOutline } from 'solid-icons/io';
import { BiRegularBlock } from 'solid-icons/bi';
import { SiAdblock } from 'solid-icons/si';
import { RiSystemSpam3Fill, RiSystemSpam3Line } from 'solid-icons/ri';
import { HiOutlineTrash, HiSolidTrash } from 'solid-icons/hi';
import {
    toggleEmailLabel,
    pinEmail,
    snoozeEmail,
    blockSender,
    markAsSpam,
    restoreEmail,
    deleteEmail,
} from '~/store/email/email.actions';
import { TbOutlineRestore } from 'solid-icons/tb';
import { openComposeForward } from '~/store/modal/composeModal.store';
import { getEmailById } from '~/store/email/email.selectors';
import { labelSize } from '~/data/constants';

interface ReadMailActionsProps {
    emailId: string;
}

const ReadMailActions = (props: ReadMailActionsProps) => {
    const redColor = '#EF4444'; // Tailwind's red-500
    const yellowColor = '#F59E0B'; // Tailwind's yellow-500

    const email = createMemo(() => (props.emailId ? getEmailById(props.emailId) : undefined));

    if (!email()) return null;

    const labelActions = createMemo(() =>
        getRenderLabelsByIds(email()?.labelIds || [], labelSize)().map((label) => ({
            id: label.id.toString(),
            label: label.name,
            color: label.color,
            icon: label.iconElement,
            onClick: () => {
                toggleEmailLabel(email()!.id, label.id);
            },
        }))
    );

    const actions = createMemo(() => {
        const topActions = email()?.isDeleted
            ? [
                  {
                      id: 'restore',
                      label: 'Restore',
                      icon: <TbOutlineRestore />,
                      onClick: () => restoreEmail(email()!.id),
                  },
              ]
            : labelActions();

        return [
            ...topActions,
            { divider: true },
            {
                id: 'pin',
                label: email()?.isPinned ? 'Unpin' : 'Pin',
                icon: email()?.isPinned ? <BsPinFill color={redColor} /> : <BsPin />,
                onClick: () => pinEmail(email()!.id, !email()?.isPinned),
            },
            {
                id: 'snooze',
                label: 'Snooze',
                icon: email()?.snoozedUntil ? (
                    <FaSolidAlarmClock color={yellowColor} />
                ) : (
                    <FaRegularAlarmClock />
                ),
                onClick: () => snoozeEmail(email()!.id, new Date(Date.now() + 60 * 60 * 1000)),
            },
            {
                id: 'forward',
                label: 'Forward',
                icon: <IoArrowForwardOutline />,
                onClick: () => {
                    openComposeForward(email()!);
                },
            },
            { divider: true },
            {
                id: 'block',
                label: email()?.isBlocked ? 'Unblock Sender' : 'Block Sender',
                icon: email()?.isBlocked ? <SiAdblock color={redColor} /> : <BiRegularBlock />,
                onClick: () => blockSender(email()!.id),
            },
            {
                id: 'report-spam',
                label: email()?.isSpam ? 'Not Spam' : 'Report Spam',
                icon: email()?.isSpam ? (
                    <RiSystemSpam3Fill color={yellowColor} />
                ) : (
                    <RiSystemSpam3Line />
                ),
                onClick: () => markAsSpam(email()!.id, !email()?.isSpam),
            },
            {
                id: 'delete',
                label: email()?.isDeleted ? 'Delete Permanently' : 'Move to Trash',
                icon: email()?.isDeleted ? <HiSolidTrash color={redColor} /> : <HiOutlineTrash />,
                onClick: () => deleteEmail(email()!.id),
            },
        ];
    });

    return <ActionBar actions={actions()} position="left" />;
};

export default ReadMailActions;

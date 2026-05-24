import { Component, createMemo, createSignal } from 'solid-js';
import { showContextMenu } from '../menu/GlobalContextMenu';
import { getMailMenuItems } from './MailMenuItems';
import { Mail } from './Mail';
import {
    getActiveEmailId,
    getFocusElementId,
    setActiveEmailId,
    setFocusElementId,
} from '~/store/ui.store';
import { getEmailById } from '~/store/email/email.selectors';

interface EmailListItemProps {
    // email: Email;
    emailId: string;
    class?: string;
    onDelete?: () => void;
}

export const EmailListItem: Component<EmailListItemProps> = (props) => {
    // const email = props.email;
    const email = createMemo(() => getEmailById(props.emailId)!);

    console.log('EmailListItem', email().id);

    // const [isInfoMode, setInfoMode] = createSignal(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = createSignal(false);

    const focusId = `mail-item-${email().id}`;

    const isOpening = (): boolean => {
        return getActiveEmailId() === email().id;
    };
    const isFocusing = (): boolean => {
        return getFocusElementId() === focusId;
    };

    const getMenuItems = createMemo(() =>
        getMailMenuItems({
            emailId: email().id,
            onClose: () => {
                setIsContextMenuOpen(false);
            },
            onInfo: () => setFocusElementId(focusId),
            // onInfo: () => setInfoMode(true),
            onDelete: props.onDelete,
        })
    );

    const handleClick = () => {
        setActiveEmailId(email().id);
        console.log('Clicked email', email().id);
    };

    return (
        <div
            id={`email-list-item-${email().id}`}
            class={`flex items-center justify-center w-fit transition-transform cursor-pointer relative ${props.class} ${
                !isFocusing() && (isContextMenuOpen() ? 'scale-110' : 'hover:scale-105')
            }`}
            style={{
                opacity: isFocusing() || isOpening() ? '0' : '1',
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsContextMenuOpen(true);
                showContextMenu(getMenuItems(), e.clientX, e.clientY, () => {
                    setIsContextMenuOpen(false);
                });
            }}
            onClick={handleClick}
        >
            <Mail email={email()} isFocusing={isFocusing()} />
        </div>
    );
};

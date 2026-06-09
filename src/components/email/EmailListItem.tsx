import { Component, createMemo, createSignal } from "solid-js";
import { showContextMenu } from "../menu/GlobalContextMenu";
import { getMailMenuItems } from "./MailMenuItems";
import { Mail } from "./Mail";
import { getEmailById } from "~/store/email/email.selectors";
import {
  getActiveEmailId,
  getFocusElementId,
  setActiveEmailId,
  setFocusElementId,
} from "~/store/ui.store";

interface EmailListItemProps {
  emailId: string;
  class?: string;
  onDelete?: () => void;
}

export const EmailListItem: Component<EmailListItemProps> = (props) => {
  const email = createMemo(() => getEmailById(props.emailId)!);

  console.log("EmailListItem", email().id);

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
      onDelete: props.onDelete,
    }),
  );

  const openContextMenu = (x: number, y: number) => {
    setIsContextMenuOpen(true);

    showContextMenu(getMenuItems(), x, y, () => {
      setIsContextMenuOpen(false);
    });
  };

  const handleClick = () => {
    setActiveEmailId(email().id);
    console.log("Clicked email", email().id);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openContextMenu(e.clientX, e.clientY);
  };

  return (
    <div
      id={`email-list-item-${email().id}`}
      class={`flex items-center justify-center transition-transform cursor-pointer relative touch-manipulation active:scale-110 ${
        props.class ?? ""
      } ${
        !isFocusing() && (isContextMenuOpen() ? "scale-110" : "hover:scale-105")
      }`}
      style={{
        opacity: isFocusing() || isOpening() ? "0" : "1",
        "-webkit-touch-callout": "none",
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <Mail email={email()} isFocusing={isFocusing()} />
    </div>
  );
};

// 'use client';

import { createSignal, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { FiPrinter } from "solid-icons/fi";
import ActionBar from "./ActionBar";
import { AiOutlinePaperClip } from "solid-icons/ai";
import { FiLink } from "solid-icons/fi";
import {
  Attachment,
  AttachmentStatus,
} from "~/types/attachment/attachment.type";
import InsertLinkForm from "~/components/form/InsertLinkForm";
import { printMail } from "../email/MailPrint";

const EmojiPickerButton = clientOnly(
  () => import("~/components/colorPicker/EmojiPickerButton"),
);

interface ComposeActionsProps {
  setAttachments?: (newAttachments: Attachment[]) => void;
  attachments: () => Attachment[];
}

const ComposeActions = (props: ComposeActionsProps) => {
  let normalFileInputRef: HTMLInputElement | undefined;
  let mediaFileInputRef: HTMLInputElement | undefined;
  const [showLinkDialog, setShowLinkDialog] = createSignal(false);

  // Save selection before dialog steals focus
  let savedRange: Range | null = null;

  let contentEditableRef: HTMLDivElement | null = null;

  onMount(() => {
    const findContentEditable = () => {
      const composePaper = document.getElementById("compose-paper");
      if (composePaper) {
        const editableDiv = composePaper.querySelector(
          '[contenteditable="true"]',
        );
        if (editableDiv instanceof HTMLDivElement) {
          contentEditableRef = editableDiv;
        }
      }
    };

    findContentEditable();

    const observer = new MutationObserver(() => {
      if (!contentEditableRef) findContentEditable();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  });

  const handleAttachmentClick = (e: MouseEvent) => {
    e.preventDefault();
    normalFileInputRef?.click();
  };

  const handleAttachmentRightClick = (e: MouseEvent) => {
    e.preventDefault();
    mediaFileInputRef?.click();
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) return;
    const newAttachments: Attachment[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
      progress: 100,
      status: AttachmentStatus.UPLOADED,
    }));
    props.setAttachments?.([...props.attachments(), ...newAttachments]);
  };

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    processFiles(Array.from(input.files || []));
    input.value = "";
  };

  const handleMediaFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    processFiles(Array.from(input.files || []));
    input.value = "";
  };

  const insertLinkAtCursor = (url: string, text?: string) => {
    const editor = contentEditableRef;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();
    if (!selection) return;

    let range: Range;

    if (savedRange) {
      // Restore the saved range from before the dialog opened
      selection.removeAllRanges();
      selection.addRange(savedRange);
      range = savedRange;
    } else if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      // Fallback: append to end of editor
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Build the link
    const link = document.createElement("a");
    link.href = url;
    link.textContent = text || url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.color = "#0066cc";
    link.style.textDecoration = "underline";
    link.style.cursor = "pointer";

    range.deleteContents();
    range.insertNode(link);

    // Move cursor to after the inserted link
    range.setStartAfter(link);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    savedRange = null;

    editor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const handleLinkClick = () => {
    // Capture the current selection NOW, before the dialog steals focus
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange();
    } else {
      // No selection — point to end of editor
      const editor = contentEditableRef;
      if (editor) {
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        savedRange = range;
      } else {
        savedRange = null;
      }
    }
    setShowLinkDialog(true);
  };

  const handlePrint = () => {
    const composePaper = document.getElementById("compose-paper");
    if (!composePaper) return;

    const subjectTextarea = composePaper.querySelector("textarea");
    const editableDiv = composePaper.querySelector('[contenteditable="true"]');

    printMail({
      subject: subjectTextarea?.value || "",
      content: editableDiv?.innerHTML || "",
      from: "me@example.com", // Get from your store
      // to: recipient, // Pass the recipient
      date: new Date().toLocaleString(),
      attachments: props.attachments(), // If you have attachments
    });
  };

  const actions = [
    {
      id: "print",
      label: "Print",
      icon: <FiPrinter size={24} />,
      onClick: handlePrint,
    },
    { divider: true },
    {
      id: "emoji",
      label: "Emoji",
      customElement: (
        <EmojiPickerButton
          shape="circle"
          size="w-7 h-7"
          offsetX={-350} // adjust: picker opens to the left of right-side bar
          offsetY={-100}
        />
      ),
    },
    {
      id: "link",
      label: "Insert Link",
      icon: <FiLink size={24} />,
      onClick: handleLinkClick,
    },
    {
      id: "attachment",
      label: "Attachment (Left: All Files, Right: Images/Videos)",
      icon: <AiOutlinePaperClip size={32} />,
      onClick: handleAttachmentClick,
      onContextMenu: handleAttachmentRightClick,
    },
  ];

  return (
    <>
      <ActionBar actions={actions} position="right" />
      <input
        ref={normalFileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <input
        ref={mediaFileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        style={{ display: "none" }}
        onChange={handleMediaFileSelect}
      />

      {showLinkDialog() && (
        <InsertLinkForm
          onInsert={(url, text) => {
            insertLinkAtCursor(url, text);
            setShowLinkDialog(false);
          }}
          onClose={() => setShowLinkDialog(false)}
        />
      )}
    </>
  );
};

export default ComposeActions;

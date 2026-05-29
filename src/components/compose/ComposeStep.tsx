import { Accessor, onMount, Setter } from "solid-js";
import ComposeActions from "../actions/ComposeActions";
import { Motion } from "solid-motionone";
import { animations } from "~/utils/animations";
import { Attachment } from "~/types/attachment/attachment.type";
import { Email } from "~/types/email/email.type";
import RenderAttachments, {
  RenderAttachmentMode,
} from "~/components/attachment/RenderAttachments";
import ComposeEditor from "../actions/composeEditor/ComposeEditor";

type Props = {
  subject: Accessor<string>;
  content: Accessor<string>;
  attachments: Accessor<Attachment[]>;
  setSubject: Setter<string>;
  setContent: Setter<string>;
  setAttachments: Setter<Attachment[]>;
  originalEmail?: Accessor<Email | null>;
};

export default function ComposeStep(props: Props) {
  let subjectRef: HTMLTextAreaElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  onMount(() => {
    if (contentRef && props.content()) {
      contentRef.innerHTML = props.content();
    }

    setTimeout(() => {
      if (props.subject()?.trim()) {
        contentRef?.focus();
        if (contentRef) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(contentRef);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      } else {
        subjectRef?.focus();
      }
    }, 100);

    if (contentRef) {
      contentRef.style.color = "#000000";
    }
  });

  const handleSubjectChange = (e: Event) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    props.setSubject(textarea.value);
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleContentInput = (e: Event) => {
    const div = e.currentTarget as HTMLDivElement;
    if (!div) return;
    props.setContent(div.innerHTML);
  };

  const handleSubjectKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef?.focus();
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    props.setAttachments((prev) => {
      const toRemove = prev.find((a) => a.id === attachmentId);
      if (toRemove?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(toRemove.url);
      }
      return prev.filter((a) => a.id !== attachmentId);
    });
  };

  return (
    <div class="relative w-full min-h-screen flex-1 flex justify-center items-center">
      <ComposeEditor />
      <ComposeActions
        setAttachments={props.setAttachments}
        attachments={props.attachments}
      />
      <Motion {...animations.slideUp} class="paper-width hardware-accelerated">
        <div id="compose-paper" class="paper paper-min-height">
          <div>
            <textarea
              ref={subjectRef}
              placeholder="Subject"
              maxLength="98"
              rows="1"
              value={props.subject()}
              onInput={handleSubjectChange}
              onKeyDown={handleSubjectKeyDown}
              class="subject-text w-full outline-none resize-none bg-transparent text-black hide-scrollbar"
            />
          </div>
          <div
            id="html-content-editor"
            ref={contentRef}
            contenteditable="true"
            data-placeholder="Write your message here..."
            class="content-text w-full min-h-111 outline-none text-black"
            style="color: #000000;"
            onInput={handleContentInput}
          />
        </div>
        <RenderAttachments
          attachments={props.attachments()}
          mode={RenderAttachmentMode.COMPOSE}
          onRemove={handleRemoveAttachment}
          class="pb-12"
        />
      </Motion>
    </div>
  );
}

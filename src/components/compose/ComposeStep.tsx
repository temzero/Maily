import { Accessor, onMount, Setter } from "solid-js";
import ComposeActions from "../actions/ComposeActions";
import { Motion } from "solid-motionone";
import { animations } from "~/utils/animations";
import { Attachment } from "~/types/attachment/attachment.type";
import { Email } from "~/types/email/email.type";
import RenderAttachments, {
  RenderAttachmentMode,
} from "~/components/attachment/RenderAttachments";
import { useDragAndDropAttachments } from "~/hooks/useDragAndDropAttachments";
import ComposeEditor from "../actions/composeEditor/ComposeEditor";
import { IoMailOpenSharp } from 'solid-icons/io';
import { AiOutlineArrowDown } from "solid-icons/ai";
import { paperMinHeight, mailContentWidth} from "~/constants/dimensions";
import { useMobile } from '~/hooks/useMobile';
import { NavigationContainer } from "./NavigationContainer";
import Button from "../ui/button/Button";
import { ComposeStepType } from "./Compose";
import { VsChevronRight } from 'solid-icons/vs';
import { getActionButtonSize } from "~/utils/button.utils";
import { easings } from '~/constants/easings';

type Props = {
  subject: Accessor<string>;
  content: Accessor<string>;
  attachments: Accessor<Attachment[]>;
  setSubject: Setter<string>;
  setContent: Setter<string>;
  setAttachments: Setter<Attachment[]>;
  setStep: (step: ComposeStepType) => void;
  isComposeValid: Accessor<boolean>;
  originalEmail?: Accessor<Email | null>;
};

export default function ComposeStep(props: Props) {
  let composeRef: HTMLDivElement | undefined;
  let subjectRef: HTMLTextAreaElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const { isMobile } = useMobile();
  

  const { isDragging, setup } = useDragAndDropAttachments({
    attachments: props.attachments,
    setAttachments: props.setAttachments,
    target: () => composeRef,
    pasteTarget: () => contentRef,
  });

  onMount(() => {
    setup();

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
    <div ref={composeRef} class="relative w-full min-h-screen py-16 flex-1 flex justify-center items-center">
      {isDragging() && (
        <div class="fixed inset-0 z-99 pointer-events-none flex flex-col items-center justify-center bg-black/50 backdrop-blur">
          <Motion
            initial={{ y: -99, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              easing: easings.bounceHeavy
            }}
          >
          <AiOutlineArrowDown  size={66} />
          </Motion>
          <IoMailOpenSharp  size={99} />
        </div>
      )}
      
      {!isMobile() && 
        <>
          <ComposeEditor />
          <ComposeActions
            setAttachments={props.setAttachments}
            attachments={props.attachments}
          />
        </>
      }

      {props.isComposeValid() && 
        <NavigationContainer>
          <Button
              onClick={() => props.setStep(ComposeStepType.SEND)}
              icon={<VsChevronRight size={40} />}
              rounded='full'
              aria-label="Next"
              variant="primary"
              size={getActionButtonSize(isMobile())}
              name="Next"
            />
        </NavigationContainer>
      }
      
      <Motion {...animations.slideUp}
        style={{
          width: `${mailContentWidth}px`,
        }}
      >
        <div id="compose-paper" class="paper w-full"
        style={{
          'min-height': `${paperMinHeight}px`,
          
        }}
        >
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
        />
      </Motion>
    </div>
  );
}

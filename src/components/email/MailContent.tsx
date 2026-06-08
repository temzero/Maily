import { Show, onMount, onCleanup } from "solid-js";
import { VsArrowRight } from "solid-icons/vs";
import { MdFillReply } from 'solid-icons/md';
import Button from "~/components/ui/Button";
import { Email, EmailFolder } from "~/types/email/email.type";
import { UnsealedMailDetail } from "./UnsealedMailDetail";
import {
  isOverlayMode,
  openComposeForward,
  openComposeReply,
} from "~/store/modal/composeModal.store";
import ReadMailActions from "../actions/ReadMailAction";
import { Motion, Presence } from "solid-motionone";
import { getMailLayoutAnimation } from "~/utils/animations";
import RenderAttachments from "../attachment/RenderAttachments";
import { audioManager } from "~/utils/audioManager";
import { markAsRead } from "~/store/email/email.actions";
import { setAgentMessages, clearAgentMessages } from "~/store/agent.store";
import { mockAgentMessages } from "~/data/agent.mock";
import {formatEmailWithName} from "~/utils/emailParser"
import { paperMinHeight, mailContentWidth, envelopeWidth} from "~/constants/dimensions";
import { useMobile } from '~/hooks/useMobile';

interface MailContentProps {
  email: Email;
  onClose?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MailContent(props: MailContentProps) {
  const { isMobile } = useMobile();
  const email = props.email;
  const attachments = email.attachments || [];

  const replyIcon = <MdFillReply size={42} class="scale-x-[-1] rotate-180" />;
  const forwardIcon = <VsArrowRight size={36} />;
  const isSent = email.folder === EmailFolder.SENT;
  const animationProps = getMailLayoutAnimation();

  console.log("MailContent", email.id);

  onMount(() => {
    if (!isSent) {
      setAgentMessages(
        mockAgentMessages.read(email.id, email.subject, () => props.onClose?.()),
      );
    }
    audioManager.play("viewMail");
    if (!email.isRead) {
      markAsRead(email.id);
    }
  });

  onCleanup(() => {
    clearAgentMessages();
  });

  return (
    <div class="min-h-screen flex flex-col items-center justify-center overflow-auto">
      <Presence>
        <Motion {...animationProps}>
          <div
            class="flex flex-col items-center justify-center transition-all ease-in-out min-h-screen"
            classList={{
              "pb-16 scale-90": isOverlayMode(),
              "py-16": !isOverlayMode(),
            }}
          >
           <div
              id="writing-paper"
              class="relative paper"
              style={{
                ...(!isMobile() && { width: `${mailContentWidth}px` }),
                'min-height': `${paperMinHeight}px`,
              }}
            >
              <h1 class="subject-text">{email.subject}</h1>

              <div
                class="content-text"
                innerHTML={email.content ?? email.preview}
              />

              <p class="absolute bottom-2.5 right-5 content-text opacity-60 leading-none">
                {formatEmailWithName(email.from)}
              </p>
            </div>

            <Show when={attachments.length > 0}>
              <RenderAttachments attachments={attachments} class="pb-0!" />
            </Show>
          </div>
        </Motion>
      </Presence>

      <div class={`mb-10 w-full ${isMobile() ? '' : 'flex justify-center'}`}>
        <UnsealedMailDetail 
          email={email} 
          width={envelopeWidth} 
          height={isMobile() ? 75 : 100} 
          isFullWidth={isMobile()}
        />
      </div>

      <Show when={!isOverlayMode()}>
       
        {isMobile() ?
          <Button
            onClick={() =>
              isSent ? openComposeForward(email) : openComposeReply(email)
            }
            icon={isSent ? forwardIcon : replyIcon}
            variant="primary"
            size="md"
            class="fixed right-4 bottom-4 hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform z-10"
            name={isSent ? "Forward email" : `Reply to ${email.from}`}
          />
        :
        <>
         <Button
            onClick={() =>
              isSent ? openComposeForward(email) : openComposeReply(email)
            }
            icon={isSent ? forwardIcon : replyIcon}
            variant="primary"
            size="xl"
            class="fixed right-4 bottom-4 hidden sm:inline-flex shrink-0 hover:scale-110 transition-transform z-10"
            name={isSent ? "Forward email" : `Reply to ${email.from}`}
          />
          <ReadMailActions emailId={email.id} onClose={() => props.onClose?.()} />
        </>
        }
      </Show>
    </div>
  );
}

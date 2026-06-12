import { Show, onMount, onCleanup } from "solid-js";
import { VsArrowRight } from "solid-icons/vs";
import { MdFillReply } from 'solid-icons/md';
import Button from "~/components/ui/button/Button";
import { Email, EmailFolder } from "~/types/email/email.type";
import { UnsealedMailDetail } from "./UnsealedMailDetail";
import {
  isOverlayMode,
  openComposeForward,
  openComposeReply,
} from "~/stores/modal/composeModal.store";
import ReadMailActions from "../actions/ReadMailAction";
import { Motion, Presence } from "solid-motionone";
import { getMailLayoutAnimation } from "~/utils/animations";
import RenderAttachments from "../attachment/RenderAttachments";
import { audioManager } from "~/utils/audioManager";
import { markAsRead } from "~/stores/email/email.actions";
import { setAgentMessages, clearAgentMessages } from "~/stores/agent.store";
import { mockAgentMessages } from "~/data/agent.mock";
import {formatEmailWithName} from "~/utils/emailParser"
import { paperMinHeight, mailContentWidth, envelopeWidth} from "~/constants/dimensions";
import { useDevice } from '~/stores/device.store';

interface MailContentProps {
  email: Email;
  onClose?: () => void;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function MailContent(props: MailContentProps) {
  const { isMobile } = useDevice();
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
            class="flex flex-col items-center justify-center transition-all ease-in-out min-h-screen pb-16"
            classList={{
              "pt-0 scale-90": isOverlayMode(),
              "pt-20": !isOverlayMode(),
            }}
          >
           <div
              id="reading-paper"
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

              <p class="absolute bottom-2.5 right-5 text-xs sm:content-text opacity-60 leading-none">
                {formatEmailWithName(email.from)}
              </p>
            </div>

            <Show when={attachments.length > 0}>
              <RenderAttachments attachments={attachments} class="pb-0!" />
            </Show>
          </div>
        </Motion>
      </Presence>

      <div class={`w-full ${isMobile() ? 'mb-20' : 'flex justify-center'}`}>
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
            rounded='full'
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
            rounded='full'
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

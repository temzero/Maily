// EnvelopeStep.tsx
import { AiOutlineCheck } from "solid-icons/ai";
import { VsChevronLeft } from 'solid-icons/vs'
import { createSignal, onCleanup, onMount, Show } from "solid-js";

import { mockAgentMessages } from "~/data/agent.mock";
import {
  clearAgentMessages,
  setAgentMessages,
} from "~/stores/agent.store";
import { envelopeStore } from "~/stores/envelope.store";
import { EnvelopeType } from "~/types/envelop/envelop.type";

import { ComposeStepType } from "./Compose";
import EnvelopeEditor from "./composeStep/EnvelopeEditor";
import EnvelopePreview from "./composeStep/EnvelopePreview";
import { NavigationContainer } from "./NavigationContainer";

import Button from "../ui/button/Button";
import { ItemsSlider } from "../ui/ItemsSlider";
import { getActionButtonSize } from "~/utils/button.utils";
import { useDevice } from "~/stores/device.store";
import { TouchItemsSlider } from "../ui/TouchItemsSlider";
import MobileEnvelopeEditor from "./composeStep/MobileEnvelopeEditor";

type Props = {
  subject: string;
  setStep: (step: ComposeStepType) => void;
};

export default function EnvelopeStep(props: Props) {
  const { isMobile } = useDevice();

  // Local signals — copy from store on mount
  const [localEnvelopes, setLocalEnvelopes] = createSignal<EnvelopeType[]>(
    envelopeStore.store.envelopes.map((e) => ({ ...e })),
  );

  const [currentViewIndex, setCurrentViewIndex] = createSignal(
    envelopeStore.getCurrentEnvelopeIndex(),
  );

  const currentViewedEnvelope = () => localEnvelopes()[currentViewIndex()];

  onMount(() => {
    setAgentMessages(mockAgentMessages.envelope);
  });

  // Flush local state back to store on cleanup
  onCleanup(() => {
    clearAgentMessages();
    envelopeStore.bulkUpdateEnvelopes(localEnvelopes());
  });

  const handleAccept = () => {
    const viewedEnvelope = currentViewedEnvelope();

    if (viewedEnvelope) {
      envelopeStore.selectEnvelopeById(viewedEnvelope.id);
    }

    props.setStep(ComposeStepType.SEND);
  };

  // Add keyboard event listener for Enter key
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Prevent default to avoid any form submissions or unexpected behavior
        e.preventDefault();
        handleAccept();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div>
      <NavigationContainer>
        <Button
          onClick={() => props.setStep(ComposeStepType.SEND)}
          icon={<VsChevronLeft size={36} />}
          rounded='full'
          aria-label="Back"
          variant="glass"
          size={getActionButtonSize(isMobile)}
          name="Back"
        />

        <Button
          onClick={handleAccept}
          icon={<AiOutlineCheck size={40} />}
          rounded='full'
          aria-label="Accept"
          variant="primary"
          size={getActionButtonSize(isMobile)}
          name="Accept"
        />
      </NavigationContainer>

      <Show
        when={isMobile()}
        fallback={
          <>
            <EnvelopeEditor
              envelope={currentViewedEnvelope()}
              currentViewIndex={currentViewIndex()}
              setCurrentViewIndex={setCurrentViewIndex}
              localEnvelopes={localEnvelopes}
              setLocalEnvelopes={setLocalEnvelopes}
            />
            
            <ItemsSlider
              items={localEnvelopes()}
              currentViewIndex={currentViewIndex()}
              onIndexChange={setCurrentViewIndex}
              dotsPosition="top"
              showNavButtons={true}
              sideScale={0.75}
              onAccept={handleAccept}
              renderItem={(envelope: EnvelopeType) => (
                <EnvelopePreview
                  envelope={envelope}
                  subject={props.subject}
                  showSender={true}
                />
              )}
            />
          </>
        }
      >
        <>
          <MobileEnvelopeEditor
            envelope={currentViewedEnvelope()}
            currentViewIndex={currentViewIndex()}
            setCurrentViewIndex={setCurrentViewIndex}
            localEnvelopes={localEnvelopes}
            setLocalEnvelopes={setLocalEnvelopes}
          />
          
          <TouchItemsSlider
            items={localEnvelopes()}
            currentIndex={currentViewIndex()}
            onIndexChange={setCurrentViewIndex}
            onAccept={handleAccept}
            renderItem={(envelope: EnvelopeType) => (
              <EnvelopePreview
                envelope={envelope}
                subject={props.subject}
                showSender={true}
              />
            )}
          />
        </>
      </Show>
    </div>
  );
}
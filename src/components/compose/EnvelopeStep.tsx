// EnvelopeStep.tsx
import { AiOutlineCheck } from "solid-icons/ai";
import { FiArrowLeft } from "solid-icons/fi";
import { createSignal, onCleanup, onMount } from "solid-js";

import { mockAgentMessages } from "~/data/agent.mock";
import { useMobile } from "~/hooks/useMobile";
import {
  clearAgentMessages,
  setAgentMessages,
} from "~/store/agent.store";
import { envelopeStore } from "~/store/envelope.store";
import { EnvelopeType } from "~/types/envelop/envelop.type";

import { ComposeStepType } from "./Compose";
import EnvelopeEditor from "./composeStep/EnvelopeEditor";
import EnvelopePreview from "./composeStep/EnvelopePreview";
import { NavigationContainer } from "./NavigationContainer";

import Button from "../ui/Button";
import { ItemsSlider } from "../ui/ItemsSlider";
import { getActionButtonSize } from "~/utils/button.utils";

type Props = {
  subject: string;
  setStep: (step: ComposeStepType) => void;
};

export default function EnvelopeStep(props: Props) {
  const { isMobile } = useMobile();

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
          onClick={() => props.setStep(ComposeStepType.COMPOSE)}
          icon={<FiArrowLeft size={36} />}
          aria-label="Back"
          variant="outline"
          size={getActionButtonSize(isMobile())}
          name="Back"
        />

        <Button
          onClick={handleAccept}
          icon={<AiOutlineCheck size={40} />}
          aria-label="Accept"
          variant="primary"
          size={getActionButtonSize(isMobile())}
          name="Accept"
        />
      </NavigationContainer>

      {!isMobile() && (
        <EnvelopeEditor
          envelope={currentViewedEnvelope()}
          currentViewIndex={currentViewIndex()}
          setCurrentViewIndex={setCurrentViewIndex}
          localEnvelopes={localEnvelopes}
          setLocalEnvelopes={setLocalEnvelopes}
        />
      )}

      <ItemsSlider
        items={localEnvelopes()}
        currentViewIndex={currentViewIndex()}
        onIndexChange={setCurrentViewIndex}
        dotsPosition={isMobile() ? "bottom" : "top"}
        onAccept={handleAccept}
        renderItem={(envelope: EnvelopeType) => (
          <div class="w-full h-full flex items-center justify-center">
            <EnvelopePreview
              envelope={envelope}
              subject={props.subject}
              showSender={true}
            />
          </div>
        )}
      />
    </div>
  );
}
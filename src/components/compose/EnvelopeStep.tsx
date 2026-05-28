// EnvelopeStep.tsx
import { createSignal, onMount, onCleanup } from "solid-js";
import { envelopeStore } from "~/store/envelope.store";
import { EnvelopeType } from "~/types/envelop/envelop.type";
import { buttonBottomRightClass } from "./ComposeNavigation";
import { ComposeStepType } from "./Compose";
import { AiOutlineCheck } from "solid-icons/ai";
import ActionButton from "../ui/ActionButton";
import EnvelopePreview from "./composeStep/EnvelopePreview";
import { ItemsSlider } from "../ui/ItemsSlider";
import EnvelopeEditor from "./composeStep/EnvelopeEditor";
import { setAgentMessages, clearAgentMessages } from "~/store/agent.store";
import { mockAgentMessages } from "~/data/agent.mock";

type Props = {
  subject: string;
  setStep: (step: ComposeStepType) => void;
};

export default function EnvelopeStep(props: Props) {
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
      <ItemsSlider
        items={localEnvelopes()}
        currentViewIndex={currentViewIndex()}
        onIndexChange={setCurrentViewIndex}
        dotsPosition="top"
        showNavButtons={false}
        renderItem={(envelope: EnvelopeType) => (
          <EnvelopePreview
            envelope={envelope}
            subject={props.subject}
            showSender={true}
            class="transition-all duration-300 transform scale-100"
          />
        )}
      />

      <EnvelopeEditor
        envelope={currentViewedEnvelope()}
        currentViewIndex={currentViewIndex()}
        setCurrentViewIndex={setCurrentViewIndex}
        localEnvelopes={localEnvelopes}
        setLocalEnvelopes={setLocalEnvelopes}
      />

      <ActionButton
        onClick={handleAccept}
        icon={<AiOutlineCheck size={40} />}
        aria-label="Accept"
        variant="primary"
        size="xl"
        class={`${buttonBottomRightClass} bg-green-600!`}
        name="Accept"
      />
    </div>
  );
}

// components/compose/ComposeNavigation.tsx
import { Switch, Match } from 'solid-js';
import { FiArrowRight, FiArrowLeft } from 'solid-icons/fi';
import { BiRegularPaperPlane } from 'solid-icons/bi';
import { AiFillEdit, AiOutlineCheck } from 'solid-icons/ai';
import ActionButton from '~/components/ui/ActionButton';
import { ComposeStepType } from './Compose'; // or wherever it's defined

export interface ComposeNavigationProps {
    step: () => ComposeStepType;
    setStep: (step: ComposeStepType) => void;
    isComposeValid: () => boolean;
    isSendable: () => boolean;
    onSend: () => void;
}
const buttonClass = 'hover:scale-110 transition-transform z-10';
export const buttonBottomLeftClass = `fixed bottom-4 left-4 ${buttonClass}`;
export const buttonBottomRightClass = `fixed bottom-4 right-4 ${buttonClass}`;

export default function ComposeNavigation(props: ComposeNavigationProps) {
    return (
        <Switch>
            {/* COMPOSE STEP */}
            <Match when={props.step() === ComposeStepType.COMPOSE && props.isComposeValid()}>
                <ActionButton
                    onClick={() => props.setStep(ComposeStepType.SEND)}
                    icon={<FiArrowRight size={36} />}
                    aria-label="Next"
                    variant="primary"
                    size="xl"
                    class={buttonBottomRightClass}
                    name="Next"
                    disabled={!props.isComposeValid()}
                />
            </Match>

            {/* SEND STEP */}
            <Match when={props.step() === ComposeStepType.SEND}>
                <ActionButton
                    onClick={() => props.setStep(ComposeStepType.COMPOSE)}
                    icon={<FiArrowLeft size={36} />}
                    aria-label="Back"
                    variant="secondary"
                    size="lg"
                    class={buttonBottomLeftClass}
                    name="Back"
                />

                <Switch>
                    <Match when={props.isSendable()}>
                        <ActionButton
                            onClick={props.onSend}
                            icon={<BiRegularPaperPlane size={40} />}
                            aria-label="Send"
                            variant="primary"
                            size="2xl"
                            class={buttonBottomRightClass}
                            name="Send"
                        />
                    </Match>
                    <Match when={!props.isSendable()}>
                        <ActionButton
                            onClick={() => props.setStep(ComposeStepType.ENVELOPE)}
                            icon={<AiFillEdit size={36} />}
                            aria-label="Edit"
                            variant="secondary"
                            size="lg"
                            class={buttonBottomRightClass}
                            name="Edit"
                        />
                    </Match>
                </Switch>
            </Match>

            {/* ENVELOPE STEP */}
            <Match when={props.step() === ComposeStepType.ENVELOPE}>
                <ActionButton
                    onClick={() => props.setStep(ComposeStepType.SEND)}
                    icon={<FiArrowLeft size={36} />}
                    aria-label="Back"
                    variant="secondary"
                    size="lg"
                    class={buttonBottomLeftClass}
                    name="Back"
                />
            </Match>
        </Switch>
    );
}

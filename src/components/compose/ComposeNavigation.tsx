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
const iconSize: number = 40;
const backIconSise: number = 36;
const buttonClass = 'hover:scale-110 transition-transform z-10';
export const buttonBottomLeftClass = `fixed bottom-6 right-26 ${buttonClass}`;
export const buttonBottomRightClass = `fixed bottom-6 right-6 ${buttonClass}`;

export default function ComposeNavigation(props: ComposeNavigationProps) {
    return (
        <Switch>
            {/* COMPOSE STEP */}
            <Match when={props.step() === ComposeStepType.COMPOSE && props.isComposeValid()}>
                <ActionButton
                    onClick={() => props.setStep(ComposeStepType.SEND)}
                    icon={<FiArrowRight size={iconSize} />}
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
                    icon={<FiArrowLeft size={backIconSise} />}
                    aria-label="Back"
                    variant="outline"
                    size="xl"
                    class={buttonBottomLeftClass}
                    name="Back"
                />

                <Switch>
                    <Match when={props.isSendable()}>
                        <ActionButton
                            onClick={props.onSend}
                            icon={<BiRegularPaperPlane size={iconSize} />}
                            aria-label="Send"
                            variant="primary"
                            size="xl"
                            class={buttonBottomRightClass}
                            name="Send"
                        />
                    </Match>
                    <Match when={!props.isSendable()}>
                        <ActionButton
                            onClick={() => props.setStep(ComposeStepType.ENVELOPE)}
                            icon={<AiFillEdit size={iconSize} />}
                            aria-label="Edit"
                            variant="secondary"
                            size="xl"
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
                    icon={<FiArrowLeft size={backIconSise} />}
                    aria-label="Back"
                    variant="outline"
                    size="xl"
                    class={buttonBottomLeftClass}
                    name="Back"
                />
            </Match>
        </Switch>
    );
}

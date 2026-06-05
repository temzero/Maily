// components/compose/ComposeNavigation.tsx
import { Switch, Match } from 'solid-js';
import { FiArrowRight, FiArrowLeft } from 'solid-icons/fi';
import { BiRegularPaperPlane } from 'solid-icons/bi';
import { AiFillEdit, AiOutlineCheck } from 'solid-icons/ai';
import ActionButton from '~/components/ui/ActionButton';
import { ComposeStepType } from './Compose'; // or wherever it's defined
import { useMobile } from '~/hooks/useMobile';

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
export const backButtonPosition = `fixed top-2 right-20 sm:top-auto sm:bottom-6 ${buttonClass}`;
export const actionButtonsPosition = `fixed top-2 right-2 sm:top-auto sm:bottom-6 ${buttonClass}`;

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
                    class={actionButtonsPosition}
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
                    class={backButtonPosition}
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
                            class={actionButtonsPosition}
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
                            class={actionButtonsPosition}
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
                    class={backButtonPosition}
                    name="Back"
                />
            </Match>
        </Switch>
    );
}

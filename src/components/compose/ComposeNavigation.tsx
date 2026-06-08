// components/compose/ComposeNavigation.tsx
import { Switch, Match } from 'solid-js';
import { FiArrowRight, FiArrowLeft } from 'solid-icons/fi';
import { BiRegularPaperPlane } from 'solid-icons/bi';
import { AiFillEdit, AiOutlineCheck } from 'solid-icons/ai';
import Button from '~/components/ui/Button';
import { ComposeStepType } from './Compose'; // or wherever it's defined
import { useMobile } from '~/hooks/useMobile';
import { envelopeStore } from '~/store/envelope.store';

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
export const backButtonPosition = `fixed top-2 right-22 sm:top-auto sm:bottom-6 ${buttonClass}`;
export const actionButtonsPosition = `fixed top-4 right-4 sm:top-auto sm:bottom-6 ${buttonClass}`;

export default function ComposeNavigation(props: ComposeNavigationProps) {
    const { isMobile } = useMobile();
    const buttonSize = () => isMobile() ? 'md' : 'xl'
    

    return (
        <div class={actionButtonsPosition}>
        <Switch>
            {/* COMPOSE STEP */}
            <Match when={props.step() === ComposeStepType.COMPOSE && props.isComposeValid()}>
                <Button
                    onClick={() => props.setStep(ComposeStepType.SEND)}
                    icon={<FiArrowRight size={iconSize} />}
                    aria-label="Next"
                    variant="primary"
                    size={buttonSize()}
                    // class={actionButtonsPosition}
                    name="Next"
                    disabled={!props.isComposeValid()}
                />
            </Match>

            {/* SEND STEP */}
            <Match when={props.step() === ComposeStepType.SEND}>
                <Button
                    onClick={() => props.setStep(ComposeStepType.COMPOSE)}
                    icon={<FiArrowLeft size={backIconSise} />}
                    aria-label="Back"
                    variant="outline"
                    size={buttonSize()}
                    // class={backButtonPosition}
                    name="Back"
                />

                <Switch>
                    <Match when={props.isSendable()}>
                        <Button
                            onClick={props.onSend}
                            icon={<BiRegularPaperPlane size={iconSize} />}
                            aria-label="Send"
                            variant="primary"
                            size={buttonSize()}
                            // class={actionButtonsPosition}
                            name="Send"
                        />
                    </Match>
                    <Match when={!props.isSendable()}>
                        <Button
                            onClick={() => props.setStep(ComposeStepType.ENVELOPE)}
                            icon={<AiFillEdit size={iconSize} />}
                            aria-label="Edit"
                            variant="secondary"
                            size={buttonSize()}
                            // class={actionButtonsPosition}
                            name="Edit"
                        />
                    </Match>
                </Switch>
            </Match>

            {/* ENVELOPE STEP */}
            <Match when={props.step() === ComposeStepType.ENVELOPE}>
                <Button
                    onClick={() => props.setStep(ComposeStepType.SEND)}
                    icon={<FiArrowLeft size={backIconSise} />}
                    aria-label="Back"
                    variant="outline"
                    size={buttonSize()}
                    // class={backButtonPosition}
                    name="Back"
                />
            </Match>
        </Switch>
        </div>
    );
}

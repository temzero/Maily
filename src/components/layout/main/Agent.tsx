import { Portal } from 'solid-js/web';
import { createMemo, createSignal, createEffect, For, onCleanup } from 'solid-js';
import { AgentMessage, getAgentMessages, setAgentMessages } from '~/stores/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';
import { Motion } from 'solid-motionone';
import { getUnreadEmailCount } from '~/stores/email/email.selectors';
import { useNavigate } from '@solidjs/router';
import AgentAvatar from '~/assets/images/AI-avatar.jpg';
import { easings } from '~/constants/easings';

const messageDisplayDelay = 1650;

export function Agent() {
    const navigate = useNavigate();

    const agentMessages = createMemo(getAgentMessages);
    const [visibleMessages, setVisibleMessages] = createSignal<AgentMessage[]>([]);

    let timers: number[] = [];

    createEffect(() => {
        const messages = agentMessages();

        // Clear previous timers
        timers.forEach(clearTimeout);
        timers = [];

        // Clear visible messages
        setVisibleMessages([]);

        if (!messages.length) return;

        // Add messages one by one
        messages.forEach((message, index) => {
            const timer = window.setTimeout(() => {
                setVisibleMessages((prev) => [...prev, message]);
            }, index * messageDisplayDelay);

            timers.push(timer);
        });
    });

    onCleanup(() => {
        timers.forEach(clearTimeout);
    });

    const handleAvatarClick = () => {
        if (agentMessages().length > 0) {
            setAgentMessages([]);
            return;
        }

        const unreadCount = getUnreadEmailCount();

        setAgentMessages(
            mockAgentMessages.helps(unreadCount, navigate)
        );
    };

    return (
        <Portal>
            <div
                class='shadow-xl border-2 rounded-full'
                style={{
                    position: 'fixed',
                    'z-index': 999999,
                    bottom: '20px',
                    left: '20px',
                }}
            >
                <img
                    src={AgentAvatar}
                    alt="AI Avatar"
                    class="w-16 h-16 rounded-full border-2 border-(--border) object-cover shrink-0 select-none hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                    onClick={handleAvatarClick}
                />
            </div>

            {visibleMessages().length > 0 && (
                <div class="fixed bottom-22 left-14 w-120 space-y-1.5 z-999999">
                    <For each={visibleMessages()}>
                        {(message) => (
                            <Motion
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    easing: easings.bounceHeavy,
                                    duration: 0.5,
                                }}
                                style={{
                                    'transform-origin': 'bottom left',
                                }}
                            >
                                <div
                                    class={`message-bubble text-start ${
                                        message.onClick
                                            ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0px_9px_rgba(0,0,255,1)]!'
                                            : ''
                                    }`}
                                    onClick={message.onClick}
                                >
                                    {message.text}
                                </div>
                            </Motion>
                        )}
                    </For>
                </div>
            )}
        </Portal>
    );
}
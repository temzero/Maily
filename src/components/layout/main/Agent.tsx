import { Portal } from 'solid-js/web';
import { createMemo, createSignal, For } from 'solid-js';
import { getAgentMessages, setAgentMessages } from '~/store/agent.store';
import { mockAgentMessages } from '~/data/agent.mock';
import { Motion } from 'solid-motionone';
import { getUnreadEmailCount } from '~/store/email/email.selectors';
import AgentAvatar from '~/assets/images/AI-avatar.jpg';
import { useNavigate } from '@solidjs/router';

export function Agent() {
    const agentMessages = createMemo(getAgentMessages);
    const navigate = useNavigate();

    const handleAvatarClick = () => {
        if (agentMessages().length > 0) {
            setAgentMessages([]);
        } else {
            const unreadCount = getUnreadEmailCount();
            setAgentMessages(mockAgentMessages.helps(unreadCount, navigate));
        }
    };

    return (
        <>
            <Portal>
                <div
                    style={{
                        position: 'fixed',
                        'z-index': 99999,
                        bottom: '20px',
                        left: '20px',
                    }}
                >
                    <img
                        src={AgentAvatar}
                        alt="AI Avatar"
                        class="w-12 h-12 rounded-full border-2 border-(--border) object-cover shrink-0 select-none hover:scale-125 transition-transform cursor-pointer pointer-events-auto"
                        onClick={handleAvatarClick}
                    />
                </div>
                {agentMessages() && (
                    <div class="fixed bottom-18 left-12 w-120 space-y-1.5 z-99999">
                        <For each={agentMessages()}>
                            {(message) => (
                                <Motion
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        easing: [0.25, 1.5, 0.5, 1],
                                        duration: 0.5,
                                    }}
                                    style={{ 'transform-origin': 'bottom left' }}
                                >
                                    <div
                                        class={`message-bubble text-start ${message.onClick ? 'cursor-pointer hover:scale-105 hover:shadow-[0_0px_9px_rgba(0,0,255,1)]! ' : ''}`}
                                        onClick={message.onClick}
                                    >
                                        <p class="text-sm">{message.text}</p>
                                    </div>
                                </Motion>
                            )}
                        </For>
                    </div>
                )}
            </Portal>
        </>
    );
}

// store/agent.store.ts
import { createStore } from 'solid-js/store';

export interface AgentMessage {
    text: string;
    isUserSender?: boolean;
    onClick?: () => void;
}

interface AgentState {
    isVisible?: boolean;
    messages: AgentMessage[];
}

const [agentStore, setAgentStore] = createStore<AgentState>({
    isVisible: true,
    messages: [
        {
            text: 'Hello! How can I help you today?',
            isUserSender: false,
            onClick: () => console.log('Hello message clicked'),
        },
    ],
});

// ====================
// Message Actions
// ====================
export const getAgentMessages = () => agentStore.messages;

export const setAgentMessages = (messages: AgentMessage[]) => {
    setAgentStore('messages', messages);
};

export const addAgentMessage = (text: string, onClick: () => void, isUserSender?: boolean) => {
    const newMessage: AgentMessage = {
        text,
        isUserSender: isUserSender || false,
        onClick,
    };
    setAgentStore('messages', (prev) => [...prev, newMessage]);
};

export const clearAgentMessages = () => {
    setAgentStore('messages', []);
};

export const toggleAgentVisibility = () => {
    setAgentStore('isVisible', (prev) => !prev);
}

export const setAgentVisibility = (isVisible: boolean) => {
    setAgentStore('isVisible', isVisible);
}

export { agentStore };

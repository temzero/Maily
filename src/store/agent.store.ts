// store/agent.store.ts
import { createStore } from 'solid-js/store';

export interface Message {
    text: string;
    isUserSender?: boolean;
    onClick?: () => void;
}

interface AgentState {
    messages: Message[];
}

const [agentStore, setAgentStore] = createStore<AgentState>({
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

export const setAgentMessages = (messages: Message[]) => {
    setAgentStore('messages', messages);
};

export const addAgentMessage = (text: string, onClick: () => void, isUserSender?: boolean) => {
    const newMessage: Message = {
        text,
        isUserSender: isUserSender || false,
        onClick,
    };
    setAgentStore('messages', (prev) => [...prev, newMessage]);
};

export const clearAgentMessages = () => {
    setAgentStore('messages', []);
};

export { agentStore };

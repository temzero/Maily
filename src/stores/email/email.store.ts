import { createStore } from 'solid-js/store';
import { Email } from '~/types/email/email.type';
import { mockEmails } from '~/data/email.mock';

export interface EmailStore {
    ids: string[];
    entities: Map<string, Email>;
    loading: boolean;
    // Move computed/derived data to selectors
}

// Private store - only exported for selectors/actions
export const [store, setStore] = createStore<EmailStore>({
    ids: [],
    entities: new Map(),
    loading: false,
});

// Helper functions
const createEntitiesMap = (emails: Email[]) => {
    return new Map(emails.map((email) => [email.id, email]));
};

// Core mutations (low-level)
export const emailMutations = {
    setAll: (emails: Email[]) => {
        setStore('entities', createEntitiesMap(emails));
        setStore(
            'ids',
            emails.map((e) => e.id)
        );
    },

    addOne: (email: Email) => {
        setStore('entities', (prev) => new Map(prev).set(email.id, email));
        setStore('ids', (prev) => [email.id, ...prev]);
    },

    updateOne: (id: string, updates: Partial<Email>) => {
        setStore('entities', (prev) => {
            const current = prev.get(id);
            if (!current) return prev;
            const newMap = new Map(prev);
            newMap.set(id, { ...current, ...updates });
            return newMap;
        });
    },

    batchUpdate: (updates: Array<{ id: string; updates: Partial<Email> }>) => {
        setStore('entities', (prev) => {
            const newMap = new Map(prev);
            updates.forEach(({ id, updates: emailUpdates }) => {
                const current = newMap.get(id);
                if (current) {
                    newMap.set(id, { ...current, ...emailUpdates });
                }
            });
            return newMap;
        });
    },

    deleteOne: (id: string) => {
        setStore('ids', (prev) => prev.filter((pid) => pid !== id));
        setStore('entities', (prev) => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        });
    },

    setLoading: (loading: boolean) => {
        setStore('loading', loading);
    },
};

// Public getters (read-only)
export const getEmailStore = () => store;

// Initialize
export const initializeEmails = (emails: Email[] = mockEmails) => {
    emailMutations.setAll(emails);
    emailMutations.setLoading(false);
};

export { store as emailStore };

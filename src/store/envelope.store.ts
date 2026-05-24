// store/envelope.store.ts
import { createStore } from 'solid-js/store';
import { envelopePresets } from '~/data/envelop.mock';
import { EnvelopeType } from '~/types/envelop/envelop.type';

type EnvelopeStore = {
    envelopes: EnvelopeType[];
    currentEnvelopeId: string | null;
};

export const MAX_ENVELOPES = 12; // Configurable constant

const createEnvelopeStore = () => {
    const envelopes = envelopePresets;
    const [store, setStore] = createStore<EnvelopeStore>({
        envelopes: envelopes,
        currentEnvelopeId: envelopes[0]?.id || null,
    });

    const selectEnvelope = (envelope: EnvelopeType | null) => {
        setStore('currentEnvelopeId', envelope?.id || null);
    };

    const selectEnvelopeById = (id: string | null) => {
        setStore('currentEnvelopeId', id);
    };

    const addNewEnvelope = (customEnvelope: EnvelopeType, index?: number): number | null => {
        // Check max envelope limit
        if (store.envelopes.length >= MAX_ENVELOPES) {
            console.error(`Cannot add envelope. Maximum limit of ${MAX_ENVELOPES} reached.`);
            return null;
        }

        let newEnvelopes;
        let insertIndex: number;

        if (index !== undefined && index >= 0 && index <= store.envelopes.length) {
            newEnvelopes = [
                ...store.envelopes.slice(0, index),
                customEnvelope,
                ...store.envelopes.slice(index),
            ];
            insertIndex = index;
        } else {
            newEnvelopes = [...store.envelopes, customEnvelope];
            insertIndex = newEnvelopes.length - 1;
        }

        setStore('envelopes', newEnvelopes);
        return insertIndex;
    };

    const getCurrentEnvelope = (): EnvelopeType | null => {
        if (!store.currentEnvelopeId) return null;
        return store.envelopes.find((e) => e.id === store.currentEnvelopeId) || null;
    };

    const getCurrentEnvelopeIndex = (): number => {
        if (!store.currentEnvelopeId) return -1;
        return store.envelopes.findIndex((e) => e.id === store.currentEnvelopeId);
    };

    const updateEnvelope = (id: string, updatedEnvelope: Partial<EnvelopeType>) => {
        setStore(
            'envelopes',
            store.envelopes.map((e) => (e.id === id ? { ...e, ...updatedEnvelope } : e))
        );
    };

    const bulkUpdateEnvelopes = (envelopes: EnvelopeType[]) => {
        // Optional: Add validation for bulk updates
        if (envelopes.length > MAX_ENVELOPES) {
            console.warn(`Bulk update would exceed max limit of ${MAX_ENVELOPES}`);
            // Handle accordingly - either trim or reject
        }
        setStore('envelopes', envelopes);
    };

    const moveEnvelope = (id: string, direction: 'left' | 'right'): number | null => {
        const arr = [...store.envelopes];
        const idx = arr.findIndex((e) => e.id === id);
        const swapIdx = direction === 'left' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= arr.length) return null;
        [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
        setStore('envelopes', arr);
        return swapIdx;
    };

    const removeEnvelope = (id: string): number | null => {
        if (store.envelopes.length <= 1) {
            console.warn('Cannot delete the last envelope');
            return null;
        }

        const newEnvelopes = store.envelopes.filter((e) => e.id !== id);
        const removedIndex = store.envelopes.findIndex((e) => e.id === id);

        const previousIndex = Math.max(0, removedIndex - 1);

        setStore('envelopes', newEnvelopes);

        if (store.currentEnvelopeId === id) {
            const prevEnvelope = newEnvelopes[previousIndex];
            setStore('currentEnvelopeId', prevEnvelope?.id || null);
        }

        return previousIndex;
    };

    // Helper function to check if max limit is reached
    const isMaxEnvelopesReached = (): boolean => {
        return store.envelopes.length >= MAX_ENVELOPES;
    };

    // Get remaining envelope slots
    const getRemainingEnvelopeSlots = (): number => {
        return Math.max(0, MAX_ENVELOPES - store.envelopes.length);
    };

    return {
        store,
        selectEnvelope,
        selectEnvelopeById,
        addNewEnvelope,
        getCurrentEnvelope,
        getCurrentEnvelopeIndex,
        updateEnvelope,
        bulkUpdateEnvelopes,
        moveEnvelope,
        removeEnvelope,
        isMaxEnvelopesReached,
        getRemainingEnvelopeSlots,
        MAX_ENVELOPES, // Expose constant if needed
    };
};

export const envelopeStore = createEnvelopeStore();

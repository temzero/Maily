// store/label.store.ts
import { createMemo, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createInitialLabels, getIcon } from '~/utils/icon-registry';

export interface Label {
    id: number;
    order: number;
    name: string;
    iconId: string;
    color: string;
    description?: string;
    onClick?: () => void;
    createdAt: Date;
}

export interface RenderLabel extends Label {
    iconElement: JSX.Element;
}
export interface RenderActiveLabel extends Label {
    iconElement: () => JSX.Element;
}

// Define labels without id, order, and createdAt
const labelsData = [
    {
        name: 'Love',
        iconId: 'heart',
        color: '#FF6B6B',
    },
    {
        name: 'Important',
        iconId: 'star',
        color: '#FACC15',
    },
    {
        name: 'Work',
        iconId: 'briefcase',
        color: '#3B82F6',
    },
    {
        name: 'Social',
        iconId: 'globe',
        color: '#22C55E',
    },
    {
        name: 'Payment',
        iconId: 'creditCard',
        color: '#A855F7',
    },
    {
        name: 'Security',
        iconId: 'key',
        color: '#EF4444',
    },
];

const initialLabels = createInitialLabels(labelsData);

interface LabelState {
    labels: Label[];
    activeLabelIds: number[]; // Track active/selected label IDs
}

const [labelStore, setLabelStore] = createStore<LabelState>({
    labels: initialLabels,
    activeLabelIds: [], // Initially no active labels
});

// Getters
export const getLabels = () => labelStore.labels;
export const getLabelById = (id: number) => labelStore.labels.find((label) => label.id === id);
export const Render = (ids: number[]) =>
    labelStore.labels.filter((label) => ids.includes(label.id));
export const useSortedLabels = () => {
    return createMemo(() => [...labelStore.labels].sort((a, b) => a.order - b.order));
};

export const getRenderLabelsByIds = (labelIds: number[], iconSize: number = 20) => {
    return createMemo((): RenderActiveLabel[] => {
        const allLabels = useSortedLabels()();
        return allLabels.map((label) => {
            const isInArray = labelIds.includes(label.id);
            const iconVariant = isInArray ? 'solid' : 'outline';
            return {
                ...label,
                iconElement: () =>
                    getIcon(
                        label.iconId,
                        iconVariant,
                        iconSize,
                        isInArray ? label.color : 'white'
                    ) as JSX.Element,
            };
        });
    });
};

export const getRenderLabelIconsByIds = (labelIds: number[], size: number = 16): RenderLabel[] => {
    const labelsMap = new Map(labelStore.labels.map((label) => [label.id, label]));
    return labelIds
        .filter((id) => labelsMap.has(id))
        .sort((a, b) => (labelsMap.get(a)?.order || 0) - (labelsMap.get(b)?.order || 0))
        .map((id) => {
            const label = labelsMap.get(id)!;
            return {
                ...label,
                iconElement: getIcon(label.iconId, 'solid', size) as JSX.Element,
            };
        });
};

export const getRenderActiveLabels = (): RenderActiveLabel[] => {
    const activeLabelIds = labelStore.activeLabelIds;
    const labelsMap = new Map(labelStore.labels.map((label) => [label.id, label]));

    return activeLabelIds
        .filter((id) => labelsMap.has(id))
        .map((id) => {
            const label = labelsMap.get(id)!;
            return {
                ...label,
                iconElement: () => getIcon(label.iconId, 'solid', 20, label.color) as JSX.Element,
            };
        });
};

// Active labels getters
export const getActiveLabelIds = () => labelStore.activeLabelIds;
export const getActiveLabels = () =>
    labelStore.labels.filter((label) => labelStore.activeLabelIds.includes(label.id));
export const getSortedActiveLabels = () => getActiveLabels().sort((a, b) => a.order - b.order);
export const isLabelActive = (labelId: number) => {
    return createMemo(() => labelStore.activeLabelIds.includes(labelId));
};

export const setActiveLabels = (ids: number[]) => {
    setLabelStore('activeLabelIds', ids);
};

// store/label.store.ts
export const toggleLabel = (id: number, isSingleMode?: boolean) => {
    console.log(
        'Current active:',
        labelStore.activeLabelIds,
        'Toggling label:',
        id,
        'Single mode:',
        isSingleMode
    );
    console.log(Array.isArray(labelStore.activeLabelIds)); // true ✅

    setLabelStore('activeLabelIds', (currentActive) => {
        const isActive = currentActive.includes(id);

        if (isActive) {
            // Remove the label
            return currentActive.filter((labelId) => labelId !== id);
        } else {
            // Add the label
            if (isSingleMode) {
                return [id];
            } else {
                return [...currentActive, id];
            }
        }
    });

    console.log('Updated active:', labelStore.activeLabelIds);
};

export const clearActiveLabels = () => {
    setLabelStore('activeLabelIds', []);
};

// Actions
export const addLabel = (label: Omit<Label, 'id' | 'createdAt' | 'order'>) => {
    const newOrder = Math.max(...labelStore.labels.map((l) => l.order), 0) + 1;
    setLabelStore({
        labels: [
            ...labelStore.labels,
            {
                ...label,
                id:
                    labelStore.labels.length > 0
                        ? Math.max(...labelStore.labels.map((l) => l.id)) + 1
                        : 1,
                order: newOrder,
                createdAt: new Date(),
            },
        ],
    });
};

export const updateLabel = (id: number, updates: Partial<Omit<Label, 'id' | 'createdAt'>>) => {
    setLabelStore('labels', (prev) =>
        prev.map((label) => (label.id === id ? { ...label, ...updates } : label))
    );
};

export const deleteLabel = (id: number) => {
    setLabelStore('labels', (prev) => {
        const filtered = prev.filter((label) => label.id !== id);
        // Also remove from active labels if present
        setLabelStore('activeLabelIds', (active) => active.filter((activeId) => activeId !== id));
        return filtered;
    });
};

export const moveLabelUp = (id: number) => {
    setLabelStore('labels', (prev) => {
        const index = prev.findIndex((label) => label.id === id);
        if (index <= 0) return prev;

        const newLabels = [...prev];
        // Swap orders instead of positions
        const tempOrder = newLabels[index].order;
        newLabels[index].order = newLabels[index - 1].order;
        newLabels[index - 1].order = tempOrder;

        // Re-sort by order
        return newLabels.sort((a, b) => a.order - b.order);
    });
};

export const moveLabelDown = (id: number) => {
    setLabelStore('labels', (prev) => {
        const index = prev.findIndex((label) => label.id === id);
        if (index === -1 || index >= prev.length - 1) return prev;

        const newLabels = [...prev];
        // Swap orders instead of positions
        const tempOrder = newLabels[index].order;
        newLabels[index].order = newLabels[index + 1].order;
        newLabels[index + 1].order = tempOrder;

        // Re-sort by order
        return newLabels.sort((a, b) => a.order - b.order);
    });
};

export { labelStore };

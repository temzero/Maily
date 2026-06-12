// store/ui.store.ts
import { createStore } from 'solid-js/store';

interface UIState {
    searchQuery: string;
    activeEmailId: string | null;
    focusedElementId: string | null;
}

const [uiStore, setUIStore] = createStore<UIState>({
    searchQuery: '',
    activeEmailId: null,
    focusedElementId: null
});

// ====================
// Search actions
// ====================
export const getSearchQuery = () => uiStore.searchQuery;

export const setSearchQuery = (query: string) => {
    setUIStore('searchQuery', query);
};

export const clearSearchQuery = () => {
    setUIStore('searchQuery', '');
};

// ====================
// Active Email actions
// ====================
export const getActiveEmailId = () => uiStore.activeEmailId;

export const setActiveEmailId = (id: string | null) => {
    setUIStore({
        activeEmailId: id,
    });
};

export const clearActiveEmailId = () => {
    setUIStore({
        activeEmailId: null,
    });
};

// ====================
// Focus Element Actions
// ====================
export const getFocusElementId = () => uiStore.focusedElementId;

export const setFocusElementId = (id: string | null) => {
    setUIStore({
        focusedElementId: id,
    });
};

export const clearFocusElementId = () => {
    setUIStore({
        focusedElementId: null,
    });
};

// ====================
// Reset
// ====================
export const clearUiState = () => {
    setUIStore({
        searchQuery: '',
        activeEmailId: null,
    });
};

export { uiStore };

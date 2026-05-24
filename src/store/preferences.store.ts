// stores/preferences.store.ts
import { createStore } from 'solid-js/store';
import { createEffect, createMemo, createRoot } from 'solid-js'; // 👈 Add createMemo
import { Theme } from '~/types/preferences/preferences.enums';
import { UserPreferences, defaultUserPreferences } from '~/types/preferences/preferences.type';

// ============ Types ============
interface PreferencesState extends UserPreferences {
    _initialized: boolean;
}

// ============ Initial State ============
const initialState = (): PreferencesState => ({
    ...defaultUserPreferences,
    _initialized: false,
});

const [preferences, setPreferences] = createStore<PreferencesState>(initialState());

// ============ Storage Keys ============
const STORAGE_KEY = 'app_preferences';

// ============ Load Preferences from Storage ============
export function initPreferences() {
    if (typeof window === 'undefined') return;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);
            setPreferences({
                ...defaultUserPreferences,
                ...parsed,
                _initialized: true,
            });
            console.log('✅ Preferences loaded from storage');
        } else {
            setPreferences({
                ...defaultUserPreferences,
                _initialized: true,
            });
            console.log('✅ Using default preferences');
        }
    } catch (err) {
        console.error('Failed to load preferences:', err);
        setPreferences({
            ...defaultUserPreferences,
            _initialized: true,
        });
    }
}

// ============ Auto-save to Storage ============
createRoot(() => {
    createEffect(() => {
        if (typeof window === 'undefined') return;
        if (!preferences._initialized) return;

        const { _initialized, ...prefsToSave } = preferences;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsToSave));
        applyTheme(preferences.theme);
    });
});

// ============ Apply Theme ============
function applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const isDark =
        theme === Theme.DARK ||
        (theme === Theme.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

// ============ Public Actions ============

export function updatePreferences(updates: Partial<UserPreferences>) {
    setPreferences(updates);
}

export function updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
) {
    setPreferences({ [key]: value } as Partial<PreferencesState>);
}

export function resetPreferences() {
    setPreferences({
        ...defaultUserPreferences,
        _initialized: true,
    });
}

export function resetCategory(category: keyof UserPreferences) {
    setPreferences({ [category]: defaultUserPreferences[category] } as Partial<PreferencesState>);
}

export function exportPreferences(): string {
    const { _initialized, ...prefs } = preferences;
    return JSON.stringify(prefs, null, 2);
}

export function importPreferences(json: string): boolean {
    try {
        const imported = JSON.parse(json);
        const { _initialized, ...validPrefs } = imported;
        setPreferences({
            ...defaultUserPreferences,
            ...validPrefs,
            _initialized: true,
        });
        return true;
    } catch (err) {
        console.error('Failed to import preferences:', err);
        return false;
    }
}

// ============ REACTIVE GETTERS (like label.store.ts) ============

export const getPreferences = () => preferences;
export const getTheme = () => preferences.theme;
export const getCompactView = () => preferences.isCompactView;
export const getFontSize = () => preferences.fontSize;
export const getEmailSignature = () => preferences.emailSignature;
export const getLanguage = () => preferences.language;
export const getTimezone = () => preferences.timezone;
export const getIsDateView = () => preferences.isDateView;

// ============ Hook ============
export function usePreferences() {
    return {
        preferences: createMemo(() => preferences), // Reactive!
        updatePreferences,
        updatePreference,
        resetPreferences,
        exportPreferences,
        importPreferences,
        isDarkMode: () => createMemo(() => preferences.theme === Theme.DARK),
        isCompactView: () => createMemo(() => preferences.isCompactView),
        getEmailSignature: () => createMemo(() => preferences.emailSignature),
        getDateView: () => createMemo(() => preferences.isDateView), // 👈 Add this
    };
}

// ============ Listen to System Theme Changes ============
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (preferences.theme === Theme.SYSTEM) {
            applyTheme(Theme.SYSTEM);
        }
    });
}

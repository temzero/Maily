// store/auth.store.ts
import { createSignal } from "solid-js";
import type { User } from "~/types/user/user.type";
import { initPreferences } from "./preferences.store";
import { mockUsers } from "~/data/user.mock";
import { isDevelopment, isPreviewMode } from "~/lib/env-helpers";
import { initializeEmails } from "./email/email.store";

// Simple signal instead of store
const [user, setUser] = createSignal<User | null>(null);
const [token, setToken] = createSignal<string | null>(null);

// Helper - check localStorage directly
function loadFromStorage() {
  if (typeof window === "undefined") return;

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }
}

// Initialize - call once on app start
export function initAuth() {
  if (typeof window === "undefined") return;

  initPreferences();

  if (isDevelopment()) {
    demoLogin();
    return;
  }

  // Load existing session
  loadFromStorage();
}

// Demo login
export function demoLogin() {
  const demoUser = { ...mockUsers.standard };
  login(demoUser, "demo_token");
  initPreferences();

  console.log('isPreviewMode', isPreviewMode())

  if (isPreviewMode()) {
    initializeEmails();
  }

  return true;
}

// Simple getters
export const isAuthenticated = () => {
  return !!user() && !!token();
};

export const currentUser = () => user();

// Login
export function login(userData: User, authToken: string) {
  setUser(userData);
  setToken(authToken);

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  }
}

// Logout
export function logout() {
  setUser(null);
  setToken(null);

  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

// Simple hook
export function useAuth() {
  return {
    user: user(),
    isAuthenticated: isAuthenticated(),
    login,
    demoLogin,
    logout,
  };
}

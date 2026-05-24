// ~/lib/env-helpers.ts
// Custom environment variables
export const isDevelopment = () => import.meta.env.DEV; // ✅ Built-in, always works
export const isProduction = () => import.meta.env.PROD;
export const isPreviewMode = () => import.meta.env.VITE_IS_PREVIEW_MODE === "true";

// Optional: Get typed env vars
export const getApiUrl = () =>
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Combined helpers
export const shouldUseDemoLogin = () => isPreviewMode() && !isDevelopment();

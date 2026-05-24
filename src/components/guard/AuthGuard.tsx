// components/AuthGuard.tsx
import { useNavigate, useLocation } from "@solidjs/router";
import { isAuthenticated, demoLogin } from "~/store/auth.store";
import { isDevelopment, isPreviewMode } from "~/lib/env-helpers";

export function AuthGuard(props: { children: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Dev mode - auto login
  if (isDevelopment()) {
    demoLogin();
    return <>{props.children}</>;
  }

  const isAuth = isAuthenticated();
  const isAuthPage = location.pathname.startsWith("/auth");

  // Not auth and not on auth page -> redirect
  if (!isAuth && !isAuthPage) {
    const loginPath = isPreviewMode() ? "/auth/demo-login" : "/auth/login";

    // ✅ FIX: Use window.location for hard navigation
    if (typeof window !== "undefined") {
      window.location.href = loginPath;
    }
    return null;
  }

  // Auth but on auth page -> redirect home
  if (isAuth && isAuthPage) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  return <>{props.children}</>;
}

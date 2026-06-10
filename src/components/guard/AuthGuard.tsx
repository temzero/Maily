// components/AuthGuard.tsx
import { useLocation } from "@solidjs/router";
import { isAuthenticated, demoLogin } from "~/store/auth.store";
import { isDevelopment, isPreviewMode } from "~/lib/env-helpers";



export function AuthGuard(props: { children: any }) {
  const location = useLocation();

  // Dev mode - auto login
  // if (isDevelopment()) {
  //   demoLogin();
  //   return <>{props.children}</>;
  // }
  
  const demoPath: string = '/start-demo'
  const loginPath: string = '/auth/login'
  
  const isAuth = isAuthenticated();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isStartDemoPage = location.pathname === demoPath;

  // Not auth, not on auth page, and not on start-demo page -> redirect
  if (!isAuth && !isAuthPage && !isStartDemoPage) {
    const initialPath = isPreviewMode() ? demoPath : loginPath;

    if (typeof window !== "undefined") {
      window.location.href = initialPath;
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
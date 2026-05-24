import "./app.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";
import { Toaster } from "solid-toast";
import { AuthGuard } from "./components/guard/AuthGuard";
import { GlobalContextMenu } from "./components/menu/GlobalContextMenu";
import { GlobalModal } from "./components/modal/GlobalModal";

export default function App() {
  return (
    <>
      <Router
        root={(props) => (
          <Suspense>
            <AuthGuard>{props.children}</AuthGuard>
          </Suspense>
        )}
      >
        <FileRoutes />
      </Router>

      <GlobalModal />

      <GlobalContextMenu />
      <Toaster
        position="top-left"
        containerStyle={{
          "z-index": 99999,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--foreground)",
            color: "var(--background)",
          },
        }}
      />
    </>
  );
}

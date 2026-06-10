import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { demoPath, loginPath } from "~/components/guard/AuthGuard";
import { isPreviewMode } from "~/lib/env-helpers";

export default function AuthIndex() {
  console.log("index");
  const navigate = useNavigate();

  onMount(() => {
    if (isPreviewMode()) {
      navigate(demoPath, { replace: true });
    } else {
      navigate(loginPath, { replace: true });
    }
  });

  return <div>Auth</div>;
}
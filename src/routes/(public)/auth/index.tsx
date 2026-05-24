import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { isPreviewMode } from "~/lib/env-helpers";


export default function AuthIndex() {
  console.log("index");
  const navigate = useNavigate();

  onMount(() => {
    if (isPreviewMode()) {
      navigate("login-demo", { replace: true });
    } else {
      navigate("login", { replace: true });
    }
  });

  return <div>Auth</div>;
}

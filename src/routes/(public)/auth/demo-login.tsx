// routes/auth/login-demo.tsx
import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { demoLogin } from "~/store/auth.store";
import AuthForm from "~/components/auth/AuthForm";
import toast from "solid-toast";

const DemoLogin: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    // Use the demoLogin function from auth store
    const success = demoLogin();

    if (success) {
      toast.success("Demo mode activated! 🎮");
      navigate("/");
    } else {
      toast.error("Demo login failed");
    }

    setLoading(false);
  };

  return (
    <AuthForm
      header="Demo Login"
      button={{
        text: "Start Demo",
        loading: loading(),
        onSubmit: handleSubmit,
      }}
      links={[{ text: "← Back to regular login", href: "/auth/login" }]}
    >
      <div class="opacity-70 text-center text-sm">
        <p>✨ Try the app instantly with a demo account</p>
      </div>
    </AuthForm>
  );
};

export default DemoLogin;

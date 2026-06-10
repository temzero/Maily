// routes/auth/start-demo.tsx
import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { demoLogin } from "~/store/auth.store";
import { useMobile } from '~/hooks/useMobile';
import AuthForm from "~/components/auth/AuthForm";
import toast from "solid-toast";
import Button from "~/components/ui/button/Button";

const BUTTON_TEXT = 'Start Demo';
const BACK_LINK = { text: "Just use Regular Login", href: "/auth/login" };

// Consolidated description with everything included
const Description: Component<{ class?: string }> = (props) => (
  <div class={`text-center space-y-3 ${props.class || ''}`}>
    <h1 class='text-4xl mb-6'>Try Demo</h1>
    <p class='text-sm opacity-70'>
      Experience the future of email with clean envelope interface with AI-powered smart labels.
    </p>
    <p class='text-sm opacity-80'>
      No email • No password • No time limits
    </p>
  </div>
);

const DemoStart: Component = () => {
  const { isMobile } = useMobile();
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    
    const success = demoLogin();

    toast[success ? "success" : "error"](
      success 
        ? "✨ Demo activated! Explore all features freely." 
        : "Unable to start demo. Please try again."
    );

    if (success) {
      navigate("/");
    }

    setLoading(false);
  };

return (
  <>
    {isMobile() ? (
      <div class='w-full h-full flex flex-col justify-between'>
        <div/>
        <Description />
        <Button
          variant="link"
          onClick={() => navigate(BACK_LINK.href)}
          size="sm"
        >
          {BACK_LINK.text}
        </Button>
        <Button
          variant="primary"
          isFullWidth
          rounded="full"
          loading={loading()}
          onClick={handleSubmit}
        >
          {BUTTON_TEXT}
        </Button>
      </div>
    ) : (
      <AuthForm
        button={{
          text: BUTTON_TEXT,
          loading: loading(),
          onSubmit: handleSubmit,
        }}
        links={[BACK_LINK]}
      >
        <Description />
      </AuthForm>
    )}
  </>
);
}

export default DemoStart;
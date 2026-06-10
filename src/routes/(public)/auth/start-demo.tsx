// routes/auth/start-demo.tsx
import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { demoLogin } from "~/store/auth.store";
import { useMobile } from '~/hooks/useMobile';
import AuthForm from "~/components/auth/AuthForm";
import toast from "solid-toast";
import Logo from "~/components/Logo";
import Button from "~/components/ui/button/Button";
import { getActionButtonSize } from "~/utils/button.utils";

const BUTTON_TEXT = 'Start Demo';
const BACK_LINK = { text: "< Back to regular login", href: "/auth/login" };

// Consolidated description with everything included
const Description: Component = () => (
  <div class='text-center space-y-3'>
    <h1 class='text-4xl mb-6'>Try Demo</h1>
    <p class='text-sm opacity-70'>
      Experience the future of email with clean envelope interface with AI-powered smart labels.
    </p>
    <p class='text-sm opacity-80'>
      No email • No password • No time limits
    </p>
  </div>
);

const MobileContent: Component<{ loading: boolean; onSubmit: (e: Event) => void }> = (props) => (
  <>
    <Description />
    <Button
      type="submit"
      variant='primary'
      size="sm"
      rounded='full'
      isFullWidth
      onClick={props.onSubmit}
      disabled={props.loading}
    >
      {BUTTON_TEXT}
    </Button>
  </>
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
    <div 
      class='relative w-full h-screen p-6 flex flex-col items-center justify-between'
      style="background: var(--gradient-bg)"
    >
      <Logo size='xl' class='pt-15' />

      {isMobile() ? (
        <MobileContent loading={loading()} onSubmit={handleSubmit} />
      ) : (
        <AuthForm
          button={{
            text: BUTTON_TEXT,
            loading: loading(),
            onSubmit: handleSubmit,
          }}
          links={[BACK_LINK]}
          class="border-2 border-(--border) rounded-md p-8 bg-(--blackOrWhite) absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Description />
        </AuthForm>
      )}
    </div>
  );
};

export default DemoStart;
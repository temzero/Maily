// routes/forgot-password.tsx
import { Component, createSignal } from 'solid-js';
import AuthForm from '~/components/auth/AuthForm';

const ForgotPassword: Component = () => {
    const [email, setEmail] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [submitted, setSubmitted] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        // Add your forgot password logic here
        console.log('Forgot password:', { email: email() });
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1000);
    };

    if (submitted()) {
        return (
            <div class="max-w-md w-full">
                <div class="space-y-6">
                    <div class="rounded-md bg-green-50 p-4">
                        <div class="flex">
                            <div class="shrink-0">
                                <svg
                                    class="h-5 w-5 text-green-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-green-800">
                                    If an account exists for {email()}, you'll receive a password
                                    reset link shortly.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm text-center">
                        <a href="login" class="font-medium text-blue-600 hover:text-blue-500">
                            Return to sign in
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthForm
            header="Reset your password"
            button={{
                text: 'Send reset link',
                loading: loading(),
                onSubmit: handleSubmit,
            }}
            links={[{ text: 'Back to sign in', href: 'login' }]}
        >
            <div>
                <label for="email" class="sr-only">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    class="auth-input"
                    placeholder="Email address"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                />
            </div>
            <div>
                <p class="text-sm text-center opacity-60">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>
        </AuthForm>
    );
};

export default ForgotPassword;

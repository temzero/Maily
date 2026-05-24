// routes/reset-password.tsx
import { useSearchParams } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import AuthForm from '~/components/auth/AuthForm';

const ResetPassword: Component = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [resetComplete, setResetComplete] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (password() !== confirmPassword()) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);
        // Add your reset password logic here with the token
        const token = searchParams.token;
        console.log('Reset password:', { password: password(), token });
        setTimeout(() => {
            setLoading(false);
            setResetComplete(true);
        }, 1000);
    };

    if (resetComplete()) {
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
                                    Your password has been successfully reset!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm text-center">
                        <a href="login" class="font-medium text-blue-600 hover:text-blue-500">
                            Sign in with your new password
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthForm
            header="Create new password"
            button={{
                text: 'Reset password',
                loading: loading(),
                onSubmit: handleSubmit,
            }}
            links={[{ text: 'Back to sign in', href: 'login' }]}
        >
            <div>
                <p class="text-sm text-center opacity-60 mb-4">
                    Your new password must be different from your previous password.
                </p>
            </div>
            <div>
                <label for="password" class="sr-only">
                    New password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    class="auth-input"
                    placeholder="New password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                />
            </div>
            <div>
                <label for="confirm-password" class="sr-only">
                    Confirm new password
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword()}
                    onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                />
            </div>
        </AuthForm>
    );
};

export default ResetPassword;

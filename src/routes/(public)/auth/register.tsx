// routes/register.tsx
import { Component, createSignal } from 'solid-js';
import AuthForm from '~/components/auth/AuthForm';

const Register: Component = () => {
    const [name, setName] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        // Add your registration logic here
        console.log('Register:', { name: name(), email: email(), password: password() });
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <AuthForm
            header="Create your account"
            button={{
                text: 'Sign up',
                loading: loading(),
                onSubmit: handleSubmit,
            }}
            links={[{ text: 'Already have an account? Sign in', href: 'login' }]}
        >
            <div class="flex gap-2">
                <div>
                    <label for="name" class="sr-only">
                        First name
                    </label>
                    <input
                        id="first-name"
                        type="text"
                        required
                        class="auth-input"
                        placeholder="First name"
                        value={name()}
                        onInput={(e) => setName(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label for="name" class="sr-only">
                        Last name
                    </label>
                    <input
                        id="last-name"
                        type="text"
                        required
                        class="auth-input"
                        placeholder="Last name"
                        value={name()}
                        onInput={(e) => setName(e.currentTarget.value)}
                    />
                </div>
            </div>
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
                <label for="password" class="sr-only">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    class="auth-input"
                    placeholder="Password"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                />
            </div>
            <div>
                <label for="confirm-password" class="sr-only">
                    Confirm password
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    required
                    class="auth-input"
                    placeholder="Confirm password"
                    value={confirmPassword()}
                    onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                />
            </div>
        </AuthForm>
    );
};

export default Register;

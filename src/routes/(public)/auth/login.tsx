// routes/login.tsx
import { Component, createSignal } from 'solid-js';
import AuthForm from '~/components/auth/AuthForm';

const Login: Component = () => {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        // Add your login logic here
        console.log('Login:', { email: email(), password: password() });
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <AuthForm
            header="Sign in"
            button={{
                text: 'Sign in',
                loading: loading(),
                onSubmit: handleSubmit,
            }}
            links={[
                { text: 'Forgot your password?', href: 'forgot-password' },
                { text: "Don't have an account? Sign up", href: 'register' },
            ]}
        >
            <div>
                <div>
                    <label for="email" class="sr-only">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        class="auth-input rounded-b-none!"
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
                        class="auth-input rounded-t-none!"
                        placeholder="Password"
                        value={password()}
                        onInput={(e) => setPassword(e.currentTarget.value)}
                    />
                </div>
            </div>
        </AuthForm>
    );
};

export default Login;

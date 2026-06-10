// routes/register.tsx
import { FaSolidCheck } from 'solid-icons/fa';
import { Component, createSignal } from 'solid-js';
import AuthForm from '~/components/auth/AuthForm';

const Register: Component = () => {
    const [firstName, setFirstName] = createSignal('');
    const [lastName, setLastName] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        // Combine first and last name when submitting
        const fullName = `${firstName()} ${lastName()}`.trim();
        console.log('Register:', { name: fullName, email: email(), password: password() });
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <AuthForm
            header="Create your account"
            button={{
                // text: 'Sign Up',
                icon: <FaSolidCheck size={23} />,
                loading: loading(),
                onSubmit: handleSubmit,
            }}
            links={[{ text: 'く Back to Login', href: 'login' }]}
        >
            <div class="space-y-0.5">
                <div>
                    <label for="first-name" class="sr-only">
                        First name
                    </label>
                    <input
                        id="first-name"
                        type="text"
                        required
                        class="auth-input rounded-b-none!"
                        placeholder="First name"
                        value={firstName()}
                        onInput={(e) => setFirstName(e.currentTarget.value)}
                    />
                </div>
                <div>
                    <label for="last-name" class="sr-only">
                        Last name
                    </label>
                    <input
                        id="last-name"
                        type="text"
                        required
                        class="auth-input rounded-t-none!"
                        placeholder="Last name"
                        value={lastName()}
                        onInput={(e) => setLastName(e.currentTarget.value)}
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
                    placeholder="Email"
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                />
            </div>

            <div class="space-y-0.5">
                <div>
                    <label for="password" class="sr-only">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        class="auth-input rounded-b-none!"
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
                        class="auth-input rounded-t-none!"
                        placeholder="Confirm password"
                        value={confirmPassword()}
                        onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                    />
                </div>
            </div>
        </AuthForm>
    );
};

export default Register;
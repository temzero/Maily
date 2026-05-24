// components/auth/AuthForm.tsx
import { Component, JSX } from 'solid-js';
import Button from '~/components/ui/Button';

interface AuthFormProps {
    header: string;
    button: {
        text: string;
        variant?: 'primary' | 'secondary' | 'outline';
        loading?: boolean;
        onSubmit: (e: Event) => void;
    };
    links?: {
        text: string;
        href: string;
    }[];
    children?: JSX.Element;
}

const AuthForm: Component<AuthFormProps> = (props) => {
    return (
        <div class="max-w-md w-full">
            <h2 class="text-center text-3xl font-extrabold">{props.header}</h2>

            <form class="mt-8 space-y-6" onSubmit={props.button.onSubmit}>
                <div class="rounded-md space-y-2">{props.children}</div>

                <div>
                    <Button
                        type="submit"
                        variant={props.button.variant || 'primary'}
                        size="sm"
                        fullWidth
                        loading={props.button.loading || false}
                    >
                        {props.button.text}
                    </Button>
                </div>

                {props.links && props.links.length > 0 && (
                    <div class="space-y-2 text-sm text-center">
                        {props.links.map((link) => (
                            <div>
                                <a
                                    href={link.href}
                                    class="font-medium text-blue-600  hover:text-blue-500   hover:underline"
                                >
                                    {link.text}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AuthForm;

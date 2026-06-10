// components/auth/AuthForm.tsx
import { Component, JSX } from 'solid-js';
import Button, { ButtonVariant } from '../ui/button/Button';
import { useMobile } from '~/hooks/useMobile';

interface AuthFormProps {
    header?: string;
    button: {
        text?: string;
        icon?: JSX.Element;
        variant?: ButtonVariant;
        loading?: boolean;
        onSubmit: (e: Event) => void;
    };
    links?: {
        text: string;
        href: string;
    }[];
    class?: string;
    children?: JSX.Element;
}

const AuthForm: Component<AuthFormProps> = (props) => {
    return (
        <form class={`max-w-md w-full space-y-6 ${props.class}`} onSubmit={props.button.onSubmit}>
            <h2 class="text-3xl font-bold">{props.header}</h2>

            <div class="rounded-md space-y-3">{props.children}</div>

            <div>
                <Button
                    type="submit"
                    icon={props.button.icon}
                    variant={props.button.variant || 'primary'}
                    size="sm"
                    isFullWidth
                    loading={props.button.loading || false}
                >
                    {props.button.text}
                </Button>
            </div>

            {props.links && props.links.length > 0 && (
                <div class="space-y-3 text-sm text-center">
                    {props.links.map((link) => (
                        <div>
                            <a
                                href={link.href}
                                class="font-medium text-(--primary)  hover:text-blue-500   hover:underline"
                            >
                                {link.text}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
};

export default AuthForm;

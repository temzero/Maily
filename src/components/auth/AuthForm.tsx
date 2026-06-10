import { Component, JSX } from 'solid-js';
import Button, { ButtonVariant } from '../ui/button/Button';
import { useNavigate } from '@solidjs/router';
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
    const navigate = useNavigate();
    const { isMobile } = useMobile();

    return (
        <form class={`max-w-md w-full rounded-md space-y-6 ${isMobile() ? '' : 'bg-(--blackOrWhite) border-2 border-(--border) shadow-xl p-10'} ${props.class}`} 
            onSubmit={props.button.onSubmit}
            >
            {props.header && <h2 class="text-3xl font-bold">{props.header}</h2>}

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
                <div class="flex flex-col gap-1">
                    {props.links.map((link) => (
                        <Button
                            type="button"
                            variant='link'
                            size="xs"
                            class='text-(--primary) hover:text-blue-500 hover:underline'
                            onClick={() => navigate(link.href)}
                        >
                            {link.text}
                        </Button>
                    ))}
                </div>
            )}
        </form>
    );
};

export default AuthForm;
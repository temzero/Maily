import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

export default function HomeIndex() {
    const navigate = useNavigate();

    onMount(() => {
        navigate('/inbox', { replace: true });
    });

    return null;
}

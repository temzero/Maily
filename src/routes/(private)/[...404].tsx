import { A } from '@solidjs/router';
import { MdSharpError } from 'solid-icons/md';
import { AiFillHome } from 'solid-icons/ai';

export default function NotFound() {
    return (
        <main class="relative flex flex-col gap-4 items-center justify-center text-center mx-auto p-4 w-full h-screen bg-linear-to-t from-red-500 to-transparent select-none">
            <div class="flex flex-col gap-4 items-center justify-center text-center opacity-80">
                <MdSharpError size={80} />
                <h1 class="max-6-xs text-6xl font-thin uppercase mb-16">Page Not Found</h1>
            </div>
            <div class="absolute bottom-6 left-0 right-0 flex justify-center">
                <A
                    href="/"
                    class="inline-block p-2 rounded-full hover:scale-150 transition-all"
                >
                    <AiFillHome size={32} />
                </A>
            </div>
        </main>
    );
}
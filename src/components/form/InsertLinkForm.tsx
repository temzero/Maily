// 'use client';

import { createSignal, onCleanup, onMount } from 'solid-js';
import { TbOutlineLinkPlus } from 'solid-icons/tb';
import { Presence, Motion } from 'solid-motionone';

interface InsertLinkFormProps {
    onInsert: (url: string, text?: string) => void;
    onClose: () => void;
    initialUrl?: string;
    initialText?: string;
}

export default function InsertLinkForm(props: InsertLinkFormProps) {
    const [url, setUrl] = createSignal(props.initialUrl || '');
    const [text, setText] = createSignal(props.initialText || '');
    const [error, setError] = createSignal('');
    let urlInputRef: HTMLInputElement | undefined;

    // Handle keyboard events with proper propagation control
    const handleKeyDown = (e: KeyboardEvent) => {
        // Don't process if target is not within this component
        const modalElement = document.querySelector('.insert-link-modal-container');
        if (!modalElement?.contains(e.target as Node)) return;

        // Stop propagation to prevent affecting outside
        if (e.key === 'Escape' || e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
        }

        if (e.key === 'Escape') {
            props.onClose();
        } else if (e.key === 'Enter') {
            handleInsert();
        }
    };

    // Validate and insert link
    const handleInsert = () => {
        const urlValue = url().trim();
        if (!urlValue) {
            setError('Please enter a URL');
            return;
        }

        // Basic URL validation
        try {
            const urlObj = new URL(urlValue);
            if (!urlObj.protocol.startsWith('http')) {
                setError('URL must start with http:// or https://');
                return;
            }
        } catch {
            // Try adding https:// prefix
            try {
                new URL('https://' + urlValue);
                setUrl('https://' + urlValue);
            } catch {
                setError('Please enter a valid URL');
                return;
            }
        }

        props.onInsert(urlValue, text().trim() || undefined);
        props.onClose();
    };

    // Focus the input on mount
    onMount(() => {
        urlInputRef?.focus();
    });

    // Add event listener with capture phase to intercept events early
    document.addEventListener('keydown', handleKeyDown, true);

    // Cleanup event listener
    onCleanup(() => {
        document.removeEventListener('keydown', handleKeyDown, true);
    });

    return (
        <div
            class="insert-link-modal-container fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) props.onClose();
            }}
            onKeyDown={(e) => {
                // Prevent propagation of keyboard events from the backdrop
                e.stopPropagation();
            }}
        >
            <Presence>
                <Motion
                    initial={{ opacity: 0, scale: 1.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.25 }}
                    transition={{ duration: 0.2 }}
                >
                    <div
                        class="flex items-center gap-2 p-4 bg-(--background) text-(--foreground) custom-border rounded-lg shadow-xl w-96 max-w-[90vw]"
                        onKeyDown={(e) => {
                            // Stop propagation from the modal content
                            e.stopPropagation();
                        }}
                    >
                        <div class="flex-1">
                            <input
                                ref={urlInputRef}
                                type="url"
                                value={url()}
                                onInput={(e) => {
                                    setUrl(e.currentTarget.value);
                                    setError('');
                                }}
                                placeholder="https://example.com"
                                class={`w-full px-2 py-1 border-2 rounded-t-md focus:outline-none ${
                                    error() ? 'border-red-500' : 'border-(--border)'
                                }`}
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleInsert();
                                    }
                                }}
                            />

                            <input
                                type="text"
                                value={text()}
                                onInput={(e) => setText(e.currentTarget.value)}
                                placeholder="Link Text (Optional)"
                                class="w-full px-2 py-1 border-2 rounded-b-md border-t-0 border-(--border) focus:outline-none"
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleInsert();
                                    }
                                }}
                            />

                            {error() && <div class="mt-2 text-sm text-red-600">{error()}</div>}
                        </div>

                        <button
                            onClick={handleInsert}
                            class="h-full aspect-square flex items-center justify-center p-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <TbOutlineLinkPlus size={36} />
                        </button>
                    </div>
                </Motion>
            </Presence>
        </div>
    );
}

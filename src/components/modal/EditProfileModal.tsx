// components/modals/EditProfileModal.tsx
import { createSignal, Show, createMemo, onMount } from 'solid-js';
import { useAuth } from '~/store/auth.store';
import Button from '~/components/ui/Button';
import Modal from '~/components/modal/Modal';
import { CloseButton } from '../ui/CloseButton';

interface EditProfileModalProps {
    field: string | null;
    currentValue: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProfileModal(props: EditProfileModalProps) {
    const { updateUser } = useAuth();
    const [value, setValue] = createSignal(props.currentValue);
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

    onMount(() => {
        // Focus when modal is fully mounted
        if (props.isOpen && inputRef) {
            inputRef.focus();
        }
    });

    // Check if value has changed
    const hasChanges = createMemo(() => {
        const currentValue = props.currentValue;
        const newValue = value();

        // Handle array comparison for alternativeEmails
        if (Array.isArray(currentValue) && Array.isArray(newValue)) {
            return JSON.stringify(currentValue) !== JSON.stringify(newValue);
        }

        // Handle string/number comparison
        return currentValue !== newValue;
    });

    const getFieldTitle = () => {
        switch (props.field) {
            case 'bio':
                return 'Edit Bio';
            case 'email':
                return 'Edit Email';
            case 'alternativeEmails':
                return 'Edit Alternative Emails';
            case 'phone':
                return 'Edit Phone';
            case 'company':
                return 'Edit Company';
            case 'jobTitle':
                return 'Edit Job Title';
            case 'timezone':
                return 'Edit Timezone';
            default:
                return 'Edit Field';
        }
    };

    const getFieldPlaceholder = () => {
        switch (props.field) {
            case 'bio':
                return 'Write something about yourself...';
            case 'email':
                return 'Enter your email address';
            case 'alternativeEmails':
                return 'Enter alternative emails (comma separated)';
            case 'phone':
                return 'Enter your phone number';
            case 'company':
                return 'Enter your company name';
            case 'jobTitle':
                return 'Enter your job title';
            case 'timezone':
                return 'Enter your timezone';
            default:
                return 'Enter value';
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let updateData = {};

            switch (props.field) {
                case 'bio':
                    updateData = { bio: value() };
                    break;
                case 'email':
                    updateData = { email: value() };
                    break;
                case 'alternativeEmails':
                    const emails = value()
                        .split(',')
                        .map((e: string) => e.trim());
                    updateData = { alternativeEmails: emails };
                    break;
                case 'phone':
                    updateData = { phone: value() };
                    break;
                case 'company':
                    updateData = { company: value() };
                    break;
                case 'jobTitle':
                    updateData = { jobTitle: value() };
                    break;
                case 'timezone':
                    updateData = { timezone: value() };
                    break;
                default:
                    break;
            }

            await updateUser(updateData);
            props.onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to update');
        } finally {
            setIsLoading(false);
        }
    };

    const renderInput = () => {
        switch (props.field) {
            case 'bio':
                return (
                    <textarea
                        ref={inputRef as HTMLTextAreaElement}
                        value={value()}
                        onInput={(e) => setValue(e.currentTarget.value)}
                        placeholder={getFieldPlaceholder()}
                        rows={5}
                        class="w-full p-1.5 border border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // autofocus
                    />
                );
            case 'alternativeEmails':
                return (
                    <input
                        ref={inputRef as HTMLInputElement}
                        type="text"
                        value={Array.isArray(value()) ? value().join(', ') : value()}
                        onInput={(e) => setValue(e.currentTarget.value)}
                        placeholder={getFieldPlaceholder()}
                        class="w-full p-1.5 border border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // autofocus
                    />
                );
            case 'email':
                return (
                    <input
                        ref={inputRef as HTMLInputElement}
                        type="email"
                        value={value()}
                        onInput={(e) => setValue(e.currentTarget.value)}
                        placeholder={getFieldPlaceholder()}
                        class="w-full p-1.5 border border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // autofocus
                    />
                );
            default:
                return (
                    <input
                        ref={inputRef as HTMLInputElement}
                        type="text"
                        value={value()}
                        onInput={(e) => setValue(e.currentTarget.value)}
                        placeholder={getFieldPlaceholder()}
                        class="w-full p-1.5 border border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // autofocus
                    />
                );
        }
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            {(closeModal: () => void) => (
                <div class="p-4">
                    <h2 class="text-xl font-bold mb-4">{getFieldTitle()}</h2>

                    <CloseButton
                        onClose={closeModal}
                        size={30}
                        iconSize={26}
                        // class="top-1.5! right-1.5!"
                    />

                    <form onSubmit={handleSubmit}>
                        <div class="mb-4">{renderInput()}</div>

                        <Show when={error()}>
                            <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                <p class="text-sm text-red-600 dark:text-red-400">{error()}</p>
                            </div>
                        </Show>

                        <div class="flex justify-end gap-3">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal} // Use Modal's close function
                                disabled={isLoading()}
                            >
                                Cancel
                            </Button> */}
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isLoading()}
                                disabled={!hasChanges()}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    );
}

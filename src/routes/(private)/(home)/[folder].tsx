import { createMemo, For, Show, createSignal } from 'solid-js';
import { useParams } from '@solidjs/router';
import { EmailFolder } from '~/types/email/email.type';
import { Motion, Presence } from 'solid-motionone';
import { mailDimensions } from '~/data/constants';
import { GetEmailsOptions, getGroupedEmailIds, isGroupMarker } from '~/store/email/email.selectors';
import { deleteEmail } from '~/store/email/email.actions';
import { GroupLabel } from '~/components/GroupLabel';
import { getIsDateView } from '~/store/preferences.store';
import EmptyFolder from '~/components/ui/EmptyFolder';
import { getSearchQuery } from '~/store/ui.store';
import { getActiveLabelIds } from '~/store/label.store';
import { EmailListItem } from '~/components/email/EmailListItem';

export default function FolderPage() {
    const params = useParams();
    const folder = createMemo(() => params.folder as EmailFolder);
    const isDateView = createMemo(() => getIsDateView());

    // Track previous state
    let prevIds = new Set<string>();
    let prevFolder = '';
    let prevFilterKey = '';
    const [exitingIds, setExitingIds] = createSignal<Set<string>>(new Set<string>());

    const getOptions = createMemo((): GetEmailsOptions => {
        let options: GetEmailsOptions = {};
        if (params.folder === 'unread') {
            options = {
                folder: EmailFolder.INBOX,
                unreadOnly: true,
                isSpam: false,
                isDeleted: false,
            };
        } else if (folder() === EmailFolder.SPAM) {
            options = { isSpam: true, isDeleted: false };
        } else if (folder() === EmailFolder.TRASH) {
            options = { isDeleted: true };
        } else {
            options = { folder: folder(), isSpam: false, isDeleted: false };
        }
        options.isShortByDate = isDateView() ?? false;
        return options;
    });

    const groupedEmailIds = createMemo(() => getGroupedEmailIds(getOptions()));

    const enteringIds = createMemo(() => {
        const currentFolder = folder();
        const currentOptions = getOptions();
        const searchQuery = getSearchQuery();
        const activeLabels = getActiveLabelIds();

        // Create a unique key for current filters
        const currentFilterKey = JSON.stringify({
            folder: currentFolder,
            isShortByDate: currentOptions.isShortByDate,
            unreadOnly: currentOptions.unreadOnly,
            searchQuery: searchQuery,
            activeLabels: activeLabels.sort(),
        });

        const currentIds = new Set(groupedEmailIds());

        // If folder changed OR filters changed, don't animate entering
        if (currentFolder !== prevFolder || prevFilterKey !== currentFilterKey) {
            prevFolder = currentFolder;
            prevFilterKey = currentFilterKey;
            prevIds = currentIds;
            return new Set<string>(); // No animations on folder or filter change
        }

        // Same folder and filters - check for genuinely new emails
        const newIds = new Set<string>();
        for (const id of currentIds) {
            if (!prevIds.has(id)) {
                // console.log('✨ New email detected (will animate):', id);
                newIds.add(id);
            }
        }

        if (newIds.size === 0) {
            // console.log('📭 No new emails detected');
        }

        prevIds = currentIds;
        return newIds;
    });

    function triggerDelete(id: string) {
        setExitingIds((prev) => new Set([...prev, id]));
    }

    function onMotionComplete(id: string, wasExiting: boolean) {
        if (wasExiting) {
            // console.log('✅ Delete animation complete for:', id);
            deleteEmail(id);

            setExitingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } else {
            // console.log('🎬 Enter animation complete for:', id);
        }
    }

    const AnimatedEmailListItem = (props: { emailId: string }) => {
        const emailId = () => props.emailId;
        const isExiting = () => exitingIds().has(emailId());
        const isEntering = () => enteringIds().has(emailId());

        return (
            <Motion
                initial={isEntering() ? { opacity: 0, x: -mailDimensions.width } : false}
                animate={isExiting() ? { opacity: 0, scale: 0 } : { opacity: 1, x: 0, scale: 1 }}
                transition={{
                    duration: isExiting() ? 0.6 : 1.2,
                    easing: [0.22, 1, 0.36, 1],
                }}
                onMotionComplete={() => onMotionComplete(emailId(), isExiting())}
            >
                <EmailListItem emailId={emailId()} onDelete={() => triggerDelete(emailId())} />
            </Motion>
        );
    };

    return (
        <Presence initial={false}>
            <Show when={groupedEmailIds().length > 0} fallback={<EmptyFolder folder={folder()} />}>
                <div class="flex flex-col items-center justify-center gap-6 w-fit h-fit">
                    <div class="flex flex-col gap-10 w-full">
                        <For each={groupedEmailIds()}>
                            {(item, index) => {
                                if (isGroupMarker(item)) {
                                    // Make NextItems reactive when groupedEmailIds changes
                                    const nextItems = createMemo(() => {
                                        const result = [];
                                        for (
                                            let i = index() + 1;
                                            i < groupedEmailIds().length;
                                            i++
                                        ) {
                                            const nextItem = groupedEmailIds()[i];
                                            if (isGroupMarker(nextItem)) break;
                                            result.push(nextItem);
                                        }
                                        return result;
                                    });

                                    return (
                                        <div class="flex flex-col gap-2">
                                            <GroupLabel marker={item} />
                                            <div class="container-grid">
                                                <For each={nextItems()}>
                                                    {(emailId) => (
                                                        <AnimatedEmailListItem emailId={emailId} />
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            }}
                        </For>
                    </div>
                </div>
            </Show>
        </Presence>
    );
}

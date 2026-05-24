import { BsPinFill } from 'solid-icons/bs';
import { unpinAll } from '~/store/email/email.actions';
import { GroupMarker } from '~/store/email/email.selectors';

export const GroupLabel = (props: { marker: string }) => {
    const isPinned = props.marker === GroupMarker.PINNED;

    // Format the marker text for display
    const getDisplayText = () => {
        if (props.marker === GroupMarker.TODAY) return 'Today';
        if (props.marker === GroupMarker.YESTERDAY) return 'Yesterday';
        if (props.marker === GroupMarker.OLDER) return 'Older';
        if (props.marker.startsWith('<DATE:')) {
            const dateMatch = props.marker.match(/<DATE:(.+)>/);
            return dateMatch ? dateMatch[1] : '';
        }
        return '';
    };

    if (isPinned) {
        return (
            <button
                onclick={unpinAll}
                class="text-red-500 rounded hover:-rotate-15! transition-all w-fit h-fit"
                title="Unpin all"
            >
                <BsPinFill size={32} />
            </button>
        );
    }

    const displayText = getDisplayText();
    if (!displayText) return null;

    return <h1 class="text-2xl">{displayText}</h1>;
};

export function formatRelative(iso: string) {
    const t = new Date(iso).getTime();
    const diffMs = Date.now() - t;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hours ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay} days ago`;

    return formatShortDate(iso);
}

export function formatShortDate(iso: string) {
    const d = new Date(iso);
    // Stable, locale-agnostic-ish formatting for previews.
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const parseDuration = (duration: string): number => {
    const value = parseInt(duration);
    const unit = duration.slice(-1);

    switch (unit) {
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        case 'w':
            return value * 7 * 24 * 60 * 60 * 1000;
        default:
            return 60 * 60 * 1000;
    }
};

export function formatFullDateTime(iso: string): string {
    const date = new Date(iso);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${hours}h${minutes.toString().padStart(2, '0')}`;

    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
    const day = date.getDate();
    const year = date.getFullYear();

    return `${timeString} ${weekday}, ${month} ${day}, ${year}`;
}

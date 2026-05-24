export const getBackgroundStyle = (backgroundColor: string, backgroundUrl?: string) => {
    const isGradient = (color: string) => {
        if (!color) return false;
        return [
            'linear-gradient',
            'radial-gradient',
            'conic-gradient',
            'repeating-linear-gradient',
            'repeating-radial-gradient',
            'repeating-conic-gradient',
        ].some((pattern) => color.includes(pattern));
    };

    const isUrlGradient = backgroundUrl ? isGradient(backgroundUrl) : false;
    const isBgGradient = backgroundColor ? isGradient(backgroundColor) : false;

    if (isBgGradient && !backgroundUrl!)
        return {
            'background-image': backgroundColor,
        };

    return {
        background: isBgGradient ? 'white' : backgroundColor,
        'background-image': backgroundUrl
            ? isUrlGradient
                ? backgroundUrl
                : `url(${backgroundUrl})`
            : 'none',
        'background-size': 'contain',
        'background-blend-mode': 'multiply',
    };
};

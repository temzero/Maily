export const animations = {
    slideUp: {
        initial: { opacity: 0, scale: 0.75, y: 699 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.75, y: 699 },
        transition: {
            type: 'tween',
            ease: [0.4, 0, 0.2, 1],
            duration: 0.3,
        },
    },
    slideDown: {
        initial: { opacity: 0, scale: 0.75, y: -699 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.75, y: -699 },
        transition: {
            type: 'tween',
            ease: [0.4, 0, 0.2, 1],
            duration: 0.3,
        },
    },
    noAnimation: {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0, y: 50 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    },
    zoomIn: {
        initial: { opacity: 0, scale: 1.25 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.25 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    },
    zoomInLight: {
        initial: { opacity: 0, scale: 1.5 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.5 },
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
        },
    },
    zoomOut: {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.5 },
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    },
};

export const getMailLayoutAnimation = (isInit?: boolean, isExit?: boolean) => {
    return {
        initial: isInit !== false ? animations.slideUp.initial : undefined,
        animate: animations.slideUp.animate,
        exit: isExit !== false ? animations.slideUp.exit : { opacity: 0 },
        transition: animations.slideUp.transition,
    };
};

export const getSlideAnimation = (distance: number = 100, duration?: number) => {
    return {
        initial: { y: distance },
        animate: { y: 0 },
        exit: { y: distance },
        transition: duration
            ? {
                  duration: duration,
                  ease: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
              }
            : {
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
              },
    };
};

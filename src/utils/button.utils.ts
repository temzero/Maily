// utils/button.utils.ts
export const getActionButtonSize = (isMobile: () => boolean) => {
    const mobile = isMobile();

    console.log(
        "getActionButtonSize",
        "isMobile =", mobile,
        "result =", mobile ? "md" : "xl"
    );

    return mobile ? "md" : "xl";
};
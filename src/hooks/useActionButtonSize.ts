// hooks/useActionButtonSize.ts
import { createMemo } from "solid-js";
import { useMobile } from "~/hooks/useMobile";

export function useActionButtonSize() {
    const { isMobile } = useMobile();

    return createMemo(() =>
        isMobile() ? "lg" : "xl"
    );
}
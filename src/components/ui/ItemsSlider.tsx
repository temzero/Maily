// components/ui/ItemsSlider.tsx
import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";
import {
  For,
  createSignal,
  createEffect,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { Motion } from "solid-motionone";
import { animations } from "~/utils/animations";

type Props<T> = {
  items: T[];
  currentViewIndex: number;
  onIndexChange: (index: number) => void;
  renderItem: (item: T, index: number) => JSX.Element;
  dotsPosition?: "top" | "bottom";
  sideOpacity?: number;
  sideScale?: number;
  gap?: number;
  showNavButtons?: boolean;
};

export function ItemsSlider<T>(props: Props<T>) {
  const [spacerWidth, setSpacerWidth] = createSignal(0);
  let scrollRef: HTMLDivElement | undefined;

  const sideOpacity = () => props.sideOpacity ?? 1;
  const sideScale = () => props.sideScale ?? 0.75;
  const gap = () => props.gap ?? 160;
  const showNavButtons = () => props.showNavButtons ?? true;

  const scrollToCurrent = (smooth = true) => {
    if (!scrollRef) return;
    const el = scrollRef.children[props.currentViewIndex + 1] as HTMLElement;
    if (!el) return;
    const containerWidth = scrollRef.offsetWidth;
    scrollRef.scrollTo({
      left: el.offsetLeft - (containerWidth - el.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "instant",
    });
  };

  onMount(() => {
    if (!scrollRef) return;
    setSpacerWidth(scrollRef.offsetWidth / 2);
    requestAnimationFrame(() => {
      scrollToCurrent(false);
    });
  });

  createEffect(() => {
    props.currentViewIndex;
    scrollToCurrent(true);
  });

  createEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && props.currentViewIndex > 0) {
        e.preventDefault();
        props.onIndexChange(props.currentViewIndex - 1);
      } else if (
        e.key === "ArrowRight" &&
        props.currentViewIndex < props.items.length - 1
      ) {
        e.preventDefault();
        props.onIndexChange(props.currentViewIndex + 1);
      }
    };
    window.addEventListener("keydown", handler);
    onCleanup(() => window.removeEventListener("keydown", handler));
  });

  return (
    <div class="relative flex items-center justify-center w-full h-full">
      <Motion
        {...animations.zoomInLight}
        class="fixed inset-0 flex items-center justify-center"
      >
        <div
          ref={scrollRef}
          class="flex items-center w-full h-full overflow-x-scroll scrollbar-hidden"
          style={{ gap: `${gap()}px` }}
        >
          <div style={{ "min-width": `${spacerWidth()}px`, flex: "none" }} />

          <For each={props.items}>
            {(item, index) => (
              <div
                onClick={() => props.onIndexChange(index())}
                class="cursor-pointer transition-all duration-300"
                style={{
                  opacity:
                    props.currentViewIndex === index()
                      ? "1"
                      : `${sideOpacity()}`,
                  transform:
                    props.currentViewIndex === index()
                      ? "scale(1)"
                      : `scale(${sideScale()})`,
                }}
              >
                {props.renderItem(item, index())}
              </div>
            )}
          </For>
          <div style={{ "min-width": `${spacerWidth()}px`, flex: "none" }} />
        </div>
      </Motion>

      <Show when={showNavButtons()}>
        <Show when={props.currentViewIndex > 0}>
          <button
            onClick={() => props.onIndexChange(props.currentViewIndex - 1)}
            class="absolute left-4 z-10 h-12 w-12 flex items-center justify-center bg-black/70 backdrop-blur text-white rounded-full shadow-lg"
          >
            <FaSolidChevronLeft size={28} />
          </button>
        </Show>
        <Show when={props.currentViewIndex < props.items.length - 1}>
          <button
            onClick={() => props.onIndexChange(props.currentViewIndex + 1)}
            class="absolute right-4 z-10 h-12 w-12 flex items-center justify-center bg-black/70 backdrop-blur text-white rounded-full shadow-lg"
          >
            <FaSolidChevronRight size={28} />
          </button>
        </Show>
      </Show>

      <Show when={!!props.dotsPosition}>
        <div
          class={`absolute ${props.dotsPosition === "top" ? "top-4" : "bottom-4"} left-0 right-0 flex justify-center gap-2 z-10`}
        >
          <For each={props.items}>
            {(_, index) => (
              <button
                onClick={() => props.onIndexChange(index())}
                class={`h-1.5 rounded-full transition-all ${props.currentViewIndex === index() ? "bg-blue-500 w-3" : "bg-white/50 w-1.5"}`}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

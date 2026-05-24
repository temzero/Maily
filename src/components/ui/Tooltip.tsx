import type { JSX } from "solid-js";

type Props = {
  content: string;
  children: JSX.Element;
};

export default function Tooltip(props: Props) {
  return (
    <span class="relative inline-flex group">
      {props.children}
      <span class="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-xs rounded px-2 py-1">
        {props.content}
      </span>
    </span>
  );
}


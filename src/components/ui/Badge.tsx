type Props = {
  value: number;
};

export default function Badge(props: Props) {
  return (
    <span class="ml-3 inline-flex items-center justify-center rounded-full bg-sky-600 text-white text-xs px-2 py-0.5 min-w-6">
      {props.value}
    </span>
  );
}


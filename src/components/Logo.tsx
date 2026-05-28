import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router"; // or 'solid-start' depending on your router
import { APP_NAME } from "~/data/constants";
import LogoIcon from "~/assets/logo.svg";
import logoIconRaw from "~/assets/logo.svg?raw";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  class?: string;
  showName?: boolean;
  onClick?: (e: MouseEvent) => void;
  preventDefault?: boolean;
}

const sizeMap = {
  sm: { logoIcon: "[&_svg]:w-9! [&_svg]:h-9!", name: "text-lg", gap: "gap-0.5" },
  md: { logoIcon: "[&_svg]:w-12! [&_svg]:h-12!", name: "text-3xl", gap: "gap-1" },
  lg: { logoIcon: "[&_svg]:w-14! [&_svg]:h-14!", name: "text-4xl", gap: "gap-1" },
  xl: { logoIcon: "[&_svg]:w-16! [&_svg]:h-16!", name: "text-5xl", gap: "gap-2" },
};

const Logo: Component<LogoProps> = (props) => {
  const navigate = useNavigate();
  const size = () => props.size ?? "md";
  const showName = () => props.showName ?? true;
  const s = () => sizeMap[size()];

  const handleClick = (e: MouseEvent) => {
    if (props.preventDefault) {
      e.preventDefault();
    }

    if (props.onClick) {
      props.onClick(e);
    } else {
      navigate("/inbox");
    }
  };

  return (
    <div
      onClick={handleClick}
      class={`inline-flex items-center cursor-pointer hover:scale-110 transition-all ${s().gap} ${props.class}`}
    >
        <div
          innerHTML={logoIconRaw}
          class={`flex items-center justify-center ${s().logoIcon} leading-none select-none [&_svg]:block`}
        />
      {/* <img src={LogoIcon} class={`${s().logoIcon} leading-none select-none color-(--foreground)`} alt="mail" /> */}
      {showName() && (
        <span
          style="font-family: 'Lobster', cursive;"
          class={`${s().name} leading-none select-none`}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
};

export default Logo;
export { APP_NAME };
export type { LogoProps };

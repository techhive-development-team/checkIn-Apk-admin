import type { CSSProperties } from "react";

type AnimatedGifIconProps = {
  src: string;
  size?: number;
  className?: string;
};

const AnimatedGifIcon = ({
  src,
  size = 18,
  className = "animated-icon",
}: AnimatedGifIconProps) => {
  const wrapStyle: CSSProperties = { width: size, height: size };

  return (
    <span
      className={`${className}-wrap relative inline-flex shrink-0 items-center justify-center overflow-hidden scale-[0.65] origin-center`}
      style={wrapStyle}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`${className} absolute inset-0 h-full w-full object-contain`}
      />
    </span>
  );
};

export default AnimatedGifIcon;

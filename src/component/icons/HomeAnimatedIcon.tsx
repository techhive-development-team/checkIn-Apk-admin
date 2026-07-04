import AnimatedGifIcon from "./AnimatedGifIcon";
import homeAnimatedIcon from "../../assets/icons/home-animated-transparent.gif";

type HomeAnimatedIconProps = {
  size?: number;
};

const HomeAnimatedIcon = ({ size = 18 }: HomeAnimatedIconProps) => (
  <AnimatedGifIcon src={homeAnimatedIcon} size={size} className="home-icon" />
);

export default HomeAnimatedIcon;

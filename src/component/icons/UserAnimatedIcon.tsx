import AnimatedGifIcon from "./AnimatedGifIcon";
import userAnimatedIcon from "../../assets/icons/user-animated-transparent.gif";

type UserAnimatedIconProps = {
  size?: number;
};

const UserAnimatedIcon = ({ size = 18 }: UserAnimatedIconProps) => (
  <AnimatedGifIcon src={userAnimatedIcon} size={size} className="user-icon" />
);

export default UserAnimatedIcon;

import AnimatedGifIcon from "./AnimatedGifIcon";
import leaveAnimatedIcon from "../../assets/icons/leave-animated-transparent.gif";

type LeaveAnimatedIconProps = {
  size?: number;
};

const LeaveAnimatedIcon = ({ size = 18 }: LeaveAnimatedIconProps) => (
  <AnimatedGifIcon src={leaveAnimatedIcon} size={size} className="leave-icon" />
);

export default LeaveAnimatedIcon;

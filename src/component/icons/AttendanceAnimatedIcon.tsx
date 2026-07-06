import AnimatedGifIcon from "./AnimatedGifIcon";
import attendanceAnimatedIcon from "../../assets/icons/attendance-animated-transparent.gif";

type AttendanceAnimatedIconProps = {
  size?: number;
};

const AttendanceAnimatedIcon = ({ size = 18 }: AttendanceAnimatedIconProps) => (
  <AnimatedGifIcon src={attendanceAnimatedIcon} size={size} className="attendance-icon" />
);

export default AttendanceAnimatedIcon;

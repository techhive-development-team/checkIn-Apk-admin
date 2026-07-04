import AnimatedGifIcon from "./AnimatedGifIcon";
import studentAnimatedIcon from "../../assets/icons/student-animated-transparent.gif";

type StudentAnimatedIconProps = {
  size?: number;
};

const StudentAnimatedIcon = ({ size = 18 }: StudentAnimatedIconProps) => (
  <AnimatedGifIcon src={studentAnimatedIcon} size={size} className="student-icon" />
);

export default StudentAnimatedIcon;

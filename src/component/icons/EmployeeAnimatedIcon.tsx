import AnimatedGifIcon from "./AnimatedGifIcon";
import employeeAnimatedIcon from "../../assets/icons/employee-animated-transparent.gif";

type EmployeeAnimatedIconProps = {
  size?: number;
};

const EmployeeAnimatedIcon = ({ size = 18 }: EmployeeAnimatedIconProps) => (
  <AnimatedGifIcon src={employeeAnimatedIcon} size={size} className="employee-icon" />
);

export default EmployeeAnimatedIcon;

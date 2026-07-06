import AnimatedGifIcon from "./AnimatedGifIcon";
import companyAnimatedIcon from "../../assets/icons/company-animated-transparent.gif";

type CompanyAnimatedIconProps = {
  size?: number;
};

const CompanyAnimatedIcon = ({ size = 18 }: CompanyAnimatedIconProps) => (
  <AnimatedGifIcon src={companyAnimatedIcon} size={size} className="company-icon" />
);

export default CompanyAnimatedIcon;

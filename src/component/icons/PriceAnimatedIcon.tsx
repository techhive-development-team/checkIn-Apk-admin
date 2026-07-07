import AnimatedGifIcon from "./AnimatedGifIcon";
import priceAnimatedIcon from "../../assets/icons/price-animated-transparent.gif";

type PriceAnimatedIconProps = {
  size?: number;
};

const PriceAnimatedIcon = ({ size = 18 }: PriceAnimatedIconProps) => (
  <AnimatedGifIcon src={priceAnimatedIcon} size={size} className="price-icon" />
);

export default PriceAnimatedIcon;

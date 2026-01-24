import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-transparent text-center text-sm text-black">
      <div className="text-center text-medium mt-2">
        Powered by{" "}
        <Link
          to="https://techhive-innovation.io/"
          className="font-semibold text-black underline"
        >
          TechHive Innovation
        </Link>
      </div>{" "}
    </footer>
  );
};

export default Footer;

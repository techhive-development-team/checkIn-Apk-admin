import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  loading = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full py-3 rounded-md font-medium bg-sky-500 text-white hover:bg-sky-600 transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children || label}
    </button>
  );
};

export default Button;

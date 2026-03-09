/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonWhite({
  title,
  to,
  onPress,
  disabled = false,
  className = "",
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onPress) onPress();
    else if (to) navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`py-2 w-full inline-flex items-center justify-center rounded-full px-6 border
        ${
          disabled
            ? "bg-grayscale-200 border-grayscale-300 text-grayscale-400"
            : "bg-neutral-white border-grayscale-300 text-neutral-black hover:bg-grayscale-100"
        }
        ${className}`}
    >
      <span className="text-md font-semibold">{title}</span>
    </button>
  );
}

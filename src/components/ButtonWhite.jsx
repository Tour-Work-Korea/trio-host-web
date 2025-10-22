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
      className={`h-9 w-full inline-flex items-center justify-center rounded-lg px-4 border
        ${
          disabled
            ? "bg-grayscale-200 border-grayscale-300 text-grayscale-400"
            : "bg-white border-grayscale-300 text-neutral-black hover:bg-grayscale-100"
        }
        ${className}`}
    >
      <span className="text-sm font-semibold]">{title}</span>
    </button>
  );
}

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
      className={`py-3 w-full inline-flex items-center justify-center rounded-3xl px-6 border transition-all duration-300
        ${
          disabled
            ? "bg-grayscale-200 border-grayscale-200 text-grayscale-400 cursor-not-allowed"
            : "bg-white border-grayscale-200 text-[17px] font-semibold text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
        }
        ${className}`}
    >
      <span className="text-md font-semibold">{title}</span>
    </button>
  );
}

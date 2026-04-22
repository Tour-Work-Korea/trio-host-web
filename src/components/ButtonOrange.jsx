/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonOrange({
  title,
  to = null,
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
      className={`py-3 w-full inline-flex items-center rounded-3xl px-6 justify-center transition-all duration-300
        text-center text-[17px] font-bold
        ${
          disabled
            ? "bg-grayscale-200 text-grayscale-400 cursor-not-allowed"
            : "bg-[#5361DB] text-neutral-white shadow-lg shadow-[#5361DB]/30 hover:shadow-xl hover:shadow-[#5361DB]/40 hover:-translate-y-0.5 active:scale-[0.98]"
        }
        ${className}`}
    >
      <span
        className={`flex-1 ${disabled ? "text-grayscale-400" : "text-neutral-white"}`}
      >
        {title}
      </span>
    </button>
  );
}

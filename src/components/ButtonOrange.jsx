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
      className={`py-3 w-full inline-flex items-center rounded-full px-6 justify-center
        ${disabled ? "bg-grayscale-200" : "bg-primary-orange hover:opacity-80"}
        ${className}`}
    >
      <span
        className={`flex-1 text-center text-md font-semibold 
        ${disabled ? "text-grayscale-400" : "text-white"}`}
      >
        {title}
      </span>
    </button>
  );
}

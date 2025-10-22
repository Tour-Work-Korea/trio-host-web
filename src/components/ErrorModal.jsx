/* eslint-disable react/prop-types */
import React from "react";
import ButtonOrange from "./ButtonOrange";
import ButtonWhite from "./ButtonWhite";

export default function ErrorModal({
  visible,
  title,
  message,
  buttonText,
  buttonText2 = null,
  onPress,
  onPress2 = null,
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-modal-background flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
    >
      <div className="w-[90%] max-w-md rounded-2xl bg-grayscale-0 p-6 text-center shadow-lg">
        <h2
          id="error-modal-title"
          className="text-lg font-semibold text-grayscale-900"
        >
          {title}
        </h2>

        {message ? (
          <p className="mt-1 text-sm text-grayscale-600 whitespace-pre-line">
            {message}
          </p>
        ) : null}

        {/* 버튼 영역 */}
        {buttonText2 ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* RN 코드 동작 그대로: 첫 버튼이 Scarlet, 두 번째가 White */}
            <ButtonOrange title={buttonText} onPress={onPress} />
            <ButtonWhite title={buttonText2} onPress={onPress2} />
          </div>
        ) : (
          <div className="mt-4">
            <ButtonOrange
              title={buttonText}
              onPress={onPress}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
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
  imgUrl = null,
  onClose = null,
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-modal-background flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-[90%] max-w-md rounded-2xl bg-grayscale-0 p-6 text-center shadow-lg flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2
            id="error-modal-title"
            className="text-lg font-semibold text-grayscale-900 whitespace-pre-line"
          >
            {title}
          </h2>

          {message ? (
            <p className="mt-1 text-sm text-grayscale-600 whitespace-pre-line">
              {message}
            </p>
          ) : null}
        </div>

        {imgUrl && <img src={imgUrl} className="h-20 my-4" />}

        {/* 버튼 영역 */}
        {buttonText2 ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <ButtonWhite title={buttonText2} onPress={onPress2} />
            <ButtonOrange title={buttonText} onPress={onPress} />
          </div>
        ) : (
          <ButtonOrange title={buttonText} onPress={onPress} />
        )}
      </div>
    </div>
  );
}

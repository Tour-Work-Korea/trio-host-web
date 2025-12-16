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
  // ✅ 모달 열리면 뒤(body) 스크롤 막기
  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

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
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="
          w-[90%] max-w-md rounded-2xl bg-grayscale-0 p-6 text-center shadow-lg
          flex flex-col gap-4 items-center
          max-h-[80vh] overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          <h2
            id="error-modal-title"
            className="text-lg font-semibold text-grayscale-900 whitespace-pre-line"
          >
            {title}
          </h2>
        </div>

        {message ? (
          <div
            className="w-full text-sm text-grayscale-600 whitespace-pre-line
                       overflow-y-auto overscroll-contain max-h-[45vh] pr-1"
            // (옵션) 내용 스크롤이 끝났을 때도 뒤로 튀지 않게
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {message}
          </div>
        ) : null}

        {imgUrl && <img src={imgUrl} className="h-20 my-4" alt="" />}

        {/* 버튼 영역 */}
        {buttonText2 ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <ButtonWhite title={buttonText2} onPress={onPress2} />
            <ButtonOrange title={buttonText} onPress={onPress} />
          </div>
        ) : (
          <div className="w-full">
            <ButtonOrange title={buttonText} onPress={onPress} />
          </div>
        )}
      </div>
    </div>
  );
}

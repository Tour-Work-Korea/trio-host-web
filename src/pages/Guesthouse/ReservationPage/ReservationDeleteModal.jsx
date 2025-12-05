/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";
import guesthouseApi from "@api/guesthouseApi";

export default function ReviewDeleteModal({
  visible,
  id,
  onClose = null,
  setErrorModal = null,
}) {
  const [reason, setReason] = useState("");

  if (!visible) return null;

  const deleteReservation = async () => {
    try {
      // TODO : 예약 삭제 api 호출
      // guesthouseApi.deleteReview(id, reason);
      onClose();
    } catch (error) {
      setErrorModal({
        visible: true,
        title: "예약 삭제 요청 실패",
        message:
          error?.response?.data?.message ||
          "예약 삭제 요청 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
          })),
        onPress2: null,
        imgUrl: null,
      });
    }
  };

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
        className="w-[90%] max-w-lg rounded-2xl bg-grayscale-0 p-6 text-center shadow-lg flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex-col flex gap-8">
          <h2
            id="error-modal-title"
            className="text-lg font-semibold text-grayscale-900 whitespace-pre-line"
          >
            리뷰 삭제 요청
          </h2>

          <div>
            <div className="flex items-center justify-between">
              <p className="form-body-label mb-0">삭제 요청 사유</p>
              <span className="text-sm text-gray-400">
                <span className="text-primary-orange">{reason.length}</span>
                /1000
              </span>
            </div>
            <div className="flex-col flex items-end">
              <textarea
                className="form-input mt-2 min-h-[350px]"
                placeholder="리뷰 삭제 요청 사유를 작성해주세요"
                maxLength={1000}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <button
                type="button"
                className="mt-1 text-sm text-gray-400 underline"
                onClick={() => setReason("")}
              >
                다시쓰기
              </button>
            </div>
          </div>

          <ButtonOrange
            title="삭제 요청"
            disabled={reason.length == 0}
            onPress={() => {
              deleteReservation();
            }}
          />
        </div>
      </div>
    </div>
  );
}

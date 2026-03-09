/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";
// import guesthouseApi from "@api/guesthouseApi";

const REASONS = [
  { key: "FACILITY", label: "객실 점검 및 시설 문제" },
  { key: "DUPLICATE", label: "중복 예약으로 인한 불가" },
  { key: "CUSTOMER", label: "고객 요청에 따른 취소" },
  { key: "OTHER", label: "기타(직접 입력)" },
];

export default function ReservationCancelModal({
  visible,
  reservation = null, // 선택: 예약 정보(게스트하우스명, 날짜 등)를 넘겨줄 수 있게
  onClose = null,
  setErrorModal = null,
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (visible) {
      setSelectedReason("");
      setCustomReason("");
    }
  }, [visible]);

  if (!visible) return null;

  const getFinalReasonText = () => {
    if (selectedReason === "OTHER") return customReason.trim();
    const found = REASONS.find((r) => r.key === selectedReason);
    return found?.label ?? "";
  };

  const deleteReservation = async () => {
    const reasonText = getFinalReasonText();
    if (!reasonText) return;

    try {
      // TODO: 예약 취소/삭제 요청 API 연결
      // await guesthouseApi.cancelReservation(id, { reason: reasonText });

      onClose?.();
    } catch (error) {
      setErrorModal?.({
        visible: true,
        title: "예약 취소 요청 실패",
        message:
          error?.response?.data?.message ||
          "예약 취소 요청 중 오류가 발생했습니다.",
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

  const isSubmitDisabled =
    !selectedReason ||
    (selectedReason === "OTHER" && customReason.trim().length === 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-modal-background flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-[90%] max-w-sm rounded-2xl bg-grayscale-0 p-5 text-center shadow-lg flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <span className="flex-1 text-center text-base font-semibold text-grayscale-900">
            예약 취소
          </span>
          <button
            type="button"
            className="text-sm text-grayscale-400"
            onClick={() => onClose?.()}
          >
            ✕
          </button>
        </div>

        {/* 예약 요약 영역 (옵션) */}
        {reservation && (
          <div className="flex gap-3 rounded-xl bg-neutral-gray text-left w-full">
            {reservation.imageUrl && (
              <img
                src={reservation.imageUrl}
                alt="게스트하우스 이미지"
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="flex flex-col gap-1 w-full">
              <p className="font-semibold">{reservation.guesthouseName}</p>
              <p className="">
                {reservation.roomName} · {reservation.roomCapacity}인실
              </p>
              <div className="bg-grayscale-100 w-full flex p-3 rounded-lg items-center justify-between gap-4">
                <div className="w-full font-medium">
                  <p>{reservation.checkInDate}</p>
                  <p className="text-sm text-grayscale-500">
                    {reservation.checkInTime.slice(0, 5)}
                  </p>
                </div>
                <p>~</p>
                <div className="w-full font-medium">
                  <p> {reservation.checkOutDate}</p>
                  <p className="text-sm text-grayscale-500">
                    {reservation.checkOutTime.slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 안내 문구 */}
        <div className="text-left mt-1">
          <p className=" text-grayscale-600 mb-1 font-medium">
            취소 사유를 알려주세요
          </p>
          <p className="text-sm text-grayscale-400">
            선택한 사유는 호스트와 운영팀 확인용으로만 사용돼요.
          </p>
        </div>

        {/* 사유 선택 리스트 */}
        <div className="flex flex-col gap-2 mt-2">
          {REASONS.map((item) => {
            const isActive = selectedReason === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedReason(item.key)}
                className={`w-full rounded-full border px-4 py-2 text-sm ${
                  isActive
                    ? "border-primary-orange text-primary-orange bg-primary-orange/5 font-semibold"
                    : "border-grayscale-200 text-grayscale-700 bg-grayscale-0"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 기타 선택 시 직접 입력 영역 */}
        {selectedReason === "OTHER" && (
          <div className="mt-2 w-full">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-grayscale-600 mb-0 text-left">
                기타 사유를 입력해 주세요
              </p>
              <span className="text-[11px] text-gray-400">
                <span className="text-primary-orange">
                  {customReason.length}
                </span>
                /200
              </span>
            </div>
            <textarea
              className="form-input mt-1 min-h-[80px] text-sm"
              placeholder="예: 고객 일정 변경으로 인한 취소"
              maxLength={200}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-4">
          <ButtonOrange
            title="취소하기"
            disabled={isSubmitDisabled}
            onPress={deleteReservation}
          />
        </div>
      </div>
    </div>
  );
}

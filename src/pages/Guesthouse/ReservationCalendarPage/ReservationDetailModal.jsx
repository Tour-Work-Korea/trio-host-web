/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";
import ReservationDeleteModal from "../ReservationPage/ReservationDeleteModal";

export default function ReservationDetailModal({
  visible,
  reservation = null,
  onClose = null,
  setErrorModal = null,
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const tryDeleteReservation = () => {
    setDeleteModal(true);
  };

  if (!visible) return null;

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
            예약 내역
          </span>
          <button
            type="button"
            className="text-sm text-grayscale-400"
            onClick={() => onClose?.()}
          >
            ✕
          </button>
        </div>

        <div className="flex gap-3 rounded-xl bg-grayscale-50 text-left w-full">
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
                {reservation.checkInDate}
              </div>
              <p>~</p>
              <div className="w-full font-medium">
                {reservation.checkOutDate}
              </div>
            </div>
          </div>
        </div>
        {/* 예약자 정보 */}
        <div className="flex w-full flex-col items-start">
          <p className="font-medium w-full border-b-1 text-left border-grayscale-300 mb-2">
            예약자 정보
          </p>
          <div className="flex flex-col gap-1">
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">이름</p>
              <p className="font-medium">{reservation.userName}</p>
            </div>
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">전화번호</p>
              <p className="font-medium">{reservation.userPhone}</p>
            </div>
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">인원수</p>
              <p className="font-medium">{reservation.guestCount}명</p>
            </div>
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">요청사항</p>
              <p className="font-medium">
                {reservation.requests == "" ? "-" : reservation.requests}
              </p>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="flex w-full flex-col items-start">
          <p className="font-medium w-full border-b-1 text-left border-grayscale-300 mb-2">
            결제 정보
          </p>
          <div className="flex flex-col gap-1">
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">결제 가격</p>
              <p className="font-medium">{reservation.amount}</p>
            </div>
            <div className="w-full grid grid-cols-[100px_1fr] text-left text-sm">
              <p className="text-grayscale-500">결제 수단</p>
              <p className="font-medium">api 추가 후 수정 필요</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-4">
          <ButtonOrange title="취소하기" onPress={tryDeleteReservation} />
        </div>
      </div>

      <ReservationDeleteModal
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        setErrorModal={setErrorModal}
        reservation={reservation}
      />
    </div>
  );
}

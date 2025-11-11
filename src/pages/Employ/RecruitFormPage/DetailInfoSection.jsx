/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";

import XBtn from "@assets/images/x_gray.svg";

export default function DetailInfoSection({
  handleInputChange,
  formData,
  visible,
  onClose,
}) {
  const [recruitDetail, setRecruitDetail] = useState(
    formData.recruitDetail || ""
  );

  // 모달 열릴 때마다 formData 기준으로 내용 동기화
  useEffect(() => {
    if (!visible) return;
    setRecruitDetail(formData.recruitDetail || "");
  }, [visible, formData.recruitDetail]);

  if (!visible) return null;

  const handleApply = () => {
    handleInputChange("recruitDetail", recruitDetail);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-t-3xl px-5 pt-5 pb-6 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-center relative mb-4">
          <span className="text-lg font-semibold">상세 정보</span>
          <button
            type="button"
            className="absolute right-0 p-1"
            onClick={onClose}
          >
            <img src={XBtn} alt="닫기" className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <p className="text-sm text-gray-900">
            알바공고 상세정보를 자유롭게 작성해주세요
          </p>

          {/* 글자 수 */}
          <p className="text-right text-xs text-gray-400">
            <span className="text-primary-orange">
              {recruitDetail.length.toLocaleString()}
            </span>
            /5,000
          </p>

          {/* 상세 내용 textarea */}
          <textarea
            className="w-full min-h-[220px] max-h-[450px] resize-none rounded-2xl border border-gray-200 p-3 text-sm text-gray-800 outline-none focus:border-primary-orange"
            placeholder={`🏡 막내네 게스트하우스에서 스탭을 모집합니다!

안녕하세요 :) 막내네 게스트하우스는 여행자들이 편히 쉬고, 사람들과 자연스럽게 어울릴 수 있는 공간을 만들고자 노력하는 숙소입니다.

주요 업무, 하루 루틴, 함께 일하는 스탭/호스트 분위기 등을 자유롭게 적어 주세요.`}
            maxLength={5000}
            value={recruitDetail}
            onChange={(e) => setRecruitDetail(e.target.value)}
          />

          {/* 다시쓰기 */}
          <button
            type="button"
            className="self-end text-xs text-gray-400 underline mt-1"
            onClick={() => setRecruitDetail("")}
          >
            다시쓰기
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-4">
          <ButtonOrange title="적용하기" onPress={handleApply} />
        </div>
      </div>
    </div>
  );
}

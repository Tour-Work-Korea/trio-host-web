/* eslint-disable react/prop-types */

import React, { useRef } from "react";

export default function DetailInfoSection({
  handleInputChange,
  formData,
  visible,
}) {
  const textareaRef = useRef(null);

  if (!visible) return null;

  const handleChange = (e) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // 높이 리셋
      el.style.height = `${el.scrollHeight}px`; // 내용에 맞게 재설정
    }
    handleInputChange("recruitDetail", e.target.value);
  };
  return (
    <div className="w-full px-5 pt-5 pb-6 flex flex-col">
      {/* 내용 영역 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-md text-gray-900">
            알바공고 상세정보를 자유롭게 작성해주세요
          </p>

          {/* 글자 수 */}
          <p className="text-right text-sm text-gray-400">
            <span className="text-primary-orange">
              {formData.recruitDetail.length.toLocaleString()}
            </span>
            /5,000
          </p>
        </div>

        {/* 상세 내용 textarea */}
        <textarea
          ref={textareaRef}
          className="overflow-y-scroll w-full rounded-xl border max-h-[700px] border-gray-200 p-3 text-md text-gray-800 outline-none focus:border-primary-orange overflow-hidden"
          placeholder={`🏡 막내네 게스트하우스에서 스탭을 모집합니다!

안녕하세요 :) 막내네 게스트하우스는 여행자들이 편히 쉬고, 사람들과 자연스럽게 어울릴 수 있는 공간을 만들고자 노력하는 숙소입니다.

주요 업무, 하루 루틴, 함께 일하는 스탭/호스트 분위기 등을 자유롭게 적어 주세요.`}
          maxLength={5000}
          value={formData.recruitDetail}
          onChange={handleChange}
        />

        {/* 다시쓰기 */}
        <button
          type="button"
          className="self-end text-sm text-gray-400 underline mt-1"
          onClick={() => handleInputChange("recruitShortDescription", "")}
        >
          다시쓰기
        </button>
      </div>
    </div>
  );
}

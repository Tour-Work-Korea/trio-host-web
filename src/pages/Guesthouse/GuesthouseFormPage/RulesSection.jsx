/* eslint-disable react/prop-types */
import React from "react";

import CheckBlue from "@assets/images/check_blue.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";

export default function RulesSection({
  open,
  onToggle,
  valid,
  formData,
  handleInputChange,
}) {
  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">이용 규칙</span>
        {valid ? (
          <img src={CheckBlue} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          <div className="flex items-center justify-between">
            <p className="form-body-label mb-0">
              이용규칙을 작성해주세요
            </p>
            <span className="text-sm text-gray-400">
              <span className="text-primary-orange">
                {formData.rules.length}
              </span>
              /5000
            </span>
          </div>
          <div>
            <textarea
              className="form-input mt-2 min-h-[350px]"
              placeholder="게스트하우스 이용규칙에 대해 자세히 적어주세요"
              maxLength={5000}
              value={formData.rules}
              onChange={(e) => handleInputChange("rules", e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-600 underline"
                onClick={() => handleInputChange("rules", "")}
              >
                다시쓰기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

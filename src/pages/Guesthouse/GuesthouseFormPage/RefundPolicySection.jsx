/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CheckBlue from "@assets/images/check_blue.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import RefundPolicyModal from "./RefundPolicyModal";

export default function RefundPolicySection({
  open,
  onToggle,
  valid,
  formData,
  handleInputChange,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to update specific refund fields
  const handleExtraInfoChange = (value) => {
    handleInputChange("refundExtraInfo", value);
  };

  const handleAddPolicy = (newPolicy) => {
    const currentPolicies = formData.refundPolicies || [];
    // If it already exists, update it, or just append
    const existingIndex = currentPolicies.findIndex(p => p.daysBeforeCheckin === newPolicy.daysBeforeCheckin);
    let newPolicies;
    if (existingIndex >= 0) {
      newPolicies = [...currentPolicies];
      newPolicies[existingIndex] = newPolicy;
    } else {
      newPolicies = [...currentPolicies, newPolicy];
    }
    // Sort by daysBeforeCheckin ascending
    newPolicies.sort((a, b) => a.daysBeforeCheckin - b.daysBeforeCheckin);
    handleInputChange("refundPolicies", newPolicies);
  };

  const handleDeletePolicy = (daysBeforeCheckin) => {
    const newPolicies = (formData.refundPolicies || []).filter(p => p.daysBeforeCheckin !== daysBeforeCheckin);
    handleInputChange("refundPolicies", newPolicies);
  };

  const handleUpdatePolicyPercentage = (daysBeforeCheckin, newPercentage) => {
    let parsed = newPercentage === "" ? "" : Number(newPercentage);
    if (parsed !== "" && parsed < 0) parsed = 0;
    if (parsed !== "" && parsed > 100) parsed = 100;

    const newPolicies = (formData.refundPolicies || []).map(p =>
      p.daysBeforeCheckin === daysBeforeCheckin ? { ...p, refundRate: parsed } : p
    );
    handleInputChange("refundPolicies", newPolicies);
  };

  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">취소 및 환불규정</span>
        {valid ? (
          <img src={CheckBlue} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          {/* 추가 안내사항 (선택) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-800 mb-0">추가 안내사항 (선택)</p>
              <span className="text-sm text-gray-400">
                <span className="text-primary-orange">
                  {(formData.refundExtraInfo || "").length}
                </span>
                /5000
              </span>
            </div>
            <textarea
              className="form-input min-h-[160px]"
              placeholder="취소 및 환불 시 안내할 내용을 작성해주세요"
              maxLength={5000}
              value={formData.refundExtraInfo || ""}
              onChange={(e) => handleExtraInfoChange(e.target.value)}
            />
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-600 underline"
                onClick={() => handleExtraInfoChange("")}
              >
                다시쓰기
              </button>
            </div>
          </div>

          {/* 환불기준 설정 */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-2">환불기준 설정</h3>
            <p className="text-sm text-gray-600 mb-6 break-keep">
              환불기준을 입력해주세요. 해당 기준에 의해 환불 처리 됩니다.
              (설정하시지 않은 날짜는 <span className="text-red-500 font-bold">100% 환불</span> 됩니다.)
            </p>

            <div className="flex flex-col gap-4">
              {/* 방문 당일 고정 */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-base font-medium text-gray-800">방문 당일</span>
                <span className="text-base font-bold text-gray-800">취소 및 환불 불가</span>
              </div>

              {/* 추가된 환불기준 리스트 */}
              {(formData.refundPolicies || []).map((policy) => (
                <div key={policy.daysBeforeCheckin} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-base font-medium text-gray-800 w-24">
                    방문 {policy.daysBeforeCheckin}일전
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-base text-gray-800">총금액의</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-16 border border-gray-200 rounded-xl px-2 py-2 text-center text-gray-900 bg-white focus:border-primary-blue focus:outline-none font-bold"
                      value={policy.refundRate}
                      onChange={(e) => handleUpdatePolicyPercentage(policy.daysBeforeCheckin, e.target.value)}
                      onKeyDown={(e) => {
                        if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <span className="text-base text-gray-800 mr-2">% 환불</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePolicy(policy.daysBeforeCheckin)}
                      className="p-1 text-gray-400 hover:text-primary-blue transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 환불기준 추가 버튼 */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="flex items-center gap-2 text-base font-bold text-gray-800 hover:text-primary-orange transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-6 h-6 rounded-full border-2 border-primary-orange flex items-center justify-center text-primary-orange">
                  <Plus size={16} />
                </div>
                환불기준 추가
              </button>
            </div>
          </div>
        </div>
      )}

      <RefundPolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPolicy}
      />
    </div>
  );
}

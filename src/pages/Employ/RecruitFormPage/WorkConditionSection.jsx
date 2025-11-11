/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import DatePicker from "@components/DatePicker";
import ButtonOrange from "@components/ButtonOrange";

import XBtn from "@assets/images/x_gray.svg";
import Calendar from "@assets/images/calendar_gray.svg";

export default function WorkConditionSection({
  handleInputChange,
  formData,
  visible,
  onClose,
}) {
  // 어떤 필드(입실/퇴실)에 달력을 적용할지
  const [selectedEntryField, setSelectedEntryField] =
    useState("entryStartDate");
  const [showEntryCalendar, setShowEntryCalendar] = useState(false);

  // 로컬 상태 (모달에서만 편집 → 적용하기 눌렀을 때 formData에 반영)
  const [workType, setWorkType] = useState(formData.workType || "");
  const [workDuration, setWorkDuration] = useState(formData.workDuration || "");
  const [entryStartDate, setEntryStartDate] = useState(
    formData.entryStartDate || null
  );
  const [entryEndDate, setEntryEndDate] = useState(
    formData.entryEndDate || null
  );
  const [workPartSelected, setWorkPartSelected] = useState(
    formData.workPart || []
  );
  const [welfareSelected, setWelfareSelected] = useState(
    formData.welfare || []
  );

  // 예시 태그들 (프로젝트에 맞게 수정 가능)
  const workPartOptions = [
    "평일 오전",
    "평일 오후",
    "주말",
    "공휴일",
    "야간",
    "스플릿 근무",
  ];

  const welfareOptions = [
    "숙박 제공",
    "식사 제공",
    "교통비 지원",
    "근무복 제공",
    "휴게시간 보장",
  ];

  // 모달 열릴 때마다 formData 기준으로 동기화
  useEffect(() => {
    if (!visible) return;

    setWorkType(formData.workType || "");
    setWorkDuration(formData.workDuration || "");
    setEntryStartDate(formData.entryStartDate || null);
    setEntryEndDate(formData.entryEndDate || null);
    setWorkPartSelected(
      Array.isArray(formData.workPart) ? formData.workPart : []
    );
    setWelfareSelected(Array.isArray(formData.welfare) ? formData.welfare : []);
  }, [visible, formData]);

  if (!visible) return null;

  const formatDateLabel = (value, placeholder) => {
    if (!value) return placeholder;
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString("ko-KR");
  };

  const toggleArrayValue = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleToggleWorkPart = (value) => {
    setWorkPartSelected((prev) => toggleArrayValue(prev, value));
  };

  const handleToggleWelfare = (value) => {
    setWelfareSelected((prev) => toggleArrayValue(prev, value));
  };

  const handleApply = () => {
    handleInputChange("workType", workType);
    handleInputChange("workDuration", workDuration);
    handleInputChange("entryStartDate", entryStartDate);
    handleInputChange("entryEndDate", entryEndDate);
    handleInputChange("workPart", workPartSelected);
    handleInputChange("welfare", welfareSelected);
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
          <span className="text-lg font-semibold">근무 조건</span>
          <button
            type="button"
            className="absolute right-0 p-1"
            onClick={onClose}
          >
            <img src={XBtn} alt="닫기" className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-6">
          {/* 근무 기간 (입실/퇴실) */}
          <div>
            <p className="text-sm font-semibold mb-2">근무 기간 (입실/퇴실)</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm"
                onClick={() => {
                  setSelectedEntryField("entryStartDate");
                  setShowEntryCalendar(true);
                }}
              >
                <span
                  className={entryStartDate ? "text-gray-900" : "text-gray-400"}
                >
                  {formatDateLabel(entryStartDate, "입실일")}
                </span>
                <img src={Calendar} alt="" className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm"
                onClick={() => {
                  setSelectedEntryField("entryEndDate");
                  setShowEntryCalendar(true);
                }}
              >
                <span
                  className={entryEndDate ? "text-gray-900" : "text-gray-400"}
                >
                  {formatDateLabel(entryEndDate, "퇴실일")}
                </span>
                <img src={Calendar} alt="" className="w-5 h-5" />
              </button>
            </div>

            {showEntryCalendar && (
              <div className="mt-3">
                <DatePicker
                  value={
                    (selectedEntryField === "entryStartDate"
                      ? entryStartDate
                      : entryEndDate) || new Date()
                  }
                  onChange={(date) => {
                    setShowEntryCalendar(false);
                    if (!date) return;
                    if (selectedEntryField === "entryStartDate") {
                      setEntryStartDate(date);
                    } else {
                      setEntryEndDate(date);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* 근무 형태 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">근무 형태</p>
              <p className="text-xs text-gray-400">
                <span className="text-primary-orange">
                  {workType.length.toLocaleString()}
                </span>
                /50
              </p>
            </div>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-orange"
              placeholder="예: 상주 스탭, 파트타임, 단기 스탭 등"
              maxLength={50}
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            />
          </div>

          {/* 근무 기간 요약 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">근무 기간 요약</p>
              <p className="text-xs text-gray-400">
                <span className="text-primary-orange">
                  {workDuration.length.toLocaleString()}
                </span>
                /50
              </p>
            </div>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-orange"
              placeholder="예: 최소 1개월 이상, 3개월 우대 등"
              maxLength={50}
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
            />
          </div>

          {/* 근무 파트 */}
          <div>
            <p className="text-sm font-semibold mb-2">근무 파트</p>
            <div className="flex flex-wrap gap-2">
              {workPartOptions.map((opt) => {
                const selected = workPartSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleWorkPart(opt)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selected
                        ? "bg-primary-orange text-white border-primary-orange"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 복지 */}
          <div>
            <p className="text-sm font-semibold mb-2">복지</p>
            <div className="flex flex-wrap gap-2">
              {welfareOptions.map((opt) => {
                const selected = welfareSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleWelfare(opt)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selected
                        ? "bg-primary-orange text-white border-primary-orange"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 하단 적용하기 버튼 */}
        <div className="mt-5">
          <ButtonOrange title="적용하기" onPress={handleApply} />
        </div>
      </div>
    </div>
  );
}

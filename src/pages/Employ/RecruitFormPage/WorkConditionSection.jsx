/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import DisabledRadioButton from "@assets/images/radio_button_disabled.svg";
import EnabledRadioButton from "@assets/images/radio_button_enabled.svg";

export default function WorkConditionSection({
  handleInputChange,
  formData,
  visible,
}) {
  // 옵션들 -------------------------------------------------
  const [workParts] = useState([
    { id: 1, title: "예약 관리" },
    { id: 2, title: "파티 보조" },
    { id: 3, title: "객실 청소" },
    { id: 4, title: "침구 정리 및 교체" },
    { id: 5, title: "욕실/화장실 청소" },
    { id: 6, title: "간단한 고객 응대" },
    { id: 7, title: "조식 준비 보조" },
    { id: 8, title: "비품 확인 및 정리" },
  ]);
  const WORK_PART_ETC_ID = 9;

  const [welfares] = useState([
    { id: 1, title: "무료 서핑 강습" },
    { id: 2, title: "숙식 제공" },
    { id: 3, title: "스탭 전용 숙소 제공" },
    { id: 4, title: "렌트카 제공" },
    { id: 5, title: "자전거 무료 대여" },
    { id: 6, title: "스쿠터 무료 대여" },
    { id: 7, title: "무료 숙박 제공" },
    { id: 8, title: "BBQ 무제한 참여" },
  ]);
  const WELFARE_ETC_ID = 9;

  const [workDurations] = useState([
    { id: 1, title: "2주 이상" },
    { id: 2, title: "3주 이상" },
    { id: 3, title: "한달 이상" },
    { id: 4, title: "2달 이상" },
  ]);
  const WORK_DURATION_ETC_ID = 5;

  const [selectedWorkParts, setSelectedWorkParts] = useState(
    formData.workPart ?? []
  );
  const [selectedWorkDurations, setSelectedWorkDurations] = useState(
    formData.workDuration ?? []
  );
  const [selectedWelfares, setSelectedWelfares] = useState(
    formData.welfare ?? []
  );

  // 기타 텍스트들
  const [workPartEtcText, setWorkPartEtcText] = useState(() => {
    const etc = formData?.workPart?.find((i) => i.id === WORK_PART_ETC_ID);
    return etc ? etc.title : "";
  });
  const [welfareEtcText, setWelfareEtcText] = useState(() => {
    const etc = formData?.welfare?.find((i) => i.id === WELFARE_ETC_ID);
    return etc ? etc.title : "";
  });

  const isSelectedWorkPartEtc = selectedWorkParts.some(
    (t) => t.id === WORK_PART_ETC_ID
  );
  const isSelectedWelfareEtc = selectedWelfares.some(
    (t) => t.id === WELFARE_ETC_ID
  );

  // 모달 열릴 때마다 formData 기준으로 동기화
  useEffect(() => {
    if (!visible) return;

    setSelectedWorkParts(formData.workPart ?? []);
    const wpEtc = formData?.workPart?.find((i) => i.id === WORK_PART_ETC_ID);
    setWorkPartEtcText(wpEtc ? wpEtc.title : "");

    setSelectedWorkDurations(formData.workDuration ?? []);

    setSelectedWelfares(formData.welfare ?? []);
    const wfEtc = formData?.welfare?.find((i) => i.id === WELFARE_ETC_ID);
    setWelfareEtcText(wfEtc ? wfEtc.title : "");
  }, [visible, formData]);

  // 선택 변경 시 상위 formData로 바로 반영
  useEffect(() => {
    handleInputChange("workPart", selectedWorkParts);
  }, [selectedWorkParts]);

  useEffect(() => {
    handleInputChange("workDuration", selectedWorkDurations);
  }, [selectedWorkDurations]);

  useEffect(() => {
    handleInputChange("welfare", selectedWelfares);
  }, [selectedWelfares]);

  if (!visible) return null;

  const toggleTag = (selected, tag) =>
    selected.some((t) => t.id === tag.id)
      ? selected.filter((t) => t.id !== tag.id)
      : [...selected, tag];

  const handleSelectWorkPart = (tag) => {
    if (tag.id === WORK_PART_ETC_ID) return;
    setSelectedWorkParts((prev) => toggleTag(prev, tag));
  };

  const handleSelectWorkDuration = (tag) => {
    if (tag.id === WORK_DURATION_ETC_ID) return;
    setSelectedWorkDurations((prev) => toggleTag(prev, tag));
  };

  const handleSelectWelfare = (tag) => {
    if (tag.id === WELFARE_ETC_ID) return;
    setSelectedWelfares((prev) => toggleTag(prev, tag));
  };

  const handleToggleWorkPartEtc = () => {
    if (isSelectedWorkPartEtc) {
      setSelectedWorkParts((prev) =>
        prev.filter((t) => t.id !== WORK_PART_ETC_ID)
      );
    } else {
      setSelectedWorkParts((prev) => [
        ...prev,
        { id: WORK_PART_ETC_ID, title: workPartEtcText },
      ]);
    }
  };

  const handleToggleWelfareEtc = () => {
    if (isSelectedWelfareEtc) {
      setSelectedWelfares((prev) =>
        prev.filter((t) => t.id !== WELFARE_ETC_ID)
      );
    } else {
      setSelectedWelfares((prev) => [
        ...prev,
        { id: WELFARE_ETC_ID, title: welfareEtcText },
      ]);
    }
  };

  return (
    <div className="w-full px-5 pt-5 pb-6 flex flex-col">
      {/* 내용 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">
        {/* 근무 형태 (입력형) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-md font-semibold">근무 형태</p>
            <p className="text-sm text-gray-400">
              <span className="text-primary-orange">
                {(formData.workType ?? "").length.toLocaleString()}
              </span>
              /50
            </p>
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-md outline-none focus:border-primary-orange"
            placeholder="예: 상주 스탭, 파트타임, 단기 스탭 등"
            maxLength={50}
            value={formData.workType ?? ""}
            onChange={(e) => handleInputChange("workType", e.target.value)}
          />
        </div>

        {/* 주요 업무 (태그 + 기타) */}
        <div>
          <p className="text-md font-semibold mb-2">주요 업무</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {workParts.map((tag) => {
              const isSelected = selectedWorkParts.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectWorkPart(tag)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    isSelected
                      ? "bg-primary-orange text-white border-primary-orange"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {tag.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleToggleWorkPartEtc}>
              <img
                src={
                  isSelectedWorkPartEtc
                    ? EnabledRadioButton
                    : DisabledRadioButton
                }
                alt="기타 선택"
                className="w-7 h-7"
              />
            </button>
            <textarea
              className="flex-1 min-h-[48px] max-h-[80px] resize-none rounded-xl border border-gray-200 px-3 py-2 text-md outline-none disabled:bg-gray-50"
              placeholder="기타 업무를 입력해주세요."
              maxLength={50}
              value={workPartEtcText}
              onChange={(e) => {
                const text = e.target.value;
                setWorkPartEtcText(text);
                setSelectedWorkParts((prev) =>
                  prev.map((t) =>
                    t.id === WORK_PART_ETC_ID ? { ...t, title: text } : t
                  )
                );
              }}
              disabled={!isSelectedWorkPartEtc}
            />
          </div>
        </div>

        {/* 근무 기간 요약 (태그 + 기타) */}
        <div>
          <p className="text-md font-semibold mb-2">근무 기간 요약</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {workDurations.map((tag) => {
              const isSelected = selectedWorkDurations.some(
                (t) => t.id === tag.id
              );
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectWorkDuration(tag)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    isSelected
                      ? "bg-primary-orange text-white border-primary-orange"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {tag.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 복지 (태그 + 기타) */}
        <div>
          <p className="text-md font-semibold mb-2">복지</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {welfares.map((tag) => {
              const isSelected = selectedWelfares.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectWelfare(tag)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    isSelected
                      ? "bg-primary-orange text-white border-primary-orange"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {tag.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleToggleWelfareEtc}>
              <img
                src={
                  isSelectedWelfareEtc
                    ? EnabledRadioButton
                    : DisabledRadioButton
                }
                alt="기타 선택"
                className="w-7 h-7"
              />
            </button>
            <textarea
              className="flex-1 min-h-[48px] max-h-[80px] resize-none rounded-xl border border-gray-200 px-3 py-2 text-md outline-none disabled:bg-gray-50"
              placeholder="기타 복지 내용을 입력해주세요."
              maxLength={50}
              value={welfareEtcText}
              onChange={(e) => {
                const text = e.target.value;
                setWelfareEtcText(text);
                setSelectedWelfares((prev) =>
                  prev.map((t) =>
                    t.id === WELFARE_ETC_ID ? { ...t, title: text } : t
                  )
                );
              }}
              disabled={!isSelectedWelfareEtc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

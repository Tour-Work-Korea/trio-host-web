/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import DatePicker from "@components/DatePicker";

import Plus from "@assets/images/plus_gray.svg";
import Minus from "@assets/images/minus_gray.svg";
import Calendar from "@assets/images/calendar_gray.svg";
import DisabledRadioButton from "@assets/images/radio_button_disabled.svg";
import EnabledRadioButton from "@assets/images/radio_button_enabled.svg";
import {
  RECRUIT_CONDITION_TAGS,
  RECRUIT_CONDITION_ETC_ID,
} from "@data/recruitOptions";
export default function RecruitConditionSection({
  handleInputChange,
  formData,
  visible,
}) {
  const [showRecruitCalendar, setShowRecruitCalendar] = useState(false);
  const [selectedRecruitField, setSelectedRecruitField] =
    useState("recruitStart");

  const tags = RECRUIT_CONDITION_TAGS;

  const [selectedTags, setSelectedTags] = useState(
    formData.recruitCondition ?? []
  );
  const [etcText, setEtcText] = useState(() => {
    const etc = formData?.recruitCondition?.find(
      (item) => item.id === RECRUIT_CONDITION_ETC_ID
    );
    return etc ? etc.title : "";
  });

  const isSelectedEtc = selectedTags?.some(
    (t) => t.id === RECRUIT_CONDITION_ETC_ID
  );

  // 모달 열릴 때마다 formData 기준으로 태그 동기화
  useEffect(() => {
    setSelectedTags(formData.recruitCondition ?? []);
  }, [visible, formData.recruitCondition]);

  useEffect(() => {
    handleInputChange("recruitCondition", selectedTags);
  }, [selectedTags]);

  if (!visible) return null;

  const handleNumberChange = (field, value) => {
    const num = Number(value.replace?.(/[^\d]/g, "")) || 0;
    handleInputChange(field, num);
  };

  const changeCount = (field, diff) => {
    const curr = Number(formData[field] ?? 0);
    const next = curr + diff;
    handleInputChange(field, next < 0 ? 0 : next);
  };

  const handleSelectTag = (tag) => {
    const isSelected = selectedTags.some((t) => t.title === tag.title);
    if (isSelected) {
      setSelectedTags((prev) => prev.filter((t) => t.title !== tag.title));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleToggleEtc = () => {
    if (isSelectedEtc) {
      setSelectedTags((prev) => prev.filter((t) => t.id !== 7));
    } else {
      setSelectedTags((prev) => [...prev, { id: 7, title: etcText }]);
    }
  };

  const renderDateLabel = (value, placeholder) =>
    value ? new Date(value).toLocaleDateString("ko-KR") : placeholder;

  return (
    <div className="form-body-container">
      {/* 내용 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">
        {/* 모집 기간 */}
        <div>
          <p className="form-body-label">모집 기간</p>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-md"
              onClick={() => {
                if (
                  selectedRecruitField == "recruitStart" &&
                  showRecruitCalendar
                )
                  setShowRecruitCalendar(false);
                else {
                  setSelectedRecruitField("recruitStart");
                  setShowRecruitCalendar(true);
                }
              }}
            >
              <span
                className={
                  formData.recruitStart ? "text-gray-900" : "text-gray-400"
                }
              >
                {renderDateLabel(formData.recruitStart, "시작일자")}
              </span>
              <img src={Calendar} alt="" className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="flex-1 flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-md"
              onClick={() => {
                if (selectedRecruitField == "recruitEnd" && showRecruitCalendar)
                  setShowRecruitCalendar(false);
                else {
                  setSelectedRecruitField("recruitEnd");
                  setShowRecruitCalendar(true);
                }
              }}
            >
              <span
                className={
                  formData.recruitEnd ? "text-gray-900" : "text-gray-400"
                }
              >
                {renderDateLabel(formData.recruitEnd, "마감일자")}
              </span>
              <img src={Calendar} alt="" className="w-5 h-5" />
            </button>
          </div>

          {showRecruitCalendar && (
            <div className="mt-3">
              <DatePicker
                value={formData[selectedRecruitField] ?? new Date()}
                onChange={(date) => {
                  setShowRecruitCalendar(false);
                  if (date) {
                    handleInputChange(selectedRecruitField, date);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* 모집 인원 */}
        <div>
          <p className="form-body-label">모집 인원</p>
          <div className="flex gap-4">
            {/* 여자 */}
            <div className="flex items-center justify-between">
              <span className="w-16 text-md text-gray-600">여자</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberFemale", -1)}
                >
                  <img src={Minus} alt="-" className="w-5 h-5" />
                </button>
                <input
                  className="w-16 h-11 rounded-xl border border-gray-200 text-center text-md outline-none"
                  value={String(formData.recruitNumberFemale ?? 0)}
                  onChange={(e) =>
                    handleNumberChange("recruitNumberFemale", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberFemale", 1)}
                >
                  <img src={Plus} alt="+" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 남자 */}
            <div className="flex items-center justify-between">
              <span className="w-16 text-md text-gray-600">남자</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberMale", -1)}
                >
                  <img src={Minus} alt="-" className="w-5 h-5" />
                </button>
                <input
                  className="w-16 h-11 rounded-xl border border-gray-200 text-center text-md outline-none"
                  value={String(formData.recruitNumberMale ?? 0)}
                  onChange={(e) =>
                    handleNumberChange("recruitNumberMale", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberMale", 1)}
                >
                  <img src={Plus} alt="+" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 성별무관 */}
            <div className="flex items-center justify-between">
              <span className="w-16 text-md text-gray-600">성별무관</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberNoGender", -1)}
                >
                  <img src={Minus} alt="-" className="w-5 h-5" />
                </button>
                <input
                  className="w-16 h-11 rounded-xl border border-gray-200 text-center text-md outline-none"
                  value={String(formData.recruitNumberNoGender ?? 0)}
                  onChange={(e) =>
                    handleNumberChange("recruitNumberNoGender", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitNumberNoGender", 1)}
                >
                  <img src={Plus} alt="+" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 나이 */}
        <div>
          <p className="form-body-label">나이</p>
          <div className="flex gap-4">
            {/* 최소 */}
            <div className="flex items-center justify-between">
              <span className="w-16 text-md text-gray-600">최소</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitMinAge", -1)}
                >
                  <img src={Minus} alt="-" className="w-5 h-5" />
                </button>
                <input
                  className="w-16 h-11 rounded-xl border border-gray-200 text-center text-md outline-none"
                  value={String(formData.recruitMinAge ?? 0)}
                  onChange={(e) =>
                    handleNumberChange("recruitMinAge", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitMinAge", 1)}
                >
                  <img src={Plus} alt="+" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 최대 */}
            <div className="flex items-center justify-between">
              <span className="w-16 text-md text-gray-600">최대</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitMaxAge", -1)}
                >
                  <img src={Minus} alt="-" className="w-5 h-5" />
                </button>
                <input
                  className="w-16 h-11 rounded-xl border border-gray-200 text-center text-md outline-none"
                  value={String(formData.recruitMaxAge ?? 0)}
                  onChange={(e) =>
                    handleNumberChange("recruitMaxAge", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                  onClick={() => changeCount("recruitMaxAge", 1)}
                >
                  <img src={Plus} alt="+" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 우대 조건 (태그 + 기타) */}
        <div>
          <p className="form-body-label">우대 조건</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => {
              const isSelected = selectedTags.some(
                (t) => t.title === tag.title
              );
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className={`form-hashtag ${
                    isSelected && "form-hashtag-selected"
                  }`}
                >
                  {tag.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleToggleEtc}>
              <img
                src={isSelectedEtc ? EnabledRadioButton : DisabledRadioButton}
                alt="기타 선택"
                className="w-7 h-7"
              />
            </button>
            <input
              className="form-input disabled:bg-gray-50"
              placeholder="기타 입력"
              maxLength={50}
              value={etcText}
              onChange={(e) => {
                const text = e.target.value;
                setEtcText(text);
                setSelectedTags((prev) =>
                  prev.map((t) =>
                    t.id === RECRUIT_CONDITION_ETC_ID
                      ? { ...t, title: text }
                      : t
                  )
                );
              }}
              disabled={!isSelectedEtc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

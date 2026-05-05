/* eslint-disable react/prop-types */
import React from "react";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import { handleSearchAddress } from "@utils/searchAddress";

export default function InfoSection({
  open,
  onToggle,
  valid,
  formData,
  handleInputChange,
  handleTimeChange,
  displayTimeHHMM,
  guesthouseTags,
  toggleTag,
}) {
  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">기본 정보</span>
        {valid ? (
          <img src={CheckOrange} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          <div className="flex flex-col gap-6">
            {/* 이름 */}
            <div>
              <p className="form-body-label">게스트하우스 이름</p>
              <input
                type="text"
                className="form-input"
                placeholder="게스트하우스 이름을 입력해 주세요"
                value={formData.guesthouseName}
                maxLength={50}
                onChange={(e) =>
                  handleInputChange("guesthouseName", e.target.value)
                }
              />
            </div>

            {/* 주소 -> 위치 */}
            <div>
              <div className="mb-2">
                <p className="form-body-label" style={{ marginBottom: "4px" }}>위치</p>
                <p className="text-sm text-grayscale-400 leading-snug">
                  도로명 주소 또는 지번 주소를 정확히 입력해주세요.<br />
                  (지도에서 검색 가능한 주소)
                </p>
              </div>
              <div className="relative mb-2">
                <input
                  type="text"
                  className="form-input pr-24"
                  placeholder="도로명 또는 지번 주소를 입력해 주세요"
                  value={formData.guesthouseAddress}
                  onChange={(e) =>
                    handleInputChange("guesthouseAddress", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-blue text-white text-sm font-semibold rounded-full"
                  onClick={() =>
                    handleSearchAddress((addr) =>
                      handleInputChange("guesthouseAddress", addr)
                    )
                  }
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="상세 주소를 입력해 주세요"
                value={formData.guesthouseDetailAddress}
                onChange={(e) =>
                  handleInputChange("guesthouseDetailAddress", e.target.value)
                }
              />
            </div>

            {/* 전화번호 */}
            <div>
              <p className="form-body-label">전화번호</p>
              <input
                type="tel"
                className="form-input"
                placeholder="전화번호를 입력해 주세요"
                value={formData.guesthousePhone}
                maxLength={20}
                onChange={(e) =>
                  handleInputChange("guesthousePhone", e.target.value)
                }
              />
            </div>

            {/* 체크인/체크아웃 */}
            <div>
              <p className="form-body-label mb-4">체크인 / 체크아웃</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <p className="w-20 text-grayscale-600 font-semibold text-sm">체크인</p>
                  <input
                    type="time"
                    className="form-input flex-1"
                    value={displayTimeHHMM(formData.checkIn)}
                    onChange={(e) =>
                      handleTimeChange("checkIn", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center">
                  <p className="w-20 text-grayscale-600 font-semibold text-sm">체크아웃</p>
                  <input
                    type="time"
                    className="form-input flex-1"
                    value={displayTimeHHMM(formData.checkOut)}
                    onChange={(e) =>
                      handleTimeChange("checkOut", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div>
              <p className="form-body-label">
                태그로 게스트하우스 특징을 알려주세요
              </p>
              <p className="text-sm text-gray-400 mb-2">
                최대 3개까지 선택할 수 있어요
              </p>
              <div className="bg-grayscale-50 p-6 rounded-2xl grid grid-cols-3 gap-y-6">
                {guesthouseTags.map((tag) => {
                  const selected = formData.hashtagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`text-center font-medium transition-colors ${
                        selected ? "text-primary-orange" : "text-grayscale-400 hover:text-grayscale-600"
                      }`}
                    >
                      {tag.title ?? tag.hashtag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

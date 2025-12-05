/* eslint-disable react/prop-types */
import React from "react";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";

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
          <div className="flex flex-col gap-4">
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

            {/* 주소 */}
            <div>
              <p className="form-body-label">주소</p>
              <input
                type="text"
                className="form-input mb-2"
                placeholder="도로명 또는 지번 주소를 입력해 주세요"
                value={formData.guesthouseAddress}
                onChange={(e) =>
                  handleInputChange("guesthouseAddress", e.target.value)
                }
              />
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

            {/* 체크인/체크아웃 */}
            <div>
              <p className="form-body-label">체크인 / 체크아웃</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">체크인</p>
                  <input
                    type="time"
                    className="form-input"
                    value={displayTimeHHMM(formData.checkIn)}
                    onChange={(e) =>
                      handleTimeChange("checkIn", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">체크아웃</p>
                  <input
                    type="time"
                    className="form-input"
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
              <div className="flex flex-wrap gap-2">
                {guesthouseTags.map((tag) => {
                  const selected = formData.hashtagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`form-hashtag ${
                        selected ? "form-hashtag-selected" : ""
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

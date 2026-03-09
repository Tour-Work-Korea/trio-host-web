/* eslint-disable react/prop-types */
import React from "react";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import StarFilled from "@assets/images/star_filled.svg";
import StarEmpty from "@assets/images/star_white.svg";
import XBtn from "@assets/images/x_gray.svg";
import ImageDropzone from "@components/ImageDropzone";

export default function IntroSummarySection({
  open,
  onToggle,
  valid,
  formData,
  handleImagesUploaded,
  handleImageUploadError,
  setThumbnail,
  deleteImage,
  handleInputChange,
}) {
  return (
    <div className="form-section-box">
      <button type="button" className="form-title-box" onClick={onToggle}>
        <span className="form-title-text">소개 요약</span>
        {valid ? (
          <img src={CheckOrange} width={24} height={24} alt="완료" />
        ) : (
          <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
        )}
      </button>

      {open && (
        <div className="form-body-container">
          {/* 배너 이미지 */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="form-body-label mb-0">배너 사진</p>
              <span className="text-sm text-gray-400">
                <span className="text-primary-orange">
                  {formData.guesthouseImages.length}
                </span>
                /10
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              대표로 보여줄 사진을 선택해 주세요. 별모양을 클릭해 대표 사진을
              선택할 수 있어요.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <div className="w-40">
                <ImageDropzone
                  label="배너 사진 업로드"
                  accept="image/*"
                  sensitive={false}
                  maxCount={10}
                  currentCount={formData.guesthouseImages.length}
                  disabled={formData.guesthouseImages.length >= 10}
                  onUploaded={handleImagesUploaded}
                  onError={handleImageUploadError}
                />
              </div>

              {formData.guesthouseImages.map((img, index) => (
                <div
                  key={index}
                  className="relative h-40 w-40 overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={img.previewUrl || img.serverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {img.isThumbnail && (
                    <div className="absolute left-2 top-2 rounded-full bg-neutral-white px-1">
                      <img src={StarFilled} width={20} height={20} />
                    </div>
                  )}
                  {!img.isThumbnail && (
                    <button
                      type="button"
                      className="absolute left-2 top-2 rounded-full px-1 bg-neutral-white"
                      onClick={() => setThumbnail(index)}
                    >
                      <img src={StarEmpty} width={20} height={20} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-full bg-neutral-white px-1"
                    onClick={() => deleteImage(index)}
                  >
                    <img src={XBtn} width={20} height={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 짧은 소개 */}
          <div>
            <div className="flex items-center justify-between">
              <p className="form-body-label mb-0">
                게스트하우스를 간략하게 소개해 주세요
              </p>
              <span className="text-sm text-gray-400">
                <span className="text-primary-orange">
                  {formData.guesthouseShortIntro.length}
                </span>
                /1000
              </span>
            </div>
            <textarea
              className="form-input mt-2 min-h-[350px]"
              placeholder="게스트하우스 소개를 입력해 주세요"
              maxLength={1000}
              value={formData.guesthouseShortIntro}
              onChange={(e) =>
                handleInputChange("guesthouseShortIntro", e.target.value)
              }
            />
            <button
              type="button"
              className="mt-1 text-sm text-gray-400 underline"
              onClick={() => handleInputChange("guesthouseShortIntro", "")}
            >
              다시쓰기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

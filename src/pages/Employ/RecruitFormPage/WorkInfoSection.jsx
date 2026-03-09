/* eslint-disable react/prop-types */
import React, { useState } from "react";
import ErrorModal from "@components/ErrorModal";
import ImageDropzone from "@components/ImageDropzone";
import XBtn from "@assets/images/x_gray.svg";

export default function WorkInfoSection({
  formData,
  visible,
  handleInputChange,
}) {
  const limitImage = 6;

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
  });

  const images = formData?.recruitImage ?? [];

  // 드롭존에서 "업로드 완료된 url 리스트"를 넘겨줌
  const handleUploaded = (urls) => {
    const current = [...images];
    urls.forEach((url) => {
      const isFirst = current.length === 0;
      current.push({
        recruitImageUrl: url,
        isThumbnail: isFirst,
      });
    });
    handleInputChange("recruitImage", current);
  };

  const handleDropzoneError = (message) => {
    setErrorModal({
      visible: true,
      title: message,
    });
  };

  // 대표 썸네일 설정 (하나만 true)
  const setThumbnail = (index) => {
    const next = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index,
    }));
    handleInputChange("recruitImage", next);
  };

  // 사진 삭제
  const removePhoto = (index) => {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((img) => img.isThumbnail)) {
      next[0] = { ...next[0], isThumbnail: true };
    }

    handleInputChange("recruitImage", next);
  };

  if (!visible) return null;

  return (
    <div className="form-body-container">
      {/* 내용 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상단 텍스트 + 남은 개수 */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <p className="text-sm font-semibold">근무지 사진을 추가해주세요</p>
          <p className="text-xs text-gray-400 text-right">
            <span className="text-primary-orange">{images.length}</span>/
            {limitImage}
          </p>
        </div>

        {/* 업로드 영역 */}
        <div className="mb-6 ">
          <ImageDropzone
            label="근무지 사진 업로드 (클릭 또는 드래그)"
            accept="image/*"
            maxCount={limitImage}
            currentCount={images.length}
            disabled={images.length >= limitImage}
            onUploaded={handleUploaded}
            onError={handleDropzoneError}
          />
        </div>

        {/* 사진 리스트 */}
        <div className="flex flex-wrap gap-4">
          {images.map((imageObj, index) => {
            const isThumb = imageObj.isThumbnail;
            return (
              <div
                key={index}
                className="relative cursor-pointer"
                onClick={() => setThumbnail(index)}
              >
                <img
                  src={imageObj.recruitImageUrl}
                  alt={`근무지 사진 ${index + 1}`}
                  className={`w-[150px] h-[150px] rounded-xl bg-gray-100 object-cover border ${
                    isThumb
                      ? "border-2 border-primary-orange"
                      : "border-gray-200"
                  }`}
                />

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  className="absolute top-1.5 right-1.5 bg-gray-100 rounded-full p-1 flex items-center justify-center hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation(); // 썸네일 클릭 이벤트와 분리
                    removePhoto(index);
                  }}
                >
                  <img src={XBtn} width={14} height={14} />
                </button>

                {/* 썸네일 뱃지 (선택 사항) */}
                {isThumb && (
                  <span className="absolute bottom-1.5 left-1.5 text-xs px-2 py-0.5 rounded-full bg-primary-orange text-neutral-white">
                    대표
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 에러 모달 */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={null}
        buttonText="확인"
        buttonText2={null}
        onPress={() =>
          setErrorModal((prev) => ({
            ...prev,
            visible: false,
            title: "",
          }))
        }
        onPress2={null}
        imgUrl={null}
      />
    </div>
  );
}

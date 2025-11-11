/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { uploadMultiImage } from "@utils/imageUpload";
import ErrorModal from "@components/ErrorModal";

import Gray_ImageAdd from "@assets/images/add_image_gray.svg";
import XBtn from "@assets/images/x_gray.svg";

export default function WorkInfoSection({
  formData,
  visible,
  onClose,
  handleInputChange,
}) {
  const limitImage = 6;
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
  });

  const images = formData?.recruitImage ?? [];

  // 사진 추가
  const pickImage = async () => {
    const limit = limitImage - images.length;
    if (limit <= 0) {
      setErrorModal({
        visible: true,
        title: `최대 ${limitImage}장까지 등록 가능합니다.`,
      });
      return;
    }

    try {
      // RN과 동일하게 limit만 넘겨서 util이 내부에서 선택/업로드하도록 가정
      const uploadedUrls = await uploadMultiImage(limit);
      if (!uploadedUrls?.length) return;

      const baseLen = images.length;
      const newImages = uploadedUrls.map((url, idx) => ({
        recruitImageUrl: url,
        // 처음 등록되는 이미지가 썸네일이 되도록
        isThumbnail: baseLen === 0 && idx === 0,
      }));

      handleInputChange("recruitImage", [...images, ...newImages]);
    } catch (e) {
      setErrorModal({
        visible: true,
        title: "이미지 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  // 사진 삭제
  const removePhoto = (index) => {
    const next = images.filter((_, i) => i !== index);

    // 하나 이상 남아 있고, 썸네일이 하나도 없으면 첫 번째를 썸네일로
    if (next.length > 0 && !next.some((img) => img.isThumbnail)) {
      next[0] = { ...next[0], isThumbnail: true };
    }

    handleInputChange("recruitImage", next);
  };

  if (!visible) return null;

  return (
    <div className="w-full px-5 pt-5 pb-6 flex flex-col">
      {/* 내용 */}
      <div className="flex-1 overflow-y-auto">
        {/* 상단 텍스트 + 남은 개수 */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <p className="text-sm font-semibold">근무지 사진을 추가해주세요</p>
          <p className="text-xs text-gray-400 text-right">
            <span className="text-primary-orange">
              {limitImage - images.length}
            </span>
            /{limitImage}
          </p>
        </div>

        {/* 사진 추가 버튼 */}
        <button
          type="button"
          className="w-[100px] h-[100px] mb-10 flex items-center justify-center border border-gray-200 bg-gray-100 rounded"
          onClick={pickImage}
          disabled={images.length === limitImage}
        >
          <img src={Gray_ImageAdd} width={30} height={30} />
        </button>

        {/* 사진 리스트 */}
        <div className="flex flex-wrap gap-4">
          {images.map((imageObj, index) => (
            <div key={index} className="relative">
              <img
                src={imageObj.recruitImageUrl}
                alt={`근무지 사진 ${index + 1}`}
                className={`w-[100px] h-[100px] border rounded bg-gray-100 object-cover ${
                  imageObj.isThumbnail
                    ? "border-primary-blue"
                    : "border-gray-200"
                }`}
              />
              <button
                type="button"
                className="absolute top-1.5 right-1.5 bg-gray-100 rounded-full p-1 flex items-center justify-center"
                onClick={() => removePhoto(index)}
              >
                <img src={XBtn} width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 업로드 에러 모달 */}
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

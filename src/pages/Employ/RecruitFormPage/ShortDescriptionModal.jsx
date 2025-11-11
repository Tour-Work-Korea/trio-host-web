/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import ErrorModal from "@components/ErrorModal";
import employApi from "@api/employApi";

export default function ShortDescriptionModal({
  handleInputChange,
  formData,
  visible,
}) {
  const [tags, setTags] = useState([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
  });
  const textareaRef = useRef(null);

  // 해시태그 목록 조회
  useEffect(() => {
    const fetchHostHashtags = async () => {
      try {
        const res = await employApi.getHostHashtags();
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setTags(list);
      } catch (error) {
        setErrorModal({
          visible: true,
          title:
            error?.response?.data?.message || "해시태그 조회에 실패했습니다.",
          message: null,
        });
      }
    };
    fetchHostHashtags();
  }, []);

  if (!visible) return null;

  const selectedHashtags = formData.hashtags ?? [];

  const handleTagToggle = (tagId, isSelected) => {
    if (!isSelected && selectedHashtags.length >= 3) {
      setErrorModal({
        visible: true,
        title: "해시태그는 최대 3개까지 선택 가능해요",
        message: null,
      });
      return;
    }

    const updatedHashtags = isSelected
      ? selectedHashtags.filter((id) => id !== tagId)
      : [...selectedHashtags, tagId];

    handleInputChange("hashtags", updatedHashtags);
  };

  const handleChange = (e) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // 높이 리셋
      el.style.height = `${el.scrollHeight}px`; // 내용에 맞게 재설정
    }
    handleInputChange("recruitShortDescription", e.target.value);
  };
  return (
    <>
      <div className="form-body-container">
        {/* 내용 스크롤 영역 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 한 줄 요약 */}
          <div className="flex flex-col gap-2">
            <p className="form-body-label">한 줄 요약</p>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">
                공고를 대표할 한 줄 설명을 작성해 주세요.
              </p>

              <p className="text-right text-sm text-gray-400">
                <span className="text-primary-orange">
                  {formData.recruitShortDescription.length.toLocaleString()}
                </span>
                /1,000
              </p>
            </div>
            <textarea
              ref={textareaRef}
              className="form-input-textarea"
              placeholder="성실함과 책임감을 가지고 모든 일에 임하는 사람을 구해요."
              maxLength={1000}
              value={formData.recruitShortDescription}
              onChange={handleChange}
            />

            <button
              type="button"
              className="self-end text-sm text-gray-500 underline"
              onClick={() => handleInputChange("recruitShortDescription", "")}
            >
              다시쓰기
            </button>
          </div>

          {/* 태그 선택 */}
          <div className="flex flex-col gap-2">
            <p className="form-body-label">태그</p>
            <p className="text-sm text-primary-blue">
              태그로 공고를 눈에 띄게 나타내보세요! (최대 3개)
            </p>

            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => {
                const isSelected = selectedHashtags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id, isSelected)}
                    className={`form-hashtag ${
                      isSelected && "form-hashtag-selected"
                    }`}
                  >
                    {tag.hashtag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        buttonText="확인"
        buttonText2={null}
        onPress={() => setErrorModal((prev) => ({ ...prev, visible: false }))}
        onPress2={null}
        imgUrl={null}
      />
    </>
  );
}

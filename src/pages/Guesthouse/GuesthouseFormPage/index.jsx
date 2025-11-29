/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";

import guesthouseApi from "@api/guesthouseApi"; // 경로는 프로젝트에 맞게 수정
import {
  publicFacilities,
  roomFacilities,
  services,
} from "@data/guesthouseOptions";
import { guesthouseTags } from "@data/guesthouseTags";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";
import DisabledRadioButton from "@assets/images/radio_button_disabled.svg";
import EnabledRadioButton from "@assets/images/radio_button_enabled.svg";
import StarFilled from "@assets/images/star_filled.svg";
import StarEmpty from "@assets/images/star_white.svg";
import XBtn from "@assets/images/x_gray.svg";
import ImageDropzone from "../../../components/ImageDropzone";
// ===== 유틸 =====
const isNonEmpty = (v) =>
  (typeof v === "string" && v.trim().length > 0) ||
  (typeof v === "number" && !Number.isNaN(v));

const hasThumb = (arr = []) =>
  Array.isArray(arr) && arr.some((i) => i?.isThumbnail === true);

const normalizeTimeToHHMMSS = (value) => {
  if (!value) return "";
  if (value.length === 5) return `${value}:00`;
  return value;
};

const displayTimeHHMM = (value) => {
  if (!value) return "";
  return value.slice(0, 5);
};

const computeValidSections = (formData) => {
  const {
    applicationId,
    guesthouseName,
    guesthouseAddress,
    guesthousePhone,
    checkIn,
    checkOut,
    hashtagIds,
    guesthouseShortIntro,
    guesthouseImages,
    guesthouseLongDesc,
    rules,
    amenities,
  } = formData;

  const postRegister = Boolean(applicationId);
  const info =
    isNonEmpty(guesthouseName) &&
    isNonEmpty(guesthouseAddress) &&
    isNonEmpty(guesthousePhone) &&
    isNonEmpty(checkIn) &&
    isNonEmpty(checkOut) &&
    Array.isArray(hashtagIds) &&
    hashtagIds.length > 0;

  const introSummary =
    isNonEmpty(guesthouseShortIntro) &&
    Array.isArray(guesthouseImages) &&
    guesthouseImages.length > 0 &&
    hasThumb(guesthouseImages);

  const detailInfo = isNonEmpty(guesthouseLongDesc);
  const rulesValid = isNonEmpty(rules);
  const amenitiesValid = Array.isArray(amenities) && amenities.length > 0;

  return {
    postRegister,
    info,
    introSummary,
    detailInfo,
    rules: rulesValid,
    amenities: amenitiesValid,
  };
};

export default function GuesthouseForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicationId: null,
    guesthouseName: "",
    guesthouseAddress: "",
    guesthouseDetailAddress: "",
    guesthousePhone: "",
    checkIn: "15:00:00",
    checkOut: "11:00:00",
    guesthouseShortIntro: "",
    guesthouseLongDesc: "",
    guesthouseImages: [], // { file, previewUrl, isThumbnail }
    hashtagIds: [],
    rules: "",
    amenities: [], // [{ amenityId, count }]
  });

  // 입점 신청서
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // 섹션 토글
  const [visible, setVisible] = useState({
    postRegister: false,
    info: false,
    introSummary: false,
    detailInfo: false,
    rules: false,
    amenities: false,
  });

  // 섹션별 유효성
  const [valid, setValid] = useState({
    postRegister: false,
    info: false,
    introSummary: false,
    detailInfo: false,
    rules: false,
    amenities: false,
  });

  const isAllValid = useMemo(
    () => Object.values(valid).every(Boolean),
    [valid]
  );

  // 에러/알림 모달
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: null,
    buttonText: "확인",
    buttonText2: null,
    onPress: () =>
      setErrorModal((prev) => ({
        ...prev,
        visible: false,
      })),
    onPress2: null,
    imgUrl: null,
  });

  // formData 변경 시 섹션 유효성 갱신
  useEffect(() => {
    setValid(computeValidSections(formData));
  }, [formData]);

  // 입점 신청서 목록 조회
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await guesthouseApi.getHostApplications();
        const filtered =
          (res?.data || [])
            .filter(
              (app) => app.status === "승인 완료" && app.registered === false
            )
            .map((app) => ({
              id: app.id,
              businessName: app.businessName,
              address: app.address,
              detailAddress: app.detailAddress,
              businessPhone: app.businessPhone,
              imgUrl: app.imgUrl,
            })) ?? [];

        setApplications(filtered);
      } catch (error) {
        setApplications([]);
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          "입점 신청서 목록을 불러오지 못했어요.";
        setErrorModal((prev) => ({
          ...prev,
          visible: true,
          title: serverMessage,
        }));
      }
    };

    fetchApplications();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (field, value) => {
    const normalized = normalizeTimeToHHMMSS(value);
    setFormData((prev) => ({
      ...prev,
      [field]: normalized,
    }));
  };

  // 입점 신청서 선택
  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
    setFormData((prev) => ({
      ...prev,
      applicationId: app.id,
      guesthouseName: app.businessName ?? prev.guesthouseName,
      guesthouseAddress: app.address ?? prev.guesthouseAddress,
      guesthouseDetailAddress:
        app.detailAddress ?? prev.guesthouseDetailAddress,
      guesthousePhone: app.businessPhone ?? prev.guesthousePhone,
    }));
  };

  // 이미지 업로드
  const handleImagesUploaded = (urls) => {
    setFormData((prev) => {
      const existing = prev.guesthouseImages || [];
      const mapped = urls.map((url, index) => ({
        serverUrl: url,
        previewUrl: url,
        isThumbnail: existing.length === 0 && index === 0, // 첫 장만 대표
      }));
      const merged = [...existing, ...mapped];

      const safe = hasThumb(merged)
        ? merged
        : merged.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));

      return { ...prev, guesthouseImages: safe };
    });
  };

  const setThumbnail = (index) => {
    setFormData((prev) => ({
      ...prev,
      guesthouseImages: prev.guesthouseImages.map((img, idx) => ({
        ...img,
        isThumbnail: idx === index,
      })),
    }));
  };

  const deleteImage = (index) => {
    setFormData((prev) => {
      const next = prev.guesthouseImages.filter((_, i) => i !== index);
      const normalized = hasThumb(next)
        ? next
        : next.map((img, idx) => ({ ...img, isThumbnail: idx === 0 }));
      return {
        ...prev,
        guesthouseImages: normalized,
      };
    });
  };

  const handleImageUploadError = (message) => {
    // 필요 없으면 그냥 빈 함수로 둬도 됨
    if (!message) return;
    setErrorModal((prev) => ({
      ...prev,
      visible: true,
      title: message,
    }));
  };

  // 태그 토글 (최대 3개)
  const toggleTag = (id) => {
    setFormData((prev) => {
      const already = prev.hashtagIds.includes(id);
      if (already) {
        return {
          ...prev,
          hashtagIds: prev.hashtagIds.filter((tagId) => tagId !== id),
        };
      }
      if (prev.hashtagIds.length >= 3) {
        return prev;
      }
      return {
        ...prev,
        hashtagIds: [...prev.hashtagIds, id],
      };
    });
  };

  // 편의시설 토글
  const toggleAmenity = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities.some((a) => a.amenityId === id);
      if (exists) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a.amenityId !== id),
        };
      }
      return {
        ...prev,
        amenities: [...prev.amenities, { amenityId: id, count: 1 }],
      };
    });
  };

  // 등록
  const handleSubmit = async () => {
    if (!isAllValid) return;

    try {
      // TODO: 실제 이미지 업로드 후 URL로 교체 필요
      const guesthouseImagesPayload = (formData.guesthouseImages || []).map(
        (img) => ({
          guesthouseImageUrl: img.previewUrl,
          isThumbnail: !!img.isThumbnail,
        })
      );

      const payload = {
        applicationId: formData.applicationId,
        guesthouseName: formData.guesthouseName,
        guesthouseAddress: formData.guesthouseAddress,
        guesthouseDetailAddress: formData.guesthouseDetailAddress,
        guesthousePhone: formData.guesthousePhone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guesthouseShortIntro: formData.guesthouseShortIntro,
        guesthouseLongDesc: formData.guesthouseLongDesc,
        rules: formData.rules,
        hashtagIds: formData.hashtagIds,
        amenities: formData.amenities,
        guesthouseImages: guesthouseImagesPayload,
        roomInfos: [], // 방 등록은 제외
      };

      // 👇 실제 API 메서드 이름에 맞춰 수정해서 사용
      await guesthouseApi.registerGuesthouse(payload);

      setErrorModal({
        visible: true,
        title: "게스트하우스를 등록했어요",
        message: null,
        buttonText: "확인",
        buttonText2: null,
        onPress: () => {
          setErrorModal((prev) => ({ ...prev, visible: false }));
          navigate("/guesthouse/my");
        },
        onPress2: null,
        imgUrl: null,
      });
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "게스트하우스 등록 중 오류가 발생했습니다.";
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: serverMessage,
      }));
    }
  };

  return (
    <div className="container">
      <div className="page-title">나의 게스트하우스</div>
      <div className="flex flex-col">
        {/* 내용 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* 1. 게시물 등록 (입점 신청서 선택) */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    postRegister: !prev.postRegister,
                  }))
                }
              >
                <span className="form-title-text">입점신청서 선택</span>
                {valid.postRegister ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.postRegister && (
                <div className="form-body-container">
                  {applications.length === 0 && (
                    <p className="text-sm text-gray-400">
                      등록 가능한 입점 신청서가 없습니다.
                    </p>
                  )}
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-scroll scrollbar-hide">
                    {applications.map((app) => {
                      const selected = selectedApplication?.id === app.id;
                      return (
                        <button
                          key={app.id}
                          type="button"
                          className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm ${
                            selected
                              ? "border-primary-orange bg-orange-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleSelectApplication(app)}
                        >
                          <img
                            src={
                              selected
                                ? EnabledRadioButton
                                : DisabledRadioButton
                            }
                            className="w-7 h-7"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {app.businessName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {app.address} {app.detailAddress}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {app.businessPhone}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. 기본 정보 */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    info: !prev.info,
                  }))
                }
              >
                <span className="form-title-text">기본 정보</span>
                {valid.info ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.info && (
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
                          handleInputChange(
                            "guesthouseDetailAddress",
                            e.target.value
                          )
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

            {/* 3. 소개 요약 */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    introSummary: !prev.introSummary,
                  }))
                }
              >
                <span className="form-title-text">소개 요약</span>
                {valid.introSummary ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.introSummary && (
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
                      대표로 보여줄 사진을 선택해 주세요. 별모양을 클릭해 대표
                      사진을 선택할 수 있어요.
                    </p>

                    {/* ⬇⬇ 여기부터 ImageDropzone 사용 */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="w-40">
                        <ImageDropzone
                          label="배너 사진 업로드"
                          accept="image/*"
                          sensitive={false} // 여러 장 허용
                          maxCount={10}
                          currentCount={formData.guesthouseImages.length}
                          disabled={formData.guesthouseImages.length >= 10}
                          onUploaded={handleImagesUploaded} // S3 업로드 성공 시 URL 배열
                          onError={handleImageUploadError} // 에러 시 모달로 띄우기
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
                            <div className="absolute left-2 top-2 rounded-full bg-white px-1">
                              <img src={StarFilled} width={20} height={20} />
                            </div>
                          )}
                          {!img.isThumbnail && (
                            <button
                              type="button"
                              className="absolute left-2 top-2 rounded-full px-1 bg-white"
                              onClick={() => setThumbnail(index)}
                            >
                              <img src={StarEmpty} width={20} height={20} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-white px-1"
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
                        handleInputChange(
                          "guesthouseShortIntro",
                          e.target.value
                        )
                      }
                    />
                    <button
                      type="button"
                      className="mt-1 text-sm text-gray-400 underline"
                      onClick={() =>
                        handleInputChange("guesthouseShortIntro", "")
                      }
                    >
                      다시쓰기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. 상세 정보 */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    detailInfo: !prev.detailInfo,
                  }))
                }
              >
                <span className="form-title-text">상세 정보</span>
                {valid.detailInfo ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.detailInfo && (
                <div className="form-body-container">
                  <div className="flex items-center justify-between">
                    <p className="form-body-label mb-0">
                      게스트하우스에 대해 자유롭게 적어주세요
                    </p>
                    <span className="text-sm text-gray-400">
                      <span className="text-primary-orange">
                        {formData.guesthouseLongDesc.length}
                      </span>
                      /5000
                    </span>
                  </div>
                  <div>
                    <textarea
                      className="form-input mt-2 min-h-[350px]"
                      placeholder="게스트하우스에 대해 자세히 적어주세요"
                      maxLength={5000}
                      value={formData.guesthouseLongDesc}
                      onChange={(e) =>
                        handleInputChange("guesthouseLongDesc", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="mt-1 text-sm text-gray-400 underline"
                      onClick={() =>
                        handleInputChange("guesthouseLongDesc", "")
                      }
                    >
                      다시쓰기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. 이용 규칙 */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    rules: !prev.rules,
                  }))
                }
              >
                <span className="form-title-text">이용 규칙 및 환불 규정</span>
                {valid.rules ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.rules && (
                <div className="form-body-container">
                  <div className="flex items-center justify-between">
                    <p className="form-body-label mb-0">
                      이용 규칙 및 환불 규정을 작성해 주세요
                    </p>
                    <span className="text-sm text-gray-400">
                      <span className="text-primary-orange">
                        {formData.rules.length}
                      </span>
                      /5000
                    </span>
                  </div>
                  <div>
                    <textarea
                      className="form-input mt-2 min-h-[350px]"
                      placeholder="게스트하우스 이용규칙에 대해 자세히 적어주세요"
                      maxLength={5000}
                      value={formData.rules}
                      onChange={(e) =>
                        handleInputChange("rules", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="mt-1 text-sm text-gray-400 underline"
                      onClick={() => handleInputChange("rules", "")}
                    >
                      다시쓰기
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. 편의시설 */}
            <div className="form-section-box">
              <button
                type="button"
                className="form-title-box"
                onClick={() =>
                  setVisible((prev) => ({
                    ...prev,
                    amenities: !prev.amenities,
                  }))
                }
              >
                <span className="form-title-text">편의시설 및 서비스</span>
                {valid.amenities ? (
                  <img src={CheckOrange} width={24} height={24} alt="완료" />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} alt="펼치기" />
                )}
              </button>

              {visible.amenities && (
                <div className="form-body-container">
                  <p className="text-sm text-primary-orange mb-3">
                    제공하는 편의시설과 서비스를 모두 선택해 주세요
                  </p>

                  <AmenityGroup
                    title="숙소 공용시설"
                    options={publicFacilities}
                    selectedIds={formData.amenities.map((a) => a.amenityId)}
                    toggleAmenity={toggleAmenity}
                  />
                  <AmenityGroup
                    title="객실 내 시설"
                    options={roomFacilities}
                    selectedIds={formData.amenities.map((a) => a.amenityId)}
                    toggleAmenity={toggleAmenity}
                  />
                  <AmenityGroup
                    title="기타시설 및 서비스"
                    options={services}
                    selectedIds={formData.amenities.map((a) => a.amenityId)}
                    toggleAmenity={toggleAmenity}
                  />
                </div>
              )}
            </div>

            <p className="text-sm text-primary-blue mt-2 text-right">
              모든 항목을 입력하셔야 등록이 완료됩니다
            </p>

            {/* 하단 등록 버튼 */}
            <div className="mt-4 flex justify-center">
              <ButtonOrange
                title="등록하기"
                onPress={handleSubmit}
                disabled={!isAllValid}
              />
            </div>
          </div>
        </div>

        {/* 에러/알림 모달 */}
        <ErrorModal
          visible={errorModal.visible}
          title={errorModal.title}
          message={errorModal.message}
          buttonText={errorModal.buttonText}
          buttonText2={errorModal.buttonText2 ?? null}
          onPress={errorModal.onPress}
          onPress2={errorModal.onPress2 ?? null}
          imgUrl={errorModal.imgUrl ?? null}
        />
      </div>
    </div>
  );
}

function AmenityGroup({ title, options, selectedIds, toggleAmenity }) {
  return (
    <div className="mb-3">
      <p className="form-body-label mb-1">{title}</p>
      <div className="flex flex-wrap rounded-xl bg-gray-50 p-2">
        {options?.map((opt) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleAmenity(opt.id)}
              className={`m-1  truncate rounded-lg px-4 py-2 text-md font-medium ${
                active
                  ? "bg-primary-orange text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

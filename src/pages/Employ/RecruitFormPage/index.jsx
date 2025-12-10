// src/pages/RecruitmentForm/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";

import employApi from "@api/employApi";
import { computeValidSections } from "@utils/validation/recruitFormValidation";

import RecruitConditionSection from "./RecruitConditionSection";
import WorkConditionSection from "./WorkConditionSection";
import WorkInfoSection from "./WorkInfoSection";
import DetailInfoSection from "./DetailInfoSection";
import GuesthouseModal from "./GuesthouseModal";
import ShortDescriptionModal from "./ShortDescriptionModal";

import CheckOrange from "@assets/images/check_orange.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";

import {
  WORK_PART_TAGS,
  WORK_PART_ETC_ID,
  WELFARE_TAGS,
  WELFARE_ETC_ID,
  RECRUIT_CONDITION_TAGS,
  RECRUIT_CONDITION_ETC_ID,
  WORK_DURATION_OPTIONS,
  WORK_DURATION_ETC_ID,
} from "@data/recruitOptions";

const splitToTags = (text, baseTags, etcId) => {
  if (!text) return [];

  const pieces = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const selected = [];
  const etcParts = [];

  pieces.forEach((piece) => {
    const found = baseTags.find((t) => t.title === piece);
    if (found) {
      // 같은 태그 중복 방지
      if (!selected.some((t) => t.id === found.id)) {
        selected.push(found);
      }
    } else {
      etcParts.push(piece);
    }
  });

  if (etcParts.length > 0) {
    selected.push({
      id: etcId,
      title: etcParts.join(", "),
    });
  }

  return selected;
};

const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

export default function RecruitmentForm() {
  const navigate = useNavigate();
  const { recruitId = null } = useParams();

  const [formData, setFormData] = useState({
    recruitTitle: "",
    recruitShortDescription: "",
    recruitStart: null,
    recruitEnd: null,
    entryStartDate: tomorrow,
    entryEndDate: dayAfterTomorrow,
    recruitNumberMale: 0,
    recruitNumberFemale: 0,
    recruitNumberNoGender: 0,
    recruitCondition: [],
    recruitMinAge: 0,
    recruitMaxAge: 0,
    workType: "",
    workDuration: [],
    workPart: [],
    welfare: [],
    recruitDetail: "",
    recruitImage: [],
    hashtags: [],
    guesthouseId: 0,
  });

  // 모달 상태
  const [modalVisible, setModalVisible] = useState({
    title: false,
    guesthouse: false,
    shortDescription: false,
    recruitCondition: false,
    workCondition: false,
    workInfo: false,
    detailInfo: false,
  });

  // 각 섹션별 유효성
  const [valid, setValid] = useState({
    title: false,
    guesthouse: false,
    shortDescription: false,
    recruitCondition: false,
    workCondition: false,
    workInfo: false,
    detailInfo: false,
  });

  // 전체 유효 여부
  const isAllValid = useMemo(
    () => Object.values(valid).every(Boolean),
    [valid]
  );

  // 에러/알림 모달 (웹용 ErrorModal 형식에 맞춤)
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

  useEffect(() => {
    if (recruitId) {
      fetchOldRecruit(recruitId);
    }
  }, [recruitId]);

  // formData 변경될 때마다 유효성 다시 계산
  useEffect(() => {
    setValid(computeValidSections(formData));
  }, [formData]);

  // formData 업데이트
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 기존 공고 가져오기
  const fetchOldRecruit = async (recruitId) => {
    try {
      const { data } = await employApi.getRecruitDetail(recruitId);

      // 1) 근무 파트 / 복지 / 기간 매핑 -----------------------------
      const mappedWorkPart = splitToTags(
        data.workPart,
        WORK_PART_TAGS,
        WORK_PART_ETC_ID
      );

      const mappedWelfare = splitToTags(
        data.welfare,
        WELFARE_TAGS,
        WELFARE_ETC_ID
      );

      let mappedWorkDuration = [];
      if (data.workDuration) {
        const title = data.workDuration.trim();
        const found = WORK_DURATION_OPTIONS.find((t) => t.title === title);
        mappedWorkDuration = found
          ? [found]
          : [{ id: WORK_DURATION_ETC_ID, title }];
      }

      // 2) 우대 조건(recruitCondition) 매핑 -------------------------
      const mappedRecruitCondition = splitToTags(
        data.recruitCondition,
        RECRUIT_CONDITION_TAGS,
        RECRUIT_CONDITION_ETC_ID
      );

      // 3) 해시태그 / 이미지 / 나머지 필드 --------------------------
      const mappedHashtags = Array.isArray(data.hashtags)
        ? data.hashtags.map((h) => h.id)
        : [];

      const mappedImages = Array.isArray(data.recruitImages)
        ? data.recruitImages
        : [];

      setFormData((prev) => ({
        ...prev,
        // 텍스트
        recruitTitle: data.recruitTitle ?? "",
        recruitShortDescription: data.recruitShortDescription ?? "",
        recruitDetail: data.recruitDetail ?? "",

        // 날짜들 (input type="date"에 맞게 Date 객체로 보관한다고 가정)
        recruitStart: data.recruitStart
          ? new Date(data.recruitStart)
          : prev.recruitStart,
        recruitEnd: data.recruitEnd
          ? new Date(data.recruitEnd)
          : prev.recruitEnd,
        entryStartDate: data.entryStartDate
          ? new Date(data.entryStartDate)
          : prev.entryStartDate,
        entryEndDate: data.entryEndDate
          ? new Date(data.entryEndDate)
          : prev.entryEndDate,

        // 인원/나이
        recruitNumberMale: data.recruitNumberMale ?? 0,
        recruitNumberFemale: data.recruitNumberFemale ?? 0,
        recruitNumberNoGender: data.recruitNumberNoGender ?? 0,
        recruitMinAge: data.recruitMinAge ?? "",
        recruitMaxAge: data.recruitMaxAge ?? "",

        // 근무 조건
        workType: data.workType ?? "",
        workDuration: mappedWorkDuration,
        workPart: mappedWorkPart,
        welfare: mappedWelfare,

        // 우대 조건
        recruitCondition: mappedRecruitCondition,

        // 이미지/해시태그/게스트하우스
        recruitImage: mappedImages,
        hashtags: mappedHashtags,
        guesthouseId: data.guesthouseId ?? prev.guesthouseId,
      }));
    } catch (error) {
      console.warn("기존 공고 조회 오류:", error);
      setErrorModal({
        visible: true,
        title: "기존 공고 조회 오류",
        message:
          error?.response?.data?.message ||
          "기존 공고를 가져오던 중 오류가 발생했습니다.",
        buttonText: "확인",
        buttonText2: null,
        onPress: () => {
          setErrorModal((prev) => ({ ...prev, visible: false }));
          navigate("/employ/my-recruit");
        },
        onPress2: null,
        imgUrl: null,
      });
    }
  };

  // 신규 공고 등록 요청
  const fetchNewRecruit = async (payload) => {
    try {
      await employApi.createRecruit(payload);
      setErrorModal({
        visible: true,
        title: "새로운 공고를 등록했습니다",
        message: null,
        buttonText: "확인",
        buttonText2: null,
        onPress: () => {
          setErrorModal((prev) => ({ ...prev, visible: false }));
          navigate("/employ/my-recruit");
        },
        onPress2: null,
        imgUrl: null,
      });
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "알 수 없는 오류가 발생했습니다.";
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: serverMessage,
      }));
    }
  };

  // 등록 버튼 클릭
  const handleSubmit = () => {
    if (!isAllValid) return;

    const payload = {
      ...formData,
      recruitStart: formData.recruitStart.toISOString(),
      recruitEnd: formData.recruitEnd.toISOString(),
      entryStartDate: formData.recruitStart.toISOString(),
      entryEndDate: formData.recruitEnd.toISOString(),
      recruitCondition: (formData.recruitCondition || [])
        .map((c) => c.title)
        .join(", "),
      workDuration: (formData.workDuration || [])
        .map((d) => d.title)
        .join(", "),
      workPart: (formData.workPart || []).map((p) => p.title).join(", "),
      welfare: (formData.welfare || []).map((w) => w.title).join(", "),
    };

    fetchNewRecruit(payload);
  };

  return (
    <div className="container">
      <div className="page-title">나의 공고</div>
      <div className="flex flex-col">
        {/* 내용 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* 공고 제목 섹션 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({ ...prev, title: !prev.title }))
                }
              >
                <span className="form-title-text">공고 제목</span>
                {valid.title ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>

              {modalVisible.title && (
                <input
                  type="text"
                  className="form-input mt-2"
                  placeholder="공고제목을 입력해주세요."
                  value={formData.recruitTitle}
                  maxLength={30}
                  onChange={(e) =>
                    handleInputChange("recruitTitle", e.target.value)
                  }
                />
              )}
            </div>
            {/* 게스트하우스 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    guesthouse: !prev.guesthouse,
                  }))
                }
              >
                <span className="form-title-text">게스트하우스</span>
                {valid.guesthouse ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              {modalVisible.guesthouse && (
                <GuesthouseModal
                  handleInputChange={handleInputChange}
                  formData={formData}
                  visible={modalVisible.guesthouse}
                />
              )}
            </div>
            {/* 공고요약 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    shortDescription: !prev.shortDescription,
                  }))
                }
              >
                <span className="form-title-text">공고요약</span>
                {valid.shortDescription ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              {modalVisible.shortDescription && (
                <ShortDescriptionModal
                  handleInputChange={handleInputChange}
                  formData={formData}
                  visible={modalVisible.shortDescription}
                  onClose={() =>
                    setModalVisible((prev) => ({
                      ...prev,
                      shortDescription: false,
                    }))
                  }
                />
              )}
            </div>
            {/* 모집조건 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    recruitCondition: !prev.recruitCondition,
                  }))
                }
              >
                <span className="form-title-text">모집조건</span>
                {valid.recruitCondition ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              {modalVisible.recruitCondition && (
                <RecruitConditionSection
                  handleInputChange={handleInputChange}
                  formData={formData}
                  visible={modalVisible.recruitCondition}
                />
              )}
            </div>
            {/* 근무 조건 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    workCondition: !prev.workCondition,
                  }))
                }
              >
                <span className="form-title-text">근무조건</span>
                {valid.workCondition ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              <WorkConditionSection
                handleInputChange={handleInputChange}
                formData={formData}
                visible={modalVisible.workCondition}
              />
            </div>
            {/* 근무지 정보 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    workInfo: !prev.workInfo,
                  }))
                }
              >
                <span className="form-title-text">근무지 정보</span>
                {valid.workInfo ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              <WorkInfoSection
                handleInputChange={handleInputChange}
                formData={formData}
                visible={modalVisible.workInfo}
              />
            </div>
            {/* 상세 정보 */}
            <div className="form-section-box">
              <div
                className="form-title-box"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    detailInfo: !prev.detailInfo,
                  }))
                }
              >
                <span className="form-title-text">상세 정보</span>
                {valid.detailInfo ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>
              <DetailInfoSection
                handleInputChange={handleInputChange}
                formData={formData}
                visible={modalVisible.detailInfo}
              />
            </div>

            <p className="text-sm text-primary-blue mt-2 text-right">
              모든 항목을 입력하셔야 등록이 완료됩니다
            </p>

            {/* 하단 등록 버튼 */}
            <div className="mt-4 flex justify-center">
              <div>
                <ButtonOrange
                  title="등록하기"
                  onPress={handleSubmit}
                  disabled={!isAllValid}
                />
              </div>
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

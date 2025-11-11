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
import CheckBlack from "@assets/images/check_black.svg";
import CheckWhite from "@assets/images/check_white.svg";
import ChevronBlack from "@assets/images/chevron_right_black.svg";

const sections = [
  { id: "guesthouse", title: "게스트하우스" },
  { id: "shortDescription", title: "공고 요약" },
  { id: "recruitCondition", title: "모집 조건" },
  { id: "workCondition", title: "근무 조건" },
  { id: "workInfo", title: "근무지 정보" },
  { id: "detailInfo", title: "상세 정보" },
];

export default function RecruitmentForm() {
  const navigate = useNavigate();
  const { recruitId } = useParams(); // /employ/recruit-form/:recruitId 같은 형태 가정

  // RN formData 그대로
  const [formData, setFormData] = useState({
    recruitTitle: "",
    recruitShortDescription: "",
    recruitStart: null,
    recruitEnd: null,
    entryStartDate: null,
    entryEndDate: null,
    recruitNumberMale: 0,
    recruitNumberFemale: 0,
    recruitNumberNoGender: 0,
    recruitCondition: [],
    recruitMinAge: 0,
    recruitMaxAge: 0,
    workType: "",
    workDuration: "",
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

  // formData 변경될 때마다 유효성 다시 계산
  useEffect(() => {
    setValid(computeValidSections(formData));
  }, [formData]);

  // 수정 모드라면 기존 공고 조회
  useEffect(() => {
    if (!recruitId) return;

    const toDate = (v) => (v ? new Date(v) : null);
    const splitTitles = (v) =>
      Array.isArray(v)
        ? v
        : typeof v === "string"
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const toCondObjs = (v) => {
      const arr = Array.isArray(v) ? v : splitTitles(v);
      return arr.map((t, i) =>
        typeof t === "string" ? { id: -1000 - i, title: t } : t
      );
    };

    const getPrevRecruit = async (id) => {
      try {
        const response = await employApi.getRecruitDetail(id);
        const r = response.data;

        setFormData((prev) => ({
          ...prev,
          recruitTitle: r.recruitTitle ?? "",
          recruitShortDescription: r.recruitShortDescription ?? "",
          recruitStart: toDate(r.recruitStart),
          recruitEnd: toDate(r.recruitEnd),
          entryStartDate: toDate(r.entryStartDate),
          entryEndDate: toDate(r.entryEndDate),

          recruitNumberFemale: r.recruitNumberFemale ?? 0,
          recruitNumberMale: r.recruitNumberMale ?? 0,
          recruitNumberNoGender: r.recruitNumberNoGender ?? 0,
          recruitMinAge: r.recruitMinAge ?? 0,
          recruitMaxAge: r.recruitMaxAge ?? 0,

          recruitCondition: toCondObjs(r.recruitCondition),
          workPart: splitTitles(r.workPart),
          welfare: splitTitles(r.welfare),

          workType: r.workType ?? "",
          workDuration: r.workDuration ?? "",

          recruitImage: r.recruitImages ?? [],
          recruitDetail: r.recruitDetail ?? "",
          hashtags: (r.hashtags ?? []).map((t) => t.id),
          guesthouseId: r.guesthouseId ?? 0,
        }));
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          "공고 정보를 불러오는 중 오류가 발생했습니다.";
        setErrorModal((prev) => ({
          ...prev,
          visible: true,
          title: serverMessage,
        }));
      }
    };

    getPrevRecruit(recruitId);
  }, [recruitId]);

  // formData 업데이트
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          // RN에서는 MainTabs -> MyRecruitmentList로 reset
          // 웹에서는 공고 목록 페이지로 이동한다고 가정
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
      entryStartDate: formData.entryStartDate.toISOString(),
      entryEndDate: formData.entryEndDate.toISOString(),
      recruitCondition: formData.recruitCondition
        .map((c) => c.title)
        .join(", "),
      workPart: formData.workPart.join(", "),
      welfare: formData.welfare.join(", "),
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
            <div className="w-full rounded-2xl border-1 border-grayscale-200 bg-white px-4 py-3 flex flex-col gap-2 shadow-sm text-left">
              <div
                className="flex items-center justify-between"
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({ ...prev, title: !prev.title }))
                }
              >
                <span className="text-base font-semibold">공고 제목</span>
                {valid.title ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </div>

              {modalVisible.title && (
                <input
                  type="text"
                  className="mt-2 w-full border border-grayscale-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-orange"
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
            <div className="w-full rounded-2xl border-1 border-grayscale-200 bg-white px-4 py-3 flex flex-col gap-2 shadow-sm text-left">
              <div
                className="flex items-center justify-between "
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    guesthouse: !prev.guesthouse,
                  }))
                }
              >
                <span className="text-base font-semibold">게스트하우스</span>
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
            <div className="w-full rounded-2xl border-1 border-grayscale-200 bg-white px-4 py-3 flex flex-col gap-2 shadow-sm text-left">
              <div
                className="flex items-center justify-between "
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    shortDescription: !prev.shortDescription,
                  }))
                }
              >
                <span className="text-base font-semibold">공고요약</span>
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
            <div className="w-full rounded-2xl border-1 border-grayscale-200 bg-white px-4 py-3 flex flex-col gap-2 shadow-sm text-left">
              <div
                className="flex items-center justify-between "
                type="button"
                onClick={() =>
                  setModalVisible((prev) => ({
                    ...prev,
                    recruitCondition: !prev.recruitCondition,
                  }))
                }
              >
                <span className="text-base font-semibold">모집조건</span>
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
                  onClose={() =>
                    setModalVisible((prev) => ({
                      ...prev,
                      recruitCondition: false,
                    }))
                  }
                />
              )}
            </div>

            {/* 나머지 섹션 카드들 */}
            {sections.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full rounded-2xl bg-white px-4 py-3 flex items-center justify-between shadow-sm text-left"
                onClick={() =>
                  setModalVisible((prev) => ({ ...prev, [item.id]: true }))
                }
              >
                <span className="text-base font-semibold">{item.title}</span>
                {valid[item.id] ? (
                  <img src={CheckOrange} width={24} height={24} />
                ) : (
                  <img src={ChevronBlack} width={24} height={24} />
                )}
              </button>
            ))}

            <p className="text-sm text-grayscale-500 mt-2">
              모든 항목을 입력하셔야 등록이 완료됩니다
            </p>

            {/* 하단 등록 버튼 */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold border ${
                  isAllValid
                    ? "bg-primary-orange border-primary-orange text-white"
                    : "bg-white border-grayscale-300 text-grayscale-500 cursor-not-allowed"
                }`}
                disabled={!isAllValid}
                onClick={handleSubmit}
              >
                <span>등록하기</span>
                {isAllValid ? (
                  <img src={CheckWhite} width={24} height={24} />
                ) : (
                  <img src={CheckBlack} width={24} height={24} />
                )}
              </button>
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

        {/* 모집 조건 모달 */}
        <RecruitConditionSection
          handleInputChange={handleInputChange}
          formData={formData}
          visible={modalVisible.recruitCondition}
          onClose={() =>
            setModalVisible((prev) => ({ ...prev, recruitCondition: false }))
          }
        />

        {/* 근무 조건 모달 */}
        <WorkConditionSection
          handleInputChange={handleInputChange}
          formData={formData}
          visible={modalVisible.workCondition}
          onClose={() =>
            setModalVisible((prev) => ({ ...prev, workCondition: false }))
          }
        />

        {/* 상세 정보 모달 */}
        <DetailInfoSection
          handleInputChange={handleInputChange}
          formData={formData}
          visible={modalVisible.detailInfo}
          onClose={() =>
            setModalVisible((prev) => ({ ...prev, detailInfo: false }))
          }
        />
      </div>
    </div>
  );
}

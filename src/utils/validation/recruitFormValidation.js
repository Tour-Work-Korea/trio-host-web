// validators/recruitFormValidation.js
import {
  isNonEmpty,
  toNum,
  isFiniteNum,
  isValidDate,
  isDateOrder,
  hasItems,
} from "./validationUtils";

/**
 * 채용 공고 섹션 유효성: 각 섹션별 true/false 반환
 */
export const computeValidSections = (data) => {
  const {
    recruitTitle,
    recruitShortDescription,
    recruitStart,
    recruitEnd,
    recruitNumberMale,
    recruitNumberFemale,
    recruitNumberNoGender,
    recruitCondition, // [{id, title}]
    recruitMinAge,
    recruitMaxAge,
    workType,
    workDuration, // ['기간1', ...]
    workPart, // ['업무1', ...]
    welfare, // ['복지1', ...]
    recruitImage, // [{recruitImageUrl, isThumbnail}]
    recruitDetail,
    guesthouseId,
  } = data ?? {};

  // 숫자 파싱
  const male = toNum(recruitNumberMale);
  const female = toNum(recruitNumberFemale);
  const noGender = toNum(recruitNumberNoGender);
  const minAge = toNum(recruitMinAge);
  const maxAge = toNum(recruitMaxAge);

  // 기본
  const title = isNonEmpty(recruitTitle);
  const guesthouse = Number.isInteger(guesthouseId) && guesthouseId > 0;
  const shortDescription = isNonEmpty(recruitShortDescription);

  // 모집 조건
  const headcountOk =
    isFiniteNum(male) &&
    male >= 0 &&
    isFiniteNum(female) &&
    female >= 0 &&
    isFiniteNum(noGender) &&
    noGender >= 0 &&
    male + female + noGender > 0;

  const ageOk =
    isFiniteNum(minAge) &&
    isFiniteNum(maxAge) &&
    minAge >= 0 &&
    maxAge >= 0 &&
    minAge <= maxAge;

  const conditionTagsOk = hasItems(recruitCondition);

  const recruitConditionValid =
    isValidDate(recruitStart) &&
    isValidDate(recruitEnd) &&
    isDateOrder(recruitStart, recruitEnd) &&
    headcountOk &&
    ageOk &&
    conditionTagsOk;

  // 근무 조건
  const workCondition =
    isNonEmpty(workType) &&
    hasItems(workPart) &&
    hasItems(workDuration) &&
    hasItems(welfare);

  // 근무지 정보(이미지)
  const workInfo = hasItems(recruitImage); // 썸네일 필수면 .some(x=>x?.isThumbnail) 추가

  // 상세
  const detailInfo = isNonEmpty(recruitDetail);

  const allValid =
    title &&
    guesthouse &&
    shortDescription &&
    recruitConditionValid &&
    workCondition &&
    workInfo &&
    detailInfo;

  return {
    title,
    guesthouse,
    shortDescription,
    recruitCondition: recruitConditionValid,
    workCondition,
    workInfo,
    detailInfo,
    allValid,
  };
};

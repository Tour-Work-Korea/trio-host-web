// validators/storeRegisterFormValidation.js
import {
  isNonEmpty,
  isValidPhone,
} from "@utils/validation/validationUtils";

/**
 * 사업자 입점 등록 유효성 검사 (통합 폼)
 * @param {object} data - formData
 */
export const computeStoreRegister = (data = {}) => {
  const {
    businessName,
    img, // Business license img
    bankBook,
    businessLicense,
    agreeService,
    agreePrivacy,
    guesthouseName,
    guesthouseImg,
  } = data ?? {};

  // 1. 사업자 기본 정보 섹션
  const business = isNonEmpty(businessName);

  // 2. 증빙서류 이미지
  const image = img ? true : false;
  const docs = bankBook && businessLicense ? true : false;
  
  // 3. 이용약관 동의
  const agreements = agreeService === true && agreePrivacy === true;

  // 4. 게스트하우스 2차 정보
  const guesthouse = isNonEmpty(guesthouseName) && (guesthouseImg ? true : false);

  const allValid = business && image && docs && agreements && guesthouse;

  return {
    business, // 상호
    image, // 등록증 이미지
    docs, // 통장사본, 영업신고증
    agreements, // 약관 동의
    guesthouse, // 게하 명칭, 프사
    allValid,
  };
};

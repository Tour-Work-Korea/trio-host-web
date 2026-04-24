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
    businessType,
    businessPhone,
    address,
    detailAddress,
    img, // Business license img
    agreeService,
    agreePrivacy,
    guesthouseName,
    guesthouseImg,
  } = data ?? {};

  // 1. 사업자 기본 정보 섹션
  const business = isNonEmpty(businessName) && isNonEmpty(businessType);

  // 2. 사업자 연락처 및 주소
  const contact = isValidPhone(businessPhone) && isNonEmpty(address) && isNonEmpty(detailAddress);

  // 3. 증빙서류 이미지
  const image = img ? true : false;
  
  // 4. 이용약관 동의
  const agreements = agreeService === true && agreePrivacy === true;

  // 5. 게스트하우스 2차 정보
  const guesthouse = isNonEmpty(guesthouseName) && (guesthouseImg ? true : false);

  const allValid = business && contact && image && agreements && guesthouse;

  return {
    business, // 상호/유형
    contact, // 전화/주소/상세주소
    image, // 등록증 이미지
    agreements, // 약관 동의
    guesthouse, // 게하 명칭, 프사
    allValid,
  };
};

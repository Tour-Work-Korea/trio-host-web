// validators/storeRegisterFormValidation.js
import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isValidBizNo,
  isValidImageUrl,
  onlyDigits,
} from "@utils/validation/validationUtils";

/**
 * 사업자 입점 등록 1단계 유효성 검사
 * @param {object} data - formData
 * @param {object} options - { bizChecked: boolean }
 */
export const computeStoreRegister = (data, options = {}) => {
  const {
    businessName,
    businessType,
    employeeCount, // number|string
    managerName,
    managerEmail,
    businessPhone,
    address,
    detailAddress,
    businessRegistrationNumber,
    img,
  } = data ?? {};

  const { bizChecked = null } = options;

  // 기본 정보 섹션
  const business =
    isNonEmpty(businessName) &&
    isNonEmpty(businessType) &&
    Number.isFinite(parseInt(employeeCount, 10)) &&
    parseInt(employeeCount, 10) >= 0;

  const contact =
    isNonEmpty(managerName) &&
    isValidEmail(managerEmail) &&
    isValidPhone(businessPhone);

  const addr = isNonEmpty(address) && isNonEmpty(detailAddress);

  // 사업자 등록
  const bizDigits = onlyDigits(businessRegistrationNumber);
  const bizReg = isValidBizNo(bizDigits) && bizChecked === true; // 서버 검증까지 완료

  // 첨부 이미지
  const image = img ? true : false;

  const allValid = business && contact && addr && bizReg && image;

  return {
    business, // 상호/유형/직원수
    contact, // 담당자/이메일/전화
    addr, // 주소/상세주소
    bizReg, // 사업자번호 + 서버확인
    image, // 등록증 이미지
    allValid,
  };
};

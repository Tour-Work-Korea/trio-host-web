// validators/storeRegisterFormValidation.js
import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,

} from "@utils/validation/validationUtils";

/**
 * 사업자 입점 등록 1단계 유효성 검사
 * @param {object} data - formData

 */
export const computeStoreRegister = (data= {}) => {
  const {
    businessName,
    businessType,
    employeeCount, // number|string
    managerName,
    managerEmail,
    businessPhone,
    address,
    detailAddress,
    img,
  } = data ?? {};


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


  // 첨부 이미지
  const image = img ? true : false;

  const allValid = business && contact && addr && image;

  return {
    business, // 상호/유형/직원수
    contact, // 담당자/이메일/전화
    addr, // 주소/상세주소
    image, // 등록증 이미지
    allValid,
  };
};

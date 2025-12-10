// @utils/validation/profileValidation.js
import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} from "./validationUtils";

/**
 * 프로필 수정 유효성 검사
 * @param {object} data - {
 *   name, phone, email,
 *   newPassword, confirmPassword
 * }
 * @param {object} options - {
 *   requirePhoneVerify, phoneChecked,
 *   requireEmailVerify, emailChecked
 * }
 */
export function profileValidation(
  data,
  {
    requirePhoneVerify = false,
    phoneChecked = null,
    requireEmailVerify = false,
    emailChecked = null,
  } = {}
) {
  const nameOk = isNonEmpty(data?.name);
  const phoneOk = isValidPhone(data?.phone);
  const emailOk = isValidEmail(data?.email);

  // 비밀번호는 "선택 사항"
  const hasPwInput =
    !!(data?.newPassword && data?.newPassword.trim()) ||
    !!(data?.confirmPassword && data?.confirmPassword.trim());

  let pwOk = true;
  let pwConfirmOk = true;

  if (hasPwInput) {
    pwOk = isStrongPassword(data?.newPassword);
    pwConfirmOk = data?.newPassword === data?.confirmPassword;
  }

  const phoneVerifyOk = requirePhoneVerify ? phoneChecked === true : true;
  const emailVerifyOk = requireEmailVerify ? emailChecked === true : true;

  const allValid =
    nameOk &&
    phoneOk &&
    emailOk &&
    pwOk &&
    pwConfirmOk &&
    phoneVerifyOk &&
    emailVerifyOk;

  let firstError = null;
  if (!nameOk) firstError = "이름을 입력해주세요.";
  else if (!phoneOk) firstError = "전화번호를 정확히 입력해주세요.";
  else if (!emailOk) firstError = "올바른 이메일을 입력해주세요.";
  else if (!pwOk && hasPwInput)
    firstError =
      "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
  else if (!pwConfirmOk && hasPwInput)
    firstError = "비밀번호가 일치하지 않습니다.";
  else if (!phoneVerifyOk) firstError = "전화번호 인증을 완료해주세요.";
  else if (!emailVerifyOk) firstError = "이메일 인증을 완료해주세요.";

  return {
    nameOk,
    phoneOk,
    emailOk,
    pwOk,
    pwConfirmOk,
    phoneVerifyOk,
    emailVerifyOk,
    allValid,
    firstError,
  };
}

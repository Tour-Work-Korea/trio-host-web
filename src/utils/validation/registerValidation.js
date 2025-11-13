// validators/registerValidation.js
import {
  isNonEmpty,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} from "./validationUtils";

/**
 * 회원가입 2단계 유효성 검사
 * @param {object} data - { name, phone, email, password, passwordConfirm }
 * @param {object} options - { requirePhoneVerify, phoneChecked, requireEmailVerify, emailChecked }
 * @returns {{
 *  nameOk:boolean, phoneOk:boolean, emailOk:boolean, pwOk:boolean, pwConfirmOk:boolean,
 *  phoneVerifyOk:boolean, emailVerifyOk:boolean, allValid:boolean, firstError:string|null
 * }}
 */
export function registerValidation(
  data,
  {
    requirePhoneVerify = true,
    phoneChecked = null,
    requireEmailVerify = true,
    emailChecked = null,
  } = {}
) {
  const nameOk = isNonEmpty(data?.name);
  const phoneOk = isValidPhone(data?.phone);
  const emailOk = isValidEmail(data?.email);
  const pwOk = isStrongPassword(data?.password);
  const pwConfirmOk = data?.password === data?.passwordConfirm;

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
  else if (!pwOk)
    firstError =
      "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
  else if (!pwConfirmOk) firstError = "비밀번호가 일치하지 않습니다.";
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

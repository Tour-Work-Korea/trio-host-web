import authApi from "@api/authApi";

// 숫자만 추출
const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
// 간단한 길이 체크(국내 10~11자리 기준, 필요 시 정책에 맞게 수정)
const isValidPhone = (v) => {
  const digits = onlyDigits(v);
  return digits.length >= 8; // 최소 8자리로 완화, 정책에 맞게 10~11로 바꿔도 됨
};

/** 휴대폰 인증코드 발송 */
export async function sendCodeForPhone(phone) {
  const digits = onlyDigits(phone);
  if (!isValidPhone(digits)) {
    throw new Error("올바른 전화번호를 입력해주세요.");
  }
  try {
    const res = await authApi.sendSms(digits);
    return res?.data ?? true;
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "휴대폰 인증 요청에 실패했습니다.";
    throw new Error(msg);
  }
}

/** 계정 찾기용 휴대폰 인증코드 발송 */
export async function sendCodeForFindAccount(phone) {
  const digits = onlyDigits(phone);
  if (!isValidPhone(digits)) {
    throw new Error("올바른 전화번호를 입력해주세요.");
  }
  try {
    const res = await authApi.verifySelfByPhone(digits);
    return res?.data ?? true;
  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "휴대폰 인증 요청에 실패했습니다.";
    throw new Error(msg);
  }
}

/** 휴대폰 인증코드 확인 */
export async function checkCodeForPhone(phone, code) {
  const digits = onlyDigits(phone);
  const pin = String(code || "").trim();
  if (!isValidPhone(digits)) {
    throw new Error("올바른 전화번호를 입력해주세요.");
  }
  if (!pin) {
    throw new Error("인증코드를 입력해주세요.");
  }
  try {
    const res = await authApi.verifySms(digits, pin);
    return res?.data ?? true;
  } catch (e) {
    const msg =
      e?.response?.data?.message || e?.message || "휴대폰 인증에 실패했습니다.";
    throw new Error(msg);
  }
}

import authApi from "@api/authApi";

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

/** 이메일 인증코드 발송 */
export async function sendCodeForEmail(email) {
  const target = String(email || "").trim();
  if (!isEmail(target)) {
    throw new Error("올바른 이메일 형식을 입력해주세요.");
  }
  try {
    const res = await authApi.sendEmail(target);
    // 서버에서 메시지/추가데이터가 오면 필요 시 반환
    return res?.data ?? true;
  } catch (e) {
    // 서버 메시지 우선 표출
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "이메일 인증 요청에 실패했습니다.";
    throw new Error(msg);
  }
}

/** 이메일 인증코드 확인 */
export async function checkCodeForEmail(email, authCode) {
  const target = String(email || "").trim();
  const code = String(authCode || "").trim();
  if (!isEmail(target)) {
    throw new Error("올바른 이메일 형식을 입력해주세요.");
  }
  if (!code) {
    throw new Error("인증코드를 입력해주세요.");
  }
  try {
    const res = await authApi.verifyEmail(target, code);
    // 서버가 성공 시 boolean/데이터를 준다면 그대로 반환
    return res?.data ?? true;
  } catch (e) {
    const msg =
      e?.response?.data?.message || e?.message || "이메일 인증에 실패했습니다.";
    throw new Error(msg);
  }
}

// utils/validationUtils.js

// ===== 문자열 =====
export const isNonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

// ===== 숫자 =====
export const toNum = (v) =>
  v === "" || v === null || v === undefined ? NaN : Number(v);
export const isFiniteNum = (v) => Number.isFinite(toNum(v));

// ===== 날짜 =====
export const toDate = (v) => (v instanceof Date ? v : v ? new Date(v) : null);
export const isValidDate = (v) => {
  const d = toDate(v);
  return d instanceof Date && !isNaN(d.getTime());
};
export const isDateOrder = (start, end) =>
  isValidDate(start) && isValidDate(end) && toDate(start) <= toDate(end);

// ===== 배열 =====
export const hasItems = (arr) => Array.isArray(arr) && arr.length > 0;

// ===== 포맷/연락처/계정 =====
export const onlyDigits = (v) => String(v ?? "").replace(/\D/g, "");

export const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? "").trim());

export const isValidPhone = (v) => /^0\d{8,}$/.test(String(v ?? "")); // 0으로 시작, 9자리+

export const isValidBizNo = (v) => onlyDigits(v).length === 10;

export const isStrongPassword = (pw = "") => {
  if (pw.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

export const isValidImageUrl = (v) => typeof v === "string" && v.length > 0;

// ===== 타이머 유틸(선택) =====
export const canSendWithTimer = (isReady, timer, sending) =>
  !!isReady && timer === 0 && !sending;
export const canCheckWithTimer = (code, timer) =>
  String(code ?? "").trim().length > 0 && timer > 0;

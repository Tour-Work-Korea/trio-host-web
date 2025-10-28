export function formatPhoneKR(input = "") {
  const d = String(input).replace(/\D/g, "");

  // 서울(02) 지역번호 처리
  if (d.startsWith("02")) {
    if (d.length <= 2) return d;
    if (d.length <= 5) return d.replace(/(\d{2})(\d+)/, "$1-$2");
    if (d.length <= 9)
      return d.replace(/(\d{2})(\d{3,4})(\d{0,4}).*/, "$1-$2-$3");
    return d.replace(/(\d{2})(\d{4})(\d{4}).*/, "$1-$2-$3");
  }

  // 대표적인 전국/이동통신 식별자 (010, 011, 016, 017, 018, 019, 070, 050 etc)
  if (d.length <= 3) return d;
  if (d.length <= 7) return d.replace(/(\d{3})(\d+)/, "$1-$2");
  // 10~11자리: 3-3-4 또는 3-4-4 (모바일 11자면 3-4-4)
  return d.replace(/(\d{3})(\d{3,4})(\d{4}).*/, "$1-$2-$3");
}

// "2025-11-05T15:33:17.477629" -> "2025.11.05"
const formatDateToDot = (input) => {
  // 1) 문자열인 경우: 'T' 앞의 날짜 부분만 사용
  if (typeof input === "string") {
    const [ymd] = input.split("T");
    if (!ymd) return "";
    const [year, month, day] = ymd.split("-");
    return `${year}.${month}.${day}`;
  }

  // 2) Date 객체인 경우
  if (input instanceof Date && !isNaN(input)) {
    const y = input.getFullYear();
    const m = String(input.getMonth() + 1).padStart(2, "0");
    const d = String(input.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }

  return "";
};

export { formatDateToDot };

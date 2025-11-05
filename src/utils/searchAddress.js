//주소 찾기 팝업
export function loadPostcode() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("window is undefined"));
      return;
    }
    if (window.daum && window.daum.Postcode) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export async function handleSearchAddress(setAddress, setZipCode = null) {
  try {
    await loadPostcode();

    new window.daum.Postcode({
      oncomplete: (data) => {
        const base =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        const extra = data.buildingName ? ` (${data.buildingName})` : "";
        const fullAddress = base + extra;
        // 주소/우편번호 갱신
        setAddress(fullAddress);
        if (setZipCode) setZipCode(data.zonecode);
      },
    }).open();
  } catch (err) {
    console.error("주소 검색 스크립트 로드 실패:", err);
    alert("주소 검색을 불러오지 못했습니다. 네트워크를 확인해주세요.");
  }
}

import React, { useEffect, useState } from "react";

export function BizCertPreview({ img }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!img) {
      setSrc(null);
      return;
    }

    // 문자열(URL)인 경우 그대로 사용
    if (typeof img === "string") {
      setSrc(img);
      return;
    }

    // File 객체인 경우 object URL 생성
    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // 메모리 해제
    }
  }, [img]);

  if (!src) return null;

  return (
    <div className="mt-2">
      <img
        src={src}
        alt="사업자 등록증"
        className="h-28 w-28 rounded-lg border object-cover"
      />
    </div>
  );
}

/* eslint-disable react/prop-types */
import React, { useState } from "react";
import xBtn from "@assets/images/x_gray.svg";

import RegisterForm1 from "./RegisterForm1";
import RegisterForm2 from "./RegisterForm2";

export default function RegisterModal({
  visible,
  setVisible,
  formData,
  setFormData,
}) {
  const [page, setPage] = useState(1);

  if (!visible) return null;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-modal-background flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="w-[90%] max-w-2xl h-[90%] rounded-2xl bg-grayscale-0 px-20 py-12 text-center shadow-lg overflow-y-scroll scrollbar-hide">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div />
          <div>
            <h2 className="text-xl font-semibold mb-4">
              워커웨이 입점 및 회원가입 신청서({page}/2)
            </h2>
            <h3>사업자 정보를 입력하고, 회원 계정을 생성해주세요.</h3>
            <h3>제출 후 검토가 완료되면 담당자가 순차적으로 연락드립니다.</h3>
          </div>

          <button onClick={() => setVisible(false)}>
            <img src={xBtn} />
          </button>
        </div>
        {/* 바디 */}
        {page == 1 && (
          <RegisterForm1
            formData={formData}
            handleInputChange={handleInputChange}
            setPage={setPage}
          />
        )}
        {page == 2 && (
          <RegisterForm2
            formData={formData}
            handleInputChange={handleInputChange}
            setPage={setPage}
            setVisible={setVisible}
          />
        )}
      </div>
    </div>
  );
}

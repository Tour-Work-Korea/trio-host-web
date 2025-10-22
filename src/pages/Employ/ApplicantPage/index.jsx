import React, { useState } from "react";
import ErrorModal from "@components/ErrorModal";
import ButtonOrange from "@components/ButtonOrange";

export default function ApplicantPage() {
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "에러 모달 테스트 title",
    message: "에러 모달 테스트 message",
    buttonText: "button1",
    buttonText2: "button2",
    onPress: () => {
      alert("버튼 1 클릭");
      setErrorModal((s) => ({ ...s, visible: false }));
    },
    onPress2: () => {
      alert("버튼 2 클릭");
      setErrorModal((s) => ({ ...s, visible: false }));
    },
  });

  const openModal = () => setErrorModal((s) => ({ ...s, visible: true }));

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">ApplicantPage</h1>

      <ButtonOrange title="모달 열기" onPress={openModal} />

      {/* ✅ 스프레드로 전달 */}
      <ErrorModal {...errorModal} />
    </div>
  );
}

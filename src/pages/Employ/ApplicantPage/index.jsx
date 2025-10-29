import React, { useEffect, useState } from "react";
import ErrorModal from "@components/ErrorModal";
import SelectModal from "../../../components/SelectModal";
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

  //선택 모달 사용 예시
  const [modal, setModal] = useState({ visible: false });
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    alert(picked);
  }, [picked]);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">ApplicantPage</h1>

      <ButtonOrange title="에러 모달 열기" onPress={openModal} />
      <ButtonOrange
        title="선택 모달 열기"
        onPress={() => setModal({ visible: true })}
      />

      <ErrorModal {...errorModal} />

      <SelectModal
        visible={modal.visible}
        title={"게스트하우스를 선택해 주세요"}
        items={[
          { id: -1, title: "전체 게스트하우스" },
          { id: 1, title: "비지터 게스트하우스", subtitle: "제주 제주시 …" },
        ]}
        initialSelectedId={picked} // 이미 선택된 값 있으면 표시
        setSelect={(id) => setPicked(id)}
        onClose={() => setModal({ visible: false })}
        // onPress={(id) => { /* 직접 처리하고 싶으면 */ }}
      />
    </div>
  );
}

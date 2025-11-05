import React, { useEffect, useRef, useState } from "react";

import ShowIcon from "@assets/images/show_password.svg";
import HideIcon from "@assets/images/hide_password.svg";
import FindAccount from "@components/FindAccount";
import ButtonOrange from "@components/ButtonOrange";
import authApi from "@api/authApi";
import ErrorModal from "@components/ErrorModal";
import { useNavigate } from "react-router-dom";

export default function FindIdPage() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [id, setId] = useState(null);

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () => setErrorModal({ ...errorModal, visible: false }),
  });

  useEffect(() => {
    if (!isChecked) return;
    findId();
  }, [isChecked]);

  const findId = async () => {
    try {
      const response = await authApi.findId(phone);
      setId(response.data);
    } catch (error) {
      // 모달 먼저 띄우기 (확인 누르면 즉시 이동)
      setErrorModal({
        ...errorModal,
        visible: true,
        title: "아이디 찾기 실패",
        message:
          error?.response?.data?.message || "아이디 찾기에 실패했습니다.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="flex items-start justify-center w-full gap-20">
        <FindAccount
          mode="id"
          setChecked={setIsChecked}
          phone={phone}
          setPhone={setPhone}
        />
        {isChecked && (
          <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-8 space-y-4">
            <h1 className="text-3xl font-semibold mb-8">아이디를 찾았어요</h1>
            {id && (
              <div className="bg-grayscale-200 p-6 text-lg font-semibold rounded-lg">
                {id}
              </div>
            )}

            <ButtonOrange
              title="로그인하러 가기"
              onPress={() => navigate("/login")}
            />
          </div>
        )}
      </div>
      {/* 에러 모달 */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
        onPress={errorModal.onPress}
      />
    </div>
  );
}

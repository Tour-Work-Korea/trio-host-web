import React, { useEffect, useRef, useState } from "react";

import ShowIcon from "@assets/images/show_password.svg";
import HideIcon from "@assets/images/hide_password.svg";
import FindAccount from "@components/FindAccount";
import ButtonOrange from "@components/ButtonOrange";
import authApi from "@api/authApi";
import ErrorModal from "@components/ErrorModal";
import { useNavigate } from "react-router-dom";

const isStrongPassword = (pw = "") => {
  if (pw.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw); // 특수문자 1개 이상
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordConfirm, setVisiblePasswordConfirm] = useState(false);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () => setErrorModal({ ...errorModal, visible: false }),
  });

  const timerRef = useRef(null);

  // 언마운트 시 타이머 정리 (안전장치)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChangePassword = async () => {
    try {
      await authApi.findPassword({
        newPassword: password,
        confirmPassword: passwordConfirm,
        phoneNum: phone,
        role: "HOST",
      });
      // 모달 먼저 띄우기 (확인 누르면 즉시 이동)
      setErrorModal({
        visible: true,
        title: "비밀번호 변경 성공",
        message: "비밀번호를 성공적으로 변경했습니다!",
        buttonText: "확인",
        onPress: () => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setErrorModal((prev) => ({ ...prev, visible: false }));
          navigate("/login");
        },
      });

      // 3초 뒤 자동 닫힘 + 이동
      timerRef.current = setTimeout(() => {
        setErrorModal((prev) => ({ ...prev, visible: false }));
        navigate("/login");
        timerRef.current = null;
      }, 3000);
    } catch (error) {
      console.warn("비밀번호 변경 실패: ", error?.response?.message);
      setErrorModal({
        ...errorModal,
        visible: true,
        title: "비밀번호 변경 실패",
        message:
          error?.response?.data?.message || "비밀번호 변경에 실패했습니다.",
      });
    }
  };
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="flex items-start justify-center w-full gap-20">
        <FindAccount
          mode="password"
          setChecked={setIsChecked}
          phone={phone}
          setPhone={setPhone}
        />
        {isChecked && (
          <div className="w-full max-w-sm bg-neutral-white shadow-md rounded-lg p-8 space-y-4">
            <h1 className="text-3xl font-semibold mb-8">
              새로운 비밀번호를
              <br />
              설정해주세요
            </h1>
            {/* 비밀번호 */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <div className="form-input-wrap relative">
                <input
                  id="password"
                  type={visiblePassword ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="비밀번호를 입력해주세요"
                  value={password ?? ""}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setVisiblePassword((v) => !v)}
                  aria-label={
                    visiblePassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                  }
                >
                  <img src={visiblePassword ? HideIcon : ShowIcon} alt="" />
                </button>
              </div>
              <div
                className={`mt-1 text-xs ${
                  isStrongPassword(password)
                    ? "text-grayscale-500"
                    : "text-red-600"
                }`}
              >
                8~20자, 영문 대소문자/숫자/특수문자 조합으로 작성해주세요
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="form-group">
              <label htmlFor="passwordConfirm" className="form-label">
                비밀번호 확인
              </label>
              <div className="form-input-wrap relative">
                <input
                  id="passwordConfirm"
                  type={visiblePasswordConfirm ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={passwordConfirm ?? ""}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setVisiblePasswordConfirm((v) => !v)}
                  aria-label={
                    visiblePasswordConfirm
                      ? "비밀번호 숨기기"
                      : "비밀번호 보이기"
                  }
                >
                  <img
                    src={visiblePasswordConfirm ? HideIcon : ShowIcon}
                    alt=""
                  />
                </button>
              </div>
              {passwordConfirm && passwordConfirm === password ? (
                <p className="mt-1 text-xs text-green-600">
                  비밀번호가 일치합니다.
                </p>
              ) : passwordConfirm ? (
                <p className="mt-1 text-xs text-red-600">
                  비밀번호가 일치하지 않습니다.
                </p>
              ) : null}
            </div>

            <ButtonOrange
              title="비밀번호 변경"
              // disabled={!phoneChecked}
              onPress={handleChangePassword}
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

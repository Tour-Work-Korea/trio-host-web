/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";

import ShowIcon from "@assets/images/show_password.svg";
import HideIcon from "@assets/images/hide_password.svg";

import ButtonOrange from "@components/ButtonOrange";
import ButtonWhite from "@components/ButtonWhite";
import { checkCodeForPhone, sendCodeForPhone } from "@utils/confirmPhone";
import { checkCodeForEmail, sendCodeForEmail } from "@utils/confirmEmail";
import ErrorModal from "@components/ErrorModal";

// 간단한 이메일 검증
const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

//비밀번호 검증
const isStrongPassword = (pw = "") => {
  if (pw.length < 8) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw); // 특수문자 1개 이상
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

// mm:ss 포맷
const fmt = (s) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export default function RegisterForm2({
  formData,
  handleInputChange,
  setPage,
}) {
  const [phoneCode, setPhoneCode] = useState("");
  const [emailCode, setEmailCode] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordConfirm, setVisiblePasswordConfirm] = useState(false);

  // 인증 상태/타이머
  const [phoneTimer, setPhoneTimer] = useState(0); // 초
  const [emailTimer, setEmailTimer] = useState(0); // 초
  const [phoneSending, setPhoneSending] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(null); // null | true | false
  const [emailChecked, setEmailChecked] = useState(null);

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () => setErrorModal({ ...errorModal, visible: false }),
  });

  // 타이머 틱
  useEffect(() => {
    if (phoneTimer <= 0) return;
    const id = setInterval(() => setPhoneTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phoneTimer]);
  useEffect(() => {
    if (emailTimer <= 0) return;
    const id = setInterval(() => setEmailTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [emailTimer]);

  // 버튼 활성 조건
  const canSendPhone = useMemo(() => {
    return (
      (formData.phone || "").length >= 8 && phoneTimer === 0 && !phoneSending
    );
  }, [formData.phone, phoneTimer, phoneSending]);

  const canSendEmail = useMemo(() => {
    return isEmail(formData.email) && emailTimer === 0 && !emailSending;
  }, [formData.email, emailTimer, emailSending]);

  const canCheckPhone = useMemo(() => {
    return phoneCode.trim().length > 0 && phoneTimer > 0;
  }, [phoneCode, phoneTimer]);

  const canCheckEmail = useMemo(() => {
    return emailCode.trim().length > 0 && emailTimer > 0;
  }, [emailCode, emailTimer]);

  // 전화 인증 요청
  const handleSendPhone = async () => {
    if (!canSendPhone) return;
    try {
      setPhoneSending(true);
      await sendCodeForPhone(formData.phone);
      setPhoneTimer(300); // 5분
      setPhoneChecked(null);
    } catch (e) {
      console.error("전화 인증 요청 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "전화 인증 요청 실패",
        message: e.message || "전화 인증 요청에 실패했습니다.",
      }));
    } finally {
      setPhoneSending(false);
    }
  };

  // 전화 인증 확인
  const handleCheckPhone = async () => {
    if (!canCheckPhone) return;
    try {
      const ok = await checkCodeForPhone(formData.phone, phoneCode);
      setPhoneChecked(!!ok);
      if (ok) {
        setPhoneTimer(0); // 성공 시 타이머 종료
      }
    } catch (e) {
      setPhoneChecked(false);
      console.error("전화 인증 확인 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "전화 인증 확인 실패",
        message: e.message || "인증번호가 올바르지 않습니다.",
      }));
    }
  };

  // 이메일 인증 요청
  const handleSendEmail = async () => {
    if (!canSendEmail) return;
    try {
      setEmailSending(true);
      await sendCodeForEmail(formData.email);
      setEmailTimer(300);
      setEmailChecked(null);
    } catch (e) {
      console.error("이메일 인증 요청 실패:", e.message);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "이메일 인증 요청 실패",
        message: e.message || "이메일 인증 요청에 실패했습니다.",
      }));
    } finally {
      setEmailSending(false);
    }
  };

  // 이메일 인증 확인
  const handleCheckEmail = async () => {
    if (!canCheckEmail) return;
    try {
      const ok = await checkCodeForEmail(formData.email, emailCode);
      setEmailChecked(!!ok);
      if (ok) {
        setEmailTimer(0);
      }
    } catch (e) {
      setEmailChecked(false);
      console.error("이메일 인증 확인 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "이메일 인증 확인 실패",
        message: e.message || "인증번호가 올바르지 않습니다.",
      }));
    }
  };

  // 제출 전 간단 체크
  const handleNext = () => {
    let title = null;
    if (!formData.name?.trim()) title = "이름을 입력해주세요.";
    else if (!formData.phone || formData.phone.length < 8)
      title = "전화번호를 정확히 입력해주세요.";
    else if (!isEmail(formData.email)) title = "올바른 이메일을 입력해주세요.";
    else if (!formData.password || !isStrongPassword(formData.password))
      title =
        "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.";
    else if (formData.password !== formData.passwordConfirm)
      title = "비밀번호가 일치하지 않습니다.";
    // (선택) 인증 필수화 시:
    else if (phoneChecked !== true) title = "전화번호 인증을 완료해주세요.";
    else if (emailChecked !== true) title = "이메일 인증을 완료해주세요.";

    if (title) {
      setErrorModal({
        ...errorModal,
        visible: true,
        title: title,
        message: null,
      });
      //return;
    }
    console.log(formData);
  };

  const handleSubmit = async () => {
    //1. 데이터를 제출 형태로 가공
    //2. api 호출
    //3. 성공 시 로그인 페이지로 이동
    //4. 실패 시 에러 메시지 표시
  };

  return (
    <div>
      <div className="flex flex-col items-start mt-12 w-full gap-3">
        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <div className="form-input-wrap">
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="이름을 입력해주세요"
              value={formData.name ?? ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            전화번호
          </label>
          {/* 입력 + 인증요청 버튼 */}
          <div className="form-input-wrap relative">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className="form-input form-input--with-btn"
              placeholder="전화번호를 입력해주세요"
              value={formData.phone ?? ""}
              onChange={(e) =>
                handleInputChange("phone", e.target.value.replace(/\D/g, ""))
              }
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={handleSendPhone}
              disabled={!canSendPhone}
              title={phoneTimer > 0 ? `재전송 ${fmt(phoneTimer)}` : ""}
            >
              {phoneTimer > 0
                ? fmt(phoneTimer)
                : phoneSending
                ? "요청중..."
                : "인증 요청"}
            </button>
          </div>

          {/* 인증코드 + 확인 버튼 */}
          <div className="form-input-wrap mt-2">
            <input
              type="text"
              className="form-input form-input--with-btn"
              placeholder="발송된 인증코드를 입력해주세요"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value.trim())}
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={handleCheckPhone}
              disabled={!canCheckPhone}
            >
              확인
            </button>
          </div>
          {phoneChecked === true && (
            <p className="mt-1 text-sm text-green-600">
              전화번호 인증이 완료되었습니다.
            </p>
          )}
          {phoneChecked === false && (
            <p className="mt-1 text-sm text-red-600">
              인증번호가 올바르지 않습니다.
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <div className="form-input-wrap relative">
            <input
              id="email"
              type="email"
              className="form-input form-input--with-btn"
              placeholder="이메일을 입력해주세요"
              value={formData.email ?? ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={handleSendEmail}
              disabled={!canSendEmail}
              title={emailTimer > 0 ? `재전송 ${fmt(emailTimer)}` : ""}
            >
              {emailTimer > 0
                ? fmt(emailTimer)
                : emailSending
                ? "요청중..."
                : "인증 요청"}
            </button>
          </div>

          <div className="form-input-wrap mt-2">
            <input
              type="text"
              className="form-input form-input--with-btn"
              placeholder="발송된 인증코드를 입력해주세요"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value.trim())}
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={handleCheckEmail}
              disabled={!canCheckEmail}
            >
              확인
            </button>
          </div>
          {emailChecked === true && (
            <p className="mt-1 text-sm text-green-600">
              이메일 인증이 완료되었습니다.
            </p>
          )}
          {emailChecked === false && (
            <p className="mt-1 text-sm text-red-600">
              인증번호가 올바르지 않습니다.
            </p>
          )}
        </div>

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
              value={formData.password ?? ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
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
          <div className="mt-1 text-xs text-grayscale-500">
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
              value={formData.passwordConfirm ?? ""}
              onChange={(e) =>
                handleInputChange("passwordConfirm", e.target.value)
              }
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5"
              onClick={() => setVisiblePasswordConfirm((v) => !v)}
              aria-label={
                visiblePasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보이기"
              }
            >
              <img src={visiblePasswordConfirm ? HideIcon : ShowIcon} alt="" />
            </button>
          </div>
          {formData.passwordConfirm &&
          formData.passwordConfirm === formData.password ? (
            <p className="mt-1 text-sm text-green-600">
              비밀번호가 일치합니다.
            </p>
          ) : formData.passwordConfirm ? (
            <p className="mt-1 text-sm text-red-600">
              비밀번호가 일치하지 않습니다.
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex mt-8 w-full justify-between">
        <div>
          <ButtonWhite title="←" onPress={() => setPage(1)} />
        </div>
        <div>
          <ButtonOrange title="가입하기" onPress={handleNext} />
        </div>
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

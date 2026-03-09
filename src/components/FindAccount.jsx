import React, { useEffect, useMemo, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";
import { checkCodeForPhone, sendCodeForFindAccount } from "@utils/confirmPhone";
import ErrorModal from "@components/ErrorModal";
import { useParams } from "react-router-dom";

const fmt = (s) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export default function FindAccount({ mode, setChecked, phone, setPhone }) {
  console.log(mode);
  const findTitle = mode == "id" ? "아이디" : "비밀번호";
  const [err, setErr] = useState("");

  const [phoneCode, setPhoneCode] = useState("");

  // 인증 상태/타이머
  const [phoneTimer, setPhoneTimer] = useState(0); // 초
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(null);

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

  // 버튼 활성 조건
  const canSendPhone = useMemo(() => {
    return (phone || "").length >= 8 && phoneTimer === 0 && !phoneSending;
  }, [phone, phoneTimer, phoneSending]);

  const canCheckPhone = useMemo(() => {
    return phoneCode.trim().length > 0 && phoneTimer > 0;
  }, [phoneCode, phoneTimer]);

  // 전화 인증 요청
  const handleSendPhone = async () => {
    if (!canSendPhone) return;
    try {
      setPhoneSending(true);
      await sendCodeForFindAccount(phone);
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
      const ok = await checkCodeForPhone(phone, phoneCode);
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

  const handleFind = () => {
    setChecked(true);
  };
  return (
    <div className="w-full max-w-sm bg-neutral-white space-y-4 p-8">
      <h1 className="text-3xl font-semibold mb-8">
        {findTitle}를 찾으려면
        <br />
        본인인증이 필요해요
      </h1>

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
            value={phone ?? ""}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
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

      {err && <p className="text-sm text-red-500">{err}</p>}

      <ButtonOrange
        title={`${findTitle} 찾기`}
        disabled={!phoneChecked}
        onPress={handleFind}
      />
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

/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import useUserStore from "@stores/userStore";

import PlusIcon from "@assets/images/plus_gray.svg";
import ProfileIcon from "@assets/images/wa_profile_logo.svg";
import ShowIcon from "@assets/images/show_password.svg";
import HideIcon from "@assets/images/hide_password.svg";

import ButtonOrange from "@components/ButtonOrange";
import ErrorModal from "@components/ErrorModal";

import { sendCodeForPhone, checkCodeForPhone } from "@utils/confirmPhone";
import { profileValidation } from "@utils/validation/profileValidation";
import { isStrongPassword } from "@utils/validation/validationUtils";
import { uploadSingleImageToS3Web } from "@utils/s3ImageWeb";

import authApi from "@api/authApi";

// mm:ss 포맷
const fmt = (s) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

const isLikelyPhone = (v) => /^0\d{8,}$/.test(String(v || ""));

export default function EditProfile() {
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile); // 이름은 프로젝트에 맞게

  // ---------------- 프로필 수정 state ----------------
  const [formData, setFormData] = useState({
    photoUrl: profile?.photoUrl || "",
    name: profile?.name || "",
    phone: profile?.phone || profile?.phoneNumber || "",
    email: profile?.email || "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.photoUrl || null);
  const fileInputRef = useRef(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0 ~ 100

  const [submittingProfile, setSubmittingProfile] = useState(false);

  // ---------------- 비밀번호 재설정 state ----------------
  const [pwPhone, setPwPhone] = useState(
    profile?.phone || profile?.phoneNumber || ""
  );
  const [pwCode, setPwCode] = useState("");
  const [pwTimer, setPwTimer] = useState(0);
  const [pwSending, setPwSending] = useState(false);
  const [pwPhoneChecked, setPwPhoneChecked] = useState(null); // true / false / null

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);
  const [pwVisibleConfirm, setPwVisibleConfirm] = useState(false);

  const [submittingPw, setSubmittingPw] = useState(false);

  // ---------------- 공통 에러 모달 ----------------
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () =>
      setErrorModal((prev) => ({
        ...prev,
        visible: false,
      })),
  });

  // ---------------- 타이머 effect(비밀번호 재설정용) ----------------
  useEffect(() => {
    if (pwTimer <= 0) return;
    const id = setInterval(() => setPwTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [pwTimer]);

  const canSendPwPhone = useMemo(
    () => isLikelyPhone(pwPhone) && pwTimer === 0 && !pwSending,
    [pwPhone, pwTimer, pwSending]
  );

  const canCheckPwPhone = useMemo(
    () => pwCode.trim().length > 0 && pwTimer > 0,
    [pwCode, pwTimer]
  );

  // ---------------- 프로필 핸들러 ----------------
  const handleProfileChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 로컬 프리뷰 먼저 갱신
    const previewUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreview(previewUrl);

    try {
      setUploadingImage(true);
      setUploadProgress(0);

      // S3 업로드 (압축 + presigned URL 업로드)
      const uploadedUrl = await uploadSingleImageToS3Web(file, (progress) => {
        // progress는 0~100 이라고 가정
        setUploadProgress(progress);
      });

      if (!uploadedUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      // 업로드된 최종 URL을 formData.photoUrl 에 저장
      setFormData((prev) => ({
        ...prev,
        photoUrl: uploadedUrl,
      }));
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "이미지 업로드 실패",
        message:
          err?.message ||
          "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
      }));
      // 실패 시, 기존 서버 이미지로 롤백 (선택)
      setPhotoPreview(profile?.photoUrl || null);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // ---------------- 프로필 저장 ----------------
  const handleSaveProfile = async () => {
    const { allValid, firstError } = profileValidation(formData, {
      requirePhoneVerify: false, // 프로필 수정에선 별도 휴대폰 인증 필수 X
      requireEmailVerify: false,
    });

    if (!allValid) {
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: firstError || "입력값을 확인해주세요.",
        message: "",
      }));
      return;
    }

    try {
      setSubmittingProfile(true);

      const body = {
        businessNum: profile?.businessNum || "",
        email: formData.email,
        name: formData.name,
        phoneNumber: formData.phone,
        photoUrl: formData.photoUrl || profile?.photoUrl || "",
      };

      await authApi.updateProfile(body);

      // 전역 프로필 갱신
      if (setProfile) {
        setProfile({
          ...profile,
          ...body,
        });
      }

      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "프로필이 수정되었습니다.",
        message: "",
      }));
    } catch (e) {
      console.error("프로필 수정 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "프로필 수정 실패",
        message:
          e?.response?.data?.message ||
          e?.message ||
          "프로필 수정 중 오류가 발생했습니다.",
      }));
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    setFormData({
      photoUrl: profile?.photoUrl || "",
      name: profile?.name || "",
      phone: profile?.phone || profile?.phoneNumber || "",
      email: profile?.email || "",
    });
    setPhotoFile(null);
    setPhotoPreview(profile?.photoUrl || null);
  };

  // ---------------- 비밀번호 재설정: 휴대폰 인증 ----------------
  const handleSendPwPhone = async () => {
    if (!canSendPwPhone) return;
    try {
      setPwSending(true);
      await sendCodeForPhone(pwPhone);
      setPwTimer(300);
      setPwPhoneChecked(null);
    } catch (e) {
      console.error("비밀번호 재설정용 휴대폰 인증 요청 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "휴대폰 인증 요청 실패",
        message: e?.message || "휴대폰 인증 요청에 실패했습니다.",
      }));
    } finally {
      setPwSending(false);
    }
  };

  const handleCheckPwPhone = async () => {
    if (!canCheckPwPhone) return;
    try {
      const ok = await checkCodeForPhone(pwPhone, pwCode);
      setPwPhoneChecked(!!ok);
      if (ok) setPwTimer(0);
    } catch (e) {
      console.error("비밀번호 재설정용 휴대폰 인증 확인 실패:", e);
      setPwPhoneChecked(false);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "휴대폰 인증 확인 실패",
        message: e?.message || "인증번호가 올바르지 않습니다.",
      }));
    }
  };

  // ---------------- 비밀번호 재설정: 제출 ----------------
  const handleResetPassword = async () => {
    // 1) 휴대폰 인증 필수
    if (pwPhoneChecked !== true) {
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "휴대폰 인증이 필요합니다.",
        message: "비밀번호 재설정을 위해 휴대폰 인증을 먼저 완료해주세요.",
      }));
      return;
    }

    // 2) 비밀번호 유효성 검사
    const pwOk = isStrongPassword(newPassword);
    const pwConfirmOk = newPassword === confirmPassword;

    if (!pwOk) {
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "비밀번호를 확인해주세요.",
        message:
          "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.",
      }));
      return;
    }
    if (!pwConfirmOk) {
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "비밀번호가 일치하지 않습니다.",
        message: "",
      }));
      return;
    }

    try {
      setSubmittingPw(true);

      const body = {
        phoneNum: pwPhone,
        role: profile?.role || "HOST", // 스토어에 role 있으면 사용
        newPassword,
        confirmPassword,
      };

      await authApi.findPassword(body);

      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "비밀번호가 재설정되었습니다.",
        message: "",
      }));

      // 비밀번호 입력값 초기화
      setNewPassword("");
      setConfirmPassword("");
      setPwCode("");
      setPwTimer(0);
      setPwPhoneChecked(null);
    } catch (e) {
      console.error("비밀번호 재설정 실패:", e);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: "비밀번호 재설정 실패",
        message:
          e?.response?.data?.message ||
          e?.message ||
          "비밀번호 재설정 중 오류가 발생했습니다.",
      }));
    } finally {
      setSubmittingPw(false);
    }
  };

  return (
    <div className="container">
      <p className="page-title">프로필 수정</p>

      <div className="body-container scrollbar-hide items-center">
        {/* 프로필 이미지 */}
        <div className="relative bg-grayscale-200 w-50 h-50 rounded-full flex items-center justify-center mb-8">
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-50 h-50 rounded-full object-cover bg-grayscale-200"
              alt="profile"
            />
          ) : (
            <img
              src={ProfileIcon}
              className="w-25 h-25"
              alt="default profile"
            />
          )}
          <button
            type="button"
            onClick={handleImageClick}
            className="cursor-pointer absolute bottom-1 right-1 w-10 h-10 rounded-full bg-secondary-blue flex items-center justify-center"
          >
            <img src={PlusIcon} className="w-8 h-8" alt="change profile" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* ====== 프로필 정보 수정 영역 ====== */}
        <div className="flex flex-col items-start w-full gap-4 ">
          {profile?.businessNum && (
            <div className="form-group w-full">
              <label className="form-label">사업자번호</label>
              <div className="form-input-wrap">
                <input
                  type="text"
                  className="form-input bg-neutral-gray"
                  value={profile.businessNum}
                  readOnly
                  disabled
                />
              </div>
            </div>
          )}

          {/* 이름 */}
          <div className="form-group w-full">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <div className="form-input-wrap">
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="이름을 입력해주세요"
                value={formData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </div>
          </div>

          {/* 전화번호 (프로필용) */}
          <div className="form-group w-full">
            <label htmlFor="phone" className="form-label">
              전화번호
            </label>
            <div className="form-input-wrap">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                className="form-input"
                placeholder="전화번호를 입력해주세요"
                value={formData.phone}
                onChange={(e) =>
                  handleProfileChange(
                    "phone",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="form-group w-full">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <div className="form-input-wrap">
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 프로필 버튼 */}
        <div className="flex mt-8 w-full justify-end">
          <div>
            <ButtonOrange
              title={uploadingImage ? "이미지 업로드 중..." : "프로필 저장"}
              onPress={handleSaveProfile}
              disabled={submittingProfile || uploadingImage}
            />
          </div>
        </div>

        {/* ====== 비밀번호 재설정 영역 ====== */}
        <div className="mt-12 w-full  border-t border-grayscale-200 pt-8">
          <p className="text-base font-semibold mb-4">비밀번호 재설정</p>

          {/* 휴대폰 입력 + 인증 */}
          <div className="form-group w-full">
            <label className="form-label">휴대폰 번호</label>
            <div className="form-input-wrap relative">
              <input
                type="tel"
                inputMode="tel"
                className="form-input form-input--with-btn"
                placeholder="비밀번호 재설정을 위한 휴대폰 번호"
                value={pwPhone}
                onChange={(e) => setPwPhone(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="form-input-btn"
                onClick={handleSendPwPhone}
                disabled={!canSendPwPhone}
                title={pwTimer > 0 ? `재전송 ${fmt(pwTimer)}` : ""}
              >
                {pwTimer > 0
                  ? fmt(pwTimer)
                  : pwSending
                  ? "요청중..."
                  : "인증 요청"}
              </button>
            </div>

            <div className="form-input-wrap mt-2">
              <input
                type="text"
                className="form-input form-input--with-btn"
                placeholder="발송된 인증코드를 입력해주세요"
                value={pwCode}
                onChange={(e) => setPwCode(e.target.value.trim())}
              />
              <button
                type="button"
                className="form-input-btn"
                onClick={handleCheckPwPhone}
                disabled={!canCheckPwPhone}
              >
                확인
              </button>
            </div>
            {pwPhoneChecked === true && (
              <p className="mt-1 text-sm text-green-600">
                휴대폰 인증이 완료되었습니다.
              </p>
            )}
            {pwPhoneChecked === false && (
              <p className="mt-1 text-sm text-red-600">
                인증번호가 올바르지 않습니다.
              </p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div className="form-group w-full mt-4">
            <label className="form-label">새 비밀번호</label>
            <div className="form-input-wrap relative">
              <input
                type={pwVisible ? "text" : "password"}
                className="form-input pr-10"
                placeholder="새 비밀번호를 입력해주세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setPwVisible((v) => !v)}
              >
                <img src={pwVisible ? HideIcon : ShowIcon} alt="" />
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-group w-full mt-2">
            <label className="form-label">비밀번호 확인</label>
            <div className="form-input-wrap relative">
              <input
                type={pwVisibleConfirm ? "text" : "password"}
                className="form-input pr-10"
                placeholder="비밀번호를 다시 입력해주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setPwVisibleConfirm((v) => !v)}
              >
                <img src={pwVisibleConfirm ? HideIcon : ShowIcon} alt="" />
              </button>
            </div>
            {confirmPassword && newPassword === confirmPassword ? (
              <p className="mt-1 text-sm text-green-600">
                비밀번호가 일치합니다.
              </p>
            ) : confirmPassword ? (
              <p className="mt-1 text-sm text-red-600">
                비밀번호가 일치하지 않습니다.
              </p>
            ) : null}
          </div>

          {/* 비밀번호 재설정 버튼 */}
          <div className="flex mt-6 justify-end">
            <div>
              <ButtonOrange
                title="비밀번호 재설정"
                onPress={handleResetPassword}
                disabled={submittingPw}
              />
            </div>
          </div>
        </div>
      </div>

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

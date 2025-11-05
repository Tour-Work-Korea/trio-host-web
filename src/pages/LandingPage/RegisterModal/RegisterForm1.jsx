/* eslint-disable react/prop-types */
import React, { useMemo, useState } from "react";
import ButtonOrange from "@components/ButtonOrange";
import { uploadSensitiveImage } from "@utils/imageUpload";
import { handleSearchAddress } from "@utils/searchAddress";
import ErrorModal from "@components/ErrorModal";
import authApi from "@/api/authApi";

// ====== 공통 유틸 ======
const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
const isValidBizNo = (v) => onlyDigits(v).length === 10;

const isNonEmpty = (v) => String(v || "").trim().length > 0;
const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const isValidPhone = (v) => /^0\d{8,}$/.test(String(v || "")); // 0으로 시작 + 9자리 이상(지역/휴대폰 고려)
const isValidAddress = (v) => isNonEmpty(v);
const isValidEmployeeCount = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0;
};
const isValidImageUrl = (v) => typeof v === "string" && v.length > 0;

export default function RegisterForm1({
  formData,
  handleInputChange,
  setPage,
}) {
  const [bizChecking, setBizChecking] = useState(false);
  const [bizChecked, setBizChecked] = useState(null); // null | true | false
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () => setErrorModal((p) => ({ ...p, visible: false })),
  });

  const bizNo = formData.businessRegistrationNumber ?? "";
  const canVerifyBiz = useMemo(
    () => isValidBizNo(bizNo) && !bizChecking,
    [bizNo, bizChecking]
  );

  // 이미지 업로드
  const handleUploadImage = async () => {
    try {
      const url = await uploadSensitiveImage({ adaptive: false });
      if (url) handleInputChange("img", url);
    } catch (error) {
      setErrorModal({
        ...errorModal,
        visible: true,
        title: "사업자 등록증 업로드 실패",
        message:
          error?.message || "사업자 등록증 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  // 사업자번호 서버 검증
  const handleVerifyBizNo = async () => {
    if (!canVerifyBiz) return;
    try {
      setBizChecking(true);
      const digits = onlyDigits(bizNo);
      await authApi.verifyBusiness(digits); // 200 OK면 유효
      setBizChecked(true);
    } catch (err) {
      setBizChecked(false);
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title:
          err?.response?.data?.message ||
          "유효하지 않은 사업자번호입니다. 다시 확인해주세요.",
        message: "",
      }));
    } finally {
      setBizChecking(false);
    }
  };

  const handleNext = () => {
    const errors = [];

    // 1) 상호명
    if (!isNonEmpty(formData.businessName))
      errors.push("상호명 또는 법인명을 입력해주세요.");

    // 2) 사업장 유형
    if (!isNonEmpty(formData.businessType))
      errors.push("사업장 유형을 입력해주세요.");

    // 3) 직원 수
    if (!isValidEmployeeCount(formData.employeeCount))
      errors.push("직원 수를 정확히 입력해주세요.");

    // 4) 담당자 이름
    if (!isNonEmpty(formData.managerName))
      errors.push("담당자 이름을 입력해주세요.");

    // 5) 담당자 이메일
    if (!isValidEmail(formData.managerEmail))
      errors.push("담당자 이메일 형식이 올바르지 않습니다.");

    // 6) 사업장 전화번호
    if (!isValidPhone(formData.businessPhone))
      errors.push("전화번호 형식을 확인해주세요.");

    // 7) 주소
    if (!isValidAddress(formData.address)) errors.push("주소를 입력해주세요.");
    if (!isNonEmpty(formData.detailAddress))
      errors.push("상세 주소를 입력해주세요.");

    // 8) 사업자 등록번호(형식 + 서버확인 여부)
    if (!isValidBizNo(formData.businessRegistrationNumber))
      errors.push("사업자등록번호는 숫자 10자리여야 합니다.");
    else if (bizChecked !== true)
      errors.push("사업자등록번호 확인을 완료해주세요.");

    // 9) 사업자 등록증 이미지
    if (!isValidImageUrl(formData.img))
      errors.push("사업자 등록증 이미지를 첨부해주세요.");

    if (errors.length) {
      setErrorModal((prev) => ({
        ...prev,
        visible: true,
        title: errors[0], // 첫 번째 에러만 제목으로 표시
        message: "", // 필요하면 errors.join("\n")로 상세 표시
      }));
      //return;
    }

    // 통과
    setPage(2);
  };

  return (
    <div>
      <div className="flex flex-col items-start mt-12 w-full gap-3">
        {/* 1) 상호명 */}
        <div className="form-group">
          <label htmlFor="businessName" className="form-label">
            상호명
          </label>
          <div className="form-input-wrap">
            <input
              id="businessName"
              type="text"
              className="form-input"
              placeholder="상호명 또는 법인명을 입력해주세요"
              value={formData.businessName ?? ""}
              onChange={(e) =>
                handleInputChange("businessName", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 2) 사업장 유형 */}
        <div className="form-group">
          <label htmlFor="businessType" className="form-label">
            사업장 유형
          </label>
          <div className="form-input-wrap">
            <input
              id="businessType"
              type="text"
              className="form-input"
              placeholder="예) 게스트하우스 / 호스텔 / 카페 등"
              value={formData.businessType ?? ""}
              onChange={(e) =>
                handleInputChange("businessType", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 3) 직원 수 */}
        <div className="form-group">
          <label htmlFor="employeeCount" className="form-label">
            직원 수
          </label>
          <div className="form-input-wrap">
            <input
              id="employeeCount"
              type="number"
              inputMode="numeric"
              min={0}
              className="form-input"
              placeholder="직원 수를 입력해주세요"
              value={formData.employeeCount ?? ""}
              onChange={(e) =>
                handleInputChange("employeeCount", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 4) 담당자 이름 */}
        <div className="form-group">
          <label htmlFor="managerName" className="form-label">
            담당자 이름
          </label>
          <div className="form-input-wrap">
            <input
              id="managerName"
              type="text"
              className="form-input"
              placeholder="담당자 이름을 입력해주세요"
              value={formData.managerName ?? ""}
              onChange={(e) => handleInputChange("managerName", e.target.value)}
              required
            />
          </div>
        </div>

        {/* 5) 담당자 이메일 */}
        <div className="form-group">
          <label htmlFor="managerEmail" className="form-label">
            담당자 이메일
          </label>
          <div className="form-input-wrap">
            <input
              id="managerEmail"
              type="email"
              className="form-input"
              placeholder="담당자 이메일을 입력해주세요"
              value={formData.managerEmail ?? ""}
              onChange={(e) =>
                handleInputChange("managerEmail", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 6) 사업장 전화번호 */}
        <div className="form-group">
          <label htmlFor="businessPhone" className="form-label">
            사업장 전화번호
          </label>
          <div className="form-input-wrap">
            <input
              id="businessPhone"
              type="tel"
              inputMode="tel"
              className="form-input"
              placeholder="숫자만 입력해주세요"
              value={formData.businessPhone ?? ""}
              onChange={(e) =>
                handleInputChange("businessPhone", onlyDigits(e.target.value))
              }
              required
            />
          </div>
        </div>

        {/* 7) 사업자 주소 */}
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            사업자 주소
          </label>
          <div className="form-input-wrap">
            <input
              id="address"
              type="text"
              className="form-input form-input--with-btn"
              placeholder="주소를 입력해주세요"
              value={formData.address ?? ""}
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={() =>
                handleSearchAddress((v) => handleInputChange("address", v))
              }
            >
              주소검색
            </button>
          </div>

          <div className="form-input-wrap mt-2">
            <input
              id="detailAddress"
              type="text"
              className="form-input"
              placeholder="상세 주소를 입력해주세요"
              value={formData.detailAddress ?? ""}
              onChange={(e) =>
                handleInputChange("detailAddress", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 8) 사업자 등록번호 + 확인 */}
        <div className="form-group">
          <label htmlFor="businessRegistrationNumber" className="form-label">
            사업자 등록번호
          </label>
          <div className="form-input-wrap">
            <input
              id="businessRegistrationNumber"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              className="form-input form-input--with-btn"
              placeholder="숫자만 입력 (예: 1234567890)"
              value={bizNo}
              onChange={(e) =>
                handleInputChange(
                  "businessRegistrationNumber",
                  onlyDigits(e.target.value)
                )
              }
              required
            />
            <button
              type="button"
              className={`form-input-btn ${
                canVerifyBiz ? "" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleVerifyBizNo}
              disabled={!canVerifyBiz}
              title={!isValidBizNo(bizNo) ? "숫자 10자리여야 합니다." : ""}
            >
              {bizChecking ? "확인중..." : "확인"}
            </button>
          </div>
          {bizNo && !isValidBizNo(bizNo) && (
            <p className="mt-1 text-sm text-red-600">
              사업자번호는 숫자 10자리여야 합니다.
            </p>
          )}
          {bizChecked === true && (
            <p className="mt-1 text-sm text-green-600">
              유효한 사업자번호입니다.
            </p>
          )}
          {bizChecked === false && (
            <p className="mt-1 text-sm text-red-600">
              유효하지 않은 사업자번호입니다.
            </p>
          )}
        </div>

        {/* 9) 사업자 등록증 이미지 업로드 */}
        <div className="form-group">
          <div className="form-label">사업자 등록증 이미지</div>
          <button
            type="button"
            className="form-input-small-btn"
            onClick={handleUploadImage}
          >
            사업자 등록증 업로드
          </button>
          {formData.img && (
            <div className="mt-2">
              <img
                src={formData.img}
                alt="사업자 등록증"
                className="h-28 rounded-lg border object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex mt-8 w-full justify-end">
        <div>
          <ButtonOrange title="→" onPress={handleNext} />
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

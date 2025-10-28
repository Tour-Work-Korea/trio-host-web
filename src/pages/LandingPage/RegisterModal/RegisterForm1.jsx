/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import ButtonOrange from "@components/ButtonOrange";
import { uploadSensitiveImage } from "@utils/imageUpload";
import { handleSearchAddress } from "@utils/searchAddress";

export default function RegisterForm1({
  formData,
  handleInputChange,
  setPage,
}) {
  const handleUploadImage = async () => {
    const url = await uploadSensitiveImage({ adaptive: false });
    if (url) handleInputChange("img", url);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
              type="text" // 필요하면 select로 변경
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
                handleInputChange("businessPhone", e.target.value)
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
              onClick={() => {
                handleSearchAddress((v) => handleInputChange("address", v));
              }}
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

        {/* 8) 사업자 등록번호 */}
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
              maxLength={10} // 국내 10자리
              className="form-input"
              placeholder="숫자만 입력 (예: 1234567890)"
              value={formData.businessRegistrationNumber ?? ""}
              onChange={(e) =>
                handleInputChange(
                  "businessRegistrationNumber",
                  e.target.value.replace(/\D/g, "")
                )
              }
              required
            />
            <button
              type="button"
              className="form-input-btn"
              onClick={() => {
                /* 사업자 번호 확인 핸들러 */
              }}
            >
              확인
            </button>
          </div>
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
          <ButtonOrange title="→" onPress={() => setPage(2)} />
        </div>
      </div>
    </div>
  );
}

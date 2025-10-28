/* eslint-disable react/prop-types */
import React from "react";
import ButtonOrange from "@components/ButtonOrange";
import ButtonWhite from "@components/ButtonWhite";

export default function RegisterForm2({
  formData,
  handleInputChange,
  setPage,
}) {
  return (
    <div>
      <div className="flex flex-col items-start mt-12 w-full gap-3">
        {/*  */}
        <div className="form-group">
          <label className="form-label">전화번호</label>

          <div className="form-input-wrap">
            <input
              type="text"
              className="form-input form-input--with-btn"
              placeholder="본인의 전화번호를 입력해주세요"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
        </div>

        {/* 직원 수 */}
        <div className="form-group">
          <label htmlFor="employeeCount" className="form-label">
            직원 수
          </label>

          <div className="form-input-wrap">
            <input
              id="employeeCount"
              type="number"
              className="form-input form-input--with-btn"
              placeholder="직원 수를 입력해주세요"
              value={formData.employeeCount}
              onChange={(e) =>
                handleInputChange("employeeCount", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 사업자 주소 */}
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
              value={formData.address}
              required
            />
            <button type="button" className="form-input-btn" onClick={() => {}}>
              주소검색
            </button>
          </div>
          <div className="form-input-wrap mt-2">
            <input
              id="detailAddress"
              type="text"
              className="form-input form-input--with-btn"
              placeholder="상세 주소를 입력해주세요"
              value={formData.detailAddress}
              onChange={(e) =>
                handleInputChange("detailAddress", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 담당자 연락처 */}
        <div className="form-group">
          <label htmlFor="businessPhone" className="form-label">
            담당자 전화번호
          </label>

          <div className="form-input-wrap">
            <input
              id="businessPhone"
              type="number"
              className="form-input form-input--with-btn"
              placeholder="담당자의 전화번호를 입력해주세요"
              value={formData.businessPhone}
              onChange={(e) =>
                handleInputChange("businessPhone", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* 사업자 번호 */}
        <div className="form-group">
          <label htmlFor="businessRegistrationNumber" className="form-label">
            사업자 번호
          </label>

          <div className="form-input-wrap">
            <input
              id="businessRegistrationNumber"
              type="number"
              className="form-input form-input--with-btn"
              placeholder="사업자 번호를 입력해주세요"
              value={formData.businessRegistrationNumber}
              onChange={(e) =>
                handleInputChange("businessRegistrationNumber", e.target.value)
              }
              required
            />
          </div>
        </div>
      </div>
      <div className="flex mt-8 w-full justify-between">
        <div>
          <ButtonWhite title="←" onPress={() => setPage(1)} />
        </div>
        <div>
          <ButtonOrange title="가입하기" onPress={() => setPage(2)} />
        </div>
      </div>
    </div>
  );
}

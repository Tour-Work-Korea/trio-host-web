/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from "react";
import ButtonOrange from "@components/ButtonOrange";
import { handleSearchAddress } from "@utils/searchAddress";
import ErrorModal from "@components/ErrorModal";
import authApi from "@/api/authApi";
import { onlyDigits} from "@utils/validation/validationUtils";
import { computeStoreRegister } from "@utils/validation/storeRegisterValidation";
import ImageDropzone from "@components/ImageDropzone";
import { BizCertPreview } from "@components/BizCertPreview";
import guesthouseApi from "@api/guesthouseApi";
import { useNavigate } from "react-router-dom";

// 임시저장 import
import { createDraftStore } from "@utils/draftStorage";

export default function RegisterFormPage() {
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttonText: "확인",
    onPress: () => setErrorModal((p) => ({ ...p, visible: false })),
  });
  const [formData, setFormData] = useState({
    businessName: "", //상호명
    businessType: "", //사업장 유형
    employeeCount: "", //직원 수
    managerName: "", //담당자 이름
    managerEmail: "", //담당자 이메일
    businessPhone: "", //사업장 전화번호
    address: "", //사업자 주소
    detailAddress: "", //사업자 상세 주소
    img: null, //사업자 등록증 이미지
  });

  //임시저장 namespace 정의
  const draftStore = createDraftStore("storeRegister:new");
  useEffect(() => {
    const loaded = draftStore.load();
    if (loaded.exists) {
      setFormData(loaded.data);
    }
  }, []);



  //자동 임시저장
  const handleInputChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    draftStore.save(next);
  };

  const handleNext = () => {
    const result = computeStoreRegister(formData);
    if (!result.allValid) {
      let title = "입력값을 확인해주세요.";
      if (!result.business) title = "상호/유형/직원 수를 정확히 입력해주세요.";
      else if (!result.contact)
        title = "담당자 이름/이메일/전화번호를 확인해주세요.";
      else if (!result.addr) title = "주소와 상세 주소를 입력해주세요.";
      else if (!result.image) title = "사업자 등록증 이미지를 첨부해주세요.";
      setErrorModal((p) => ({ ...p, visible: true, title, message: "" }));
      return;
    }
    tryFetchApplications();
  };

  const tryFetchApplications = async () => {
    try {
      await guesthouseApi.postApplication(formData);
      draftStore.clear(); //임시저장 삭제
      navigate("/guesthouse/store-register");
    } catch (error) {
      setErrorModal({
        ...errorModal,
        visible: true,
        title: "입점신청서 등록 실패",
        message:
          error?.response?.data?.message ||
          "입점신청서 등록 중 오류가 발생했습니다.",
        buttonText: "확인",
      });
    }
  };

  return (
    <div className="container">
      <div className="page-title">입점신청서 등록</div>

      <div className="flex flex-col items-start mt-4 rounded-lg w-full gap-3 border-2 border-grayscale-200 p-8">
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


        {/* 8) 사업자 등록증 이미지 업로드 */}
        <div className="form-group">
          <div className="form-label">사업자 등록증 이미지</div>
          <ImageDropzone
            sensitive
            onUploadedFile={(file) => handleInputChange("img", file)}
            onError={(msg) =>
              setErrorModal({
                ...errorModal,
                visible: true,
                title: "이미지 업로드 실패",
                message: msg,
              })
            }
          />
          {formData.img && <BizCertPreview img={formData.img} />}
        </div>
      </div>

      <div className="flex mt-8 w-full justify-center">
        <div>
          <ButtonOrange title="입점신청하기" onPress={handleNext} />
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

/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import ButtonOrange from "@components/ButtonOrange";
import { handleSearchAddress } from "@utils/searchAddress";
import ErrorModal from "@components/ErrorModal";
import { onlyDigits } from "@utils/validation/validationUtils";
import { computeStoreRegister } from "@utils/validation/storeRegisterValidation";
import ImageDropzone from "@components/ImageDropzone";
import { BizCertPreview } from "@components/BizCertPreview";
import guesthouseApi from "@api/guesthouseApi";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { uploadSingleImageToS3Web } from "@utils/s3ImageWeb";
import useUserStore from "@stores/userStore";
import { updateProfile } from "@utils/authFlow";

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
    businessName: "", // 상호명
    img: null, // 사업자 등록증 이미지
    bankBook: null, // 통장 사본
    businessLicense: null, // 영업 신고증
    agreeService: false, // 서비스 이용약관 동의
    agreePrivacy: false, // 개인정보 수집 및 이용 동의
    guesthouseName: "", // 게스트하우스 명
    guesthouseImg: null, // 게스트하우스 프로필 사진
  });

  // 임시저장 namespace 정의
  const draftStore = createDraftStore("storeRegister:unified");
  useEffect(() => {
    const loaded = draftStore.load();
    if (loaded.exists) {
      setFormData({
        ...loaded.data,
        img: null, // File 객체는 localStorage에 저장될 수 없으므로 초기화
        bankBook: null,
        businessLicense: null,
        guesthouseImg: null,
      });
    }
  }, []);

  // 자동 임시저장
  const handleInputChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    draftStore.save(next);
  };

  const handleNext = () => {
    const result = computeStoreRegister(formData);

    if (!result.allValid) {
      let title = "입력값을 확인해주세요.";
      if (!result.business) title = "상호명을 입력해주세요.";
      else if (!result.image) title = "사업자 등록증 이미지를 첨부해주세요.";
      else if (!result.docs) title = "통장 사본과 영업 신고증을 첨부해주세요.";
      else if (!result.agreements) title = "필수 이용약관에 모두 동의해주세요.";
      else if (!result.guesthouse) title = "게스트하우스 명과 프로필 사진을 추가해주세요.";

      setErrorModal((p) => ({ ...p, visible: true, title, message: "" }));
      return;
    }
    tryFetchApplications();
  };

  const tryFetchApplications = async () => {
    const { profile } = useUserStore.getState();
    let applicationId = null;

    try {
      // 숨김 처리된 필수 필드들에 대해 가짜(Dummy) 데이터를 채워서 백엔드로 전송
      const payload = {
        ...formData,
        employeeCount: "0",
        managerName: profile?.name || formData.businessName, // 담당자 이름은 보통 상호명이나 사장님 이름으로 갈음
        managerEmail: profile?.email || "host@ddakji.com",    // 임시 이메일
      };

      // 1. 사업자 입점 신청 API (사업자 정보 + 등록증 이미지 + 통장사본 + 영업신고증)
      const applicationResponse = await guesthouseApi.postApplication(payload);

      applicationId = applicationResponse?.data?.applicationId || applicationResponse?.applicationId;
      if (!applicationId) {
        throw new Error("입점 신청 내역을 확인할 수 없습니다. 다시 시도해주세요.");
      }

      // 2. 게스트하우스 2차 정보 생성 로직
      let guesthouseProfileImage = "";
      if (formData.guesthouseImg) {
        guesthouseProfileImage = await uploadSingleImageToS3Web(formData.guesthouseImg, () => { });
      }

      await guesthouseApi.tempCreateGuesthouse({
        applicationId,
        guesthouseName: formData.guesthouseName.trim(),
        guesthouseProfileImage,
      });

      draftStore.clear(); // 임시저장 삭제

      setErrorModal({
        visible: true,
        title: "게스트하우스 등록 신청 완료",
        message: (
          <div className="flex flex-col items-center justify-center gap-1 py-3 text-[15px]">
            <p className="font-semibold text-grayscale-900">
              {formData.guesthouseName.trim()}에 대한 등록 심사가 진행중입니다.
            </p>
            <p className="text-grayscale-700 mt-1">등록 신청에 대한 검토는</p>
            <p className="text-grayscale-700">
              영업일기준 <span className="text-primary-blue font-bold">최대 5일</span>이 소요됩니다.
            </p>
            <p className="text-grayscale-800 font-medium mt-6">
              게딱지를 이용해주셔서 감사합니다.
            </p>
          </div>
        ),
        buttonText: "확인",
        onPress: async () => {
          // 새로 등록된 게스트하우스를 전역 상태에 반영하기 위해 프로필 업데이트 실행
          await updateProfile();
          navigate("/portal");
        }
      });

    } catch (error) {
      console.error("====== STORE REGISTER ERROR ======");
      console.error(error);
      console.error("error.message:", error.message);
      console.error("error.response?.data:", error.response?.data);

      // 에러 발생 시, 1단계 제출에는 성공했다면 해당 데이터를 롤백(삭제)
      if (applicationId) {
        await guesthouseApi.deleteApplication(applicationId).catch(console.error);
      }

      setErrorModal({
        ...errorModal,
        visible: true,
        title: "게스트하우스 등록 실패",
        message:
          error?.response?.data?.message ||
          "게스트하우스 등록 중 오류가 발생했습니다.",
        buttonText: "확인",
      });
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6 mb-12">

      {/* 폼 컨테이너 */}
      <div className="bg-white rounded-3xl border border-grayscale-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] px-10 py-12">

        {/* 타이틀 영역 */}
        <div className="mb-10 text-center border-b border-grayscale-100 pb-8">
          <h1 className="text-3xl font-extrabold text-grayscale-900 mb-2">
            새 게스트하우스 등록
          </h1>
          <p className="text-grayscale-500 font-medium tracking-tight">
            게딱지에 게스트하우스를 등록하기 위한 필수 정보를 작성해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-12">

          {/* ----- 1. 사업자 기본 정보 ----- */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
              <div>
                <h2 className="text-[19px] font-extrabold text-grayscale-900 leading-tight">사업자 정보</h2>
                <p className="text-grayscale-400 text-sm mt-0.5">사업자등록증에 표기된 대로 정확하게 입력해주세요.</p>
              </div>
            </div>

            <div className="space-y-6 ml-10 p-6 bg-grayscale-50/50 rounded-2xl border border-grayscale-100/60">
              <div className="form-group w-full">
                <label htmlFor="businessName" className="form-label font-bold">
                  사업자 등록 상호명 or 법인명
                </label>
                <div className="form-input-wrap">
                  <input
                    id="businessName"
                    type="text"
                    className="form-input bg-white border border-grayscale-200 focus:border-primary-blue transition-colors rounded-xl px-4 py-3.5"
                    placeholder="예) (주)딱지컴퍼니"
                    value={formData.businessName ?? ""}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group w-full">
                <div className="form-label font-bold mb-1">사업자 등록증 사본</div>
                <p className="text-xs text-grayscale-500 mb-3">주민등록번호 등 민감한 개인정보는 가리고 업로드해주세요.</p>
                <div className="bg-white rounded-xl max-w-[200px] border border-dashed border-grayscale-300 hover:border-primary-blue transition-colors overflow-hidden">
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
                </div>
                {formData.img && (
                  <div className="mt-3 max-w-[200px] shadow-sm rounded-lg overflow-hidden border border-grayscale-200">
                    <BizCertPreview img={formData.img} />
                  </div>
                )}
              </div>

              <div className="form-group w-full">
                <div className="form-label font-bold mb-1">통장 사본</div>
                <p className="text-xs text-grayscale-500 mb-3">정산을 지급받으실 계좌의 통장 사본을 업로드해주세요.</p>
                <div className="bg-white rounded-xl max-w-[200px] border border-dashed border-grayscale-300 hover:border-primary-blue transition-colors overflow-hidden">
                  <ImageDropzone
                    sensitive
                    onUploadedFile={(file) => handleInputChange("bankBook", file)}
                    onError={(msg) =>
                      setErrorModal({
                        ...errorModal,
                        visible: true,
                        title: "이미지 업로드 실패",
                        message: msg,
                      })
                    }
                  />
                </div>
                {formData.bankBook && (
                  <div className="mt-3 max-w-[200px] shadow-sm rounded-lg overflow-hidden border border-grayscale-200">
                    <BizCertPreview img={formData.bankBook} />
                  </div>
                )}
              </div>

              <div className="form-group w-full">
                <div className="form-label font-bold mb-1">영업 신고증</div>
                <p className="text-xs text-grayscale-500 mb-3">최근 발급된 유효한 영업 신고증 사본을 업로드해주세요.</p>
                <div className="bg-white rounded-xl max-w-[200px] border border-dashed border-grayscale-300 hover:border-primary-blue transition-colors overflow-hidden">
                  <ImageDropzone
                    sensitive
                    onUploadedFile={(file) => handleInputChange("businessLicense", file)}
                    onError={(msg) =>
                      setErrorModal({
                        ...errorModal,
                        visible: true,
                        title: "이미지 업로드 실패",
                        message: msg,
                      })
                    }
                  />
                </div>
                {formData.businessLicense && (
                  <div className="mt-3 max-w-[200px] shadow-sm rounded-lg overflow-hidden border border-grayscale-200">
                    <BizCertPreview img={formData.businessLicense} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ----- 2. 게스트하우스 2차 정보 ----- */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold shadow-sm">2</div>
              <div>
                <h2 className="text-[19px] font-extrabold text-grayscale-900 leading-tight">게스트하우스 정보</h2>
                <p className="text-grayscale-400 text-sm mt-0.5">앱에서 고객들에게 보여질 숙소 이름과 대표 프사를 설정해주세요.</p>
              </div>
            </div>

            <div className="space-y-6 ml-10 p-6 bg-grayscale-50/50 rounded-2xl border border-grayscale-100/60">
              <div className="form-group w-full">
                <label htmlFor="guesthouseName" className="form-label font-bold">
                  숙소 이름
                </label>
                <div className="form-input-wrap">
                  <input
                    id="guesthouseName"
                    type="text"
                    className="form-input bg-white border border-grayscale-200 focus:border-primary-blue transition-colors rounded-xl px-4 py-3.5"
                    placeholder="예) 강릉 오션 게스트하우스"
                    value={formData.guesthouseName ?? ""}
                    onChange={(e) => handleInputChange("guesthouseName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group w-full">
                <div className="form-label font-bold mb-1">숙소 대표 사진</div>
                <div className="bg-white rounded-xl max-w-[200px] border border-dashed border-grayscale-300 hover:border-primary-blue transition-colors overflow-hidden mt-2">
                  <ImageDropzone
                    sensitive
                    onUploadedFile={(file) => handleInputChange("guesthouseImg", file)}
                    onError={(msg) =>
                      setErrorModal({
                        ...errorModal,
                        visible: true,
                        title: "이미지 업로드 실패",
                        message: msg,
                      })
                    }
                  />
                </div>
                {formData.guesthouseImg && (
                  <div className="mt-3 max-w-[200px] shadow-sm rounded-lg overflow-hidden border border-grayscale-200">
                    <BizCertPreview img={formData.guesthouseImg} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ----- 3. 약관 동의 ----- */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold shadow-sm">3</div>
              <div>
                <h2 className="text-[19px] font-extrabold text-grayscale-900 leading-tight">약관 동의</h2>
                <p className="text-grayscale-400 text-sm mt-0.5">서비스 이용을 위한 필수 약관에 동의해주세요.</p>
              </div>
            </div>

            <div className="space-y-4 ml-10 p-6 bg-white rounded-2xl border border-grayscale-200 shadow-sm shadow-grayscale-100/50">
              <div className="flex items-center justify-between group">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${formData.agreeService ? 'bg-primary-orange border-primary-orange' : 'bg-white border-grayscale-300 group-hover:border-primary-orange'}`}>
                    {formData.agreeService && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.agreeService}
                    onChange={(e) => handleInputChange("agreeService", e.target.checked)}
                  />
                  <span className="text-grayscale-800 font-medium">
                    <span className="text-primary-blue font-bold mr-1.5">[필수]</span>
                    서비스 이용약관 동의
                  </span>
                </label>
                <button
                  type="button"
                  className="text-grayscale-400 text-sm font-semibold hover:text-primary-blue underline underline-offset-2"
                  onClick={() => alert("약관 내용은 준비 중입니다.")}
                >
                  보기
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${formData.agreePrivacy ? 'bg-primary-orange border-primary-orange' : 'bg-white border-grayscale-300 group-hover:border-primary-orange'}`}>
                    {formData.agreePrivacy && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.agreePrivacy}
                    onChange={(e) => handleInputChange("agreePrivacy", e.target.checked)}
                  />
                  <span className="text-grayscale-800 font-medium">
                    <span className="text-primary-blue font-bold mr-1.5">[필수]</span>
                    개인정보 수집 및 이용 동의
                  </span>
                </label>
                <button
                  type="button"
                  className="text-grayscale-400 text-sm font-semibold hover:text-primary-blue underline underline-offset-2"
                  onClick={() => alert("약관 내용은 준비 중입니다.")}
                >
                  보기
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* ----- 다음 버튼 ----- */}
        <div className="mt-12 flex justify-end pb-4 pt-6 border-t border-grayscale-100">
          <button
            type="button"
            onClick={handleNext}
            className="bg-primary-blue hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary-blue/20"
          >
            등록하기
            <Check className="w-5 h-5" strokeWidth={3} />
          </button>
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

import React, { useState } from "react";
import { ArrowLeft, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterModal({
  visible,
  setVisible,
  formData,
  setFormData,
}) {
  const [agreed, setAgreed] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ visible: false, message: "", isSuccess: false });

  if (!visible) return null;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const showAlert = (message, isSuccess = false) => {
    setAlertInfo({ visible: true, message, isSuccess });
  };

  const closeAlert = () => {
    const isSuccess = alertInfo.isSuccess;
    setAlertInfo({ visible: false, message: "", isSuccess: false });
    if (isSuccess) {
      setVisible(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.businessName || !formData.managerName || !formData.address || !formData.phone) {
      showAlert("모든 필드를 입력해주세요.");
      return;
    }
    if (!agreed) {
      showAlert("원활한 상담을 위해 동의에 체크해주세요.");
      return;
    }
    showAlert("입점 신청이 정상적으로 접수되었습니다.\n24시간 이내에 담당자가 전화를 드릴 예정이니\n잠시만 기다려주세요!", true);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#F4F6F9] flex flex-col pt-12 md:pt-24 items-center overflow-y-auto w-full h-full">
      <div className="w-full max-w-[540px] px-6 pb-20">
        {/* Back button */}
        <button
          onClick={() => setVisible(false)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-10 -ml-2 select-none"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          <span className="text-[15px] font-medium">호스트 페이지로 돌아가기</span>
        </button>

        {/* Header */}
        <div className="mb-8 text-left">
          <h2 className="text-[32px] md:text-[38px] font-[800] mb-4 text-[#1A1A1A] tracking-tight whitespace-pre-wrap leading-tight">
            게딱지 파트너 합류하기
          </h2>
          <p className="text-[15px] md:text-[16px] text-gray-500 font-medium">
            딱 10초면 충분해요! 연락처만 남겨주시면 24시간내로 연락드릴게요.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_12px_50px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-8">

          {/* 게스트하우스 이름 */}
          <div className="flex flex-col gap-3">
            <label className="text-[15px] font-bold text-gray-900">게스트하우스 이름</label>
            <input
              type="text"
              placeholder="예) *** 게스트하우스"
              className="w-full h-[54px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-[15px] placeholder:text-gray-400"
              value={formData.businessName || ""}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
            />
          </div>

          {/* 사장님 성함 */}
          <div className="flex flex-col gap-3">
            <label className="text-[15px] font-bold text-gray-900">성함</label>
            <input
              type="text"
              placeholder="예) 홍길동"
              className="w-full h-[54px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-[15px] placeholder:text-gray-400"
              value={formData.managerName || ""}
              onChange={(e) => handleInputChange("managerName", e.target.value)}
            />
          </div>

          {/* 지역 */}
          <div className="flex flex-col gap-3">
            <label className="text-[15px] font-bold text-gray-900">지역</label>
            <div className="relative">
              <select
                className={`w-full h-[54px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-[15px] appearance-none bg-white cursor-pointer ${!formData.address ? 'text-gray-400' : 'text-gray-900'}`}
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
              >
                <option value="" disabled hidden>지역을 선택해주세요</option>
                <option value="서울">서울</option>
                <option value="제주">제주</option>
                <option value="부산">부산</option>
                <option value="강원">강원</option>
                <option value="전주/전북">전주/전북</option>
                <option value="여수/전남">여수/전남</option>
                <option value="당진/충남">당진/충남</option>
                <option value="경주/경북">경주/경북</option>
                <option value="기타">기타 지역</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>
          </div>

          {/* 연락처 */}
          <div className="flex flex-col gap-3">
            <label className="text-[15px] font-bold text-gray-900">연락처</label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              className="w-full h-[54px] px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-[15px] placeholder:text-gray-400"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="pt-2 flex flex-col gap-7">
            {/* 동의 체크박스 */}
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="consent"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary"
                />
              </div>
              <label htmlFor="consent" className="text-[15px] text-gray-600 cursor-pointer select-none leading-relaxed tracking-tight">
                원활한 상담을 위해 위 정보를 확인하고 수집하는 것에 동의합니다.
              </label>
            </div>

            {/* 버튼 */}
            <button
              onClick={handleSubmit}
              className="w-full h-[58px] bg-primary hover:bg-primary/90 text-white text-[16px] font-bold rounded-[14px] transition-colors shadow-sm active:scale-[0.98]"
            >
              신청하기
            </button>
          </div>

        </div>
      </div>

      {/* 내부 커스텀 알림 모달 */}
      {alertInfo.visible && (
        <div className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center p-4 backdrop-blur-[2px]">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-[360px] shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-5">
              {alertInfo.isSuccess ? <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} /> : <AlertCircle className="w-8 h-8" strokeWidth={2.5} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">안내</h3>
            <p className="text-[15px] text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {alertInfo.message}
            </p>
            <button
              onClick={closeAlert}
              className="w-full h-[52px] bg-primary hover:bg-primary/90 text-white font-bold rounded-[14px] transition-all shadow-sm active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

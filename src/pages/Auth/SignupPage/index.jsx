import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import authApi from "@api/authApi";
import { AGREEMENT_CONTENTS } from "@data/agreeContents";

export default function SignupPage() {
  const navigate = useNavigate();

  // 1. 이메일
  const [email, setEmail] = useState("");
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // 2. 전화번호
  const [phone, setPhone] = useState("");
  const [phoneRequested, setPhoneRequested] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 3. 필수 정보
  const [name, setName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessVerified, setBusinessVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 약관 동의
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, age: false });
  const allAgreed = agreements.terms && agreements.privacy && agreements.age;

  const toggleAll = () => {
    const newValue = !allAgreed;
    setAgreements({ terms: newValue, privacy: newValue, age: newValue });
  };

  // 모달 상태
  const [modalContent, setModalContent] = useState(null);

  const handleOpenTerms = (key) => {
    setModalContent(AGREEMENT_CONTENTS[key]);
  };

  // 시뮬레이션 -> 실제 API 연동
  const handleEmailRequest = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    try {
      await authApi.sendEmail(email);
      setEmailRequested(true);
      alert("이메일로 인증번호가 발송되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "이메일 인증 요청에 실패했습니다.");
    }
  };

  const handleEmailVerify = async () => {
    if (!emailCode) return alert("인증번호를 입력해주세요.");
    try {
      await authApi.verifyEmail(email, emailCode);
      setEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "인증번호가 올바르지 않습니다.");
    }
  };

  const handlePhoneRequest = async () => {
    if (!phone) return alert("전화번호를 입력해주세요.");
    try {
      await authApi.sendSms(phone);
      setPhoneRequested(true);
      alert("입력하신 번호로 인증번호가 발송되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "전화번호 인증 요청에 실패했습니다.");
    }
  };

  const handlePhoneVerify = async () => {
    if (!phoneCode) return alert("인증번호를 입력해주세요.");
    try {
      await authApi.verifySms(phone, phoneCode);
      setPhoneVerified(true);
      alert("전화번호 인증이 완료되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "인증번호가 올바르지 않습니다.");
    }
  };

  const handleBusinessVerify = async () => {
    if (!businessNumber) return alert("사업자번호를 입력해주세요.");
    try {
      await authApi.verifyBusiness(businessNumber);
      setBusinessVerified(true);
      alert("사업자번호 인증이 완료되었습니다.");
    } catch (error) {
      setBusinessVerified(false);
      alert(error.response?.data?.message || "유효하지 않은 사업자번호입니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 기본적인 빈값 체크
    if (!email || !phone || !name || !businessNumber || !password) {
      return alert("모든 항목을 입력하고 인증해주세요.");
    }
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");
    if (!phoneVerified) return alert("전화번호 인증을 완료해주세요.");
    if (!businessVerified) return alert("사업자번호 인증을 완료해주세요.");

    if (password !== passwordConfirm) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    if (!allAgreed) {
      return alert("필수 약관에 모두 동의해주세요.");
    }

    try {
      const dtoObj = {
        name,
        email,
        phoneNum: phone,
        bussinessNum: businessNumber,
        password,
        userRole: "HOST",
        agreements,
      };
      await authApi.signUp(dtoObj, null);
      alert("성공적으로 파트너 가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6 flex-1 bg-grayscale-100 min-h-screen">
      <div className="w-full max-w-lg bg-neutral-white rounded-3xl p-8 sm:p-10 shadow-sm border border-grayscale-200">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-gray-900 text-center">
          회원가입
        </h1>
        <p className="text-center text-grayscale-500 mb-10 text-sm">
          회원가입을 위한 필수 정보를 알려주세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* 섹션 1: 이메일 인증 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">이메일 인증</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@gmail.com"
                className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm disabled:bg-grayscale-100 disabled:text-grayscale-500"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                disabled={emailVerified}
              />
              <button
                type="button"
                onClick={handleEmailRequest}
                disabled={emailVerified}
                className="shrink-0 px-4 h-12 rounded-xl border border-primary-orange text-primary-orange hover:bg-primary-orange/5 text-sm font-semibold transition-colors disabled:border-grayscale-300 disabled:text-grayscale-400 disabled:bg-grayscale-100"
              >
                {emailVerified ? "인증완료" : "인증요청"}
              </button>
            </div>
            {emailRequested && (
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="인증번호 6자리"
                    className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-16 disabled:bg-grayscale-100 disabled:text-grayscale-500"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    disabled={emailVerified}
                  />
                  {!emailVerified && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-orange text-sm font-medium">04:59</span>}
                </div>
                <button
                  type="button"
                  onClick={handleEmailVerify}
                  disabled={emailVerified}
                  className={`shrink-0 px-6 h-12 rounded-xl text-sm font-bold transition-colors ${emailVerified ? 'bg-grayscale-300 text-white cursor-not-allowed' : 'bg-primary-orange text-white hover:bg-primary-orange/90'}`}
                >
                  확인
                </button>
              </div>
            )}
          </div>

          {/* 섹션 2: 전화번호 인증 */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900">전화번호 인증</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="01012341234"
                className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm disabled:bg-grayscale-100 disabled:text-grayscale-500"
                value={phone}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^0-9]/g, "");
                  setPhone(filtered);
                  setPhoneVerified(false);
                }}
                disabled={phoneVerified}
              />
              <button
                type="button"
                onClick={handlePhoneRequest}
                disabled={phoneVerified}
                className="shrink-0 px-4 h-12 rounded-xl border border-primary-orange text-primary-orange hover:bg-primary-orange/5 text-sm font-semibold transition-colors disabled:border-grayscale-300 disabled:text-grayscale-400 disabled:bg-grayscale-100"
              >
                {phoneVerified ? "인증완료" : "인증요청"}
              </button>
            </div>
            {phoneRequested && (
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="인증번호 6자리"
                    className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-16 disabled:bg-grayscale-100 disabled:text-grayscale-500"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    disabled={phoneVerified}
                  />
                  {!phoneVerified && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-orange text-sm font-medium">04:59</span>}
                </div>
                <button
                  type="button"
                  onClick={handlePhoneVerify}
                  disabled={phoneVerified}
                  className={`shrink-0 px-6 h-12 rounded-xl text-sm font-bold transition-colors ${phoneVerified ? 'bg-grayscale-300 text-white cursor-not-allowed' : 'bg-primary-orange text-white hover:bg-primary-orange/90'}`}
                >
                  확인
                </button>
              </div>
            )}
          </div>

          {/* 섹션 3: 파트너 정보 */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">이름</label>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">사업자번호</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="1234567891"
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm disabled:bg-grayscale-100 disabled:text-grayscale-500"
                  value={businessNumber}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^0-9]/g, "");
                    setBusinessNumber(filtered);
                    setBusinessVerified(false);
                  }}
                  disabled={businessVerified}
                />
                <button
                  type="button"
                  onClick={handleBusinessVerify}
                  disabled={businessVerified}
                  className={`shrink-0 px-6 h-12 rounded-xl text-sm font-bold transition-colors ${businessVerified ? 'bg-grayscale-300 text-white cursor-not-allowed' : 'bg-primary-orange hover:bg-primary-orange/90 text-white'}`}
                >
                  확인
                </button>
              </div>
              {businessVerified && (
                <p className="flex items-center text-sm text-semantic-green font-medium mt-2">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  인증 성공했습니다!
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grayscale-400 hover:text-grayscale-600"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-grayscale-400 mt-1">영문 대소문자 포함 · 숫자 포함 · 특수문자 포함 · 8-20자 이내</p>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="다시 한 번 입력해주세요"
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-12"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grayscale-400 hover:text-grayscale-600"
                >
                  {showPasswordConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {passwordConfirm && password === passwordConfirm && (
                <p className="text-xs text-semantic-green font-medium">비밀번호 일치</p>
              )}
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-xs text-semantic-red font-medium">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>

          {/* 섹션 4: 약관 동의 */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3 pb-4 border-b border-grayscale-200">
              <input
                type="checkbox"
                checked={allAgreed}
                onChange={toggleAll}
                className="w-[22px] h-[22px] rounded border-2 border-grayscale-300 text-primary-orange outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary-orange"
              />
              <span className="font-bold text-gray-900 text-[16px]">전체동의</span>
            </div>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => setAgreements({ ...agreements, terms: e.target.checked })}
                    className="w-[22px] h-[22px] rounded border-2 border-grayscale-300 text-primary-orange outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary-orange"
                  />
                  <span className="text-gray-700 text-[15px]"><span className="text-primary-orange font-semibold mr-1">[필수]</span> 서비스 이용약관 동의</span>
                </div>
                <button type="button" onClick={() => handleOpenTerms("TERMS_OF_SERVICE")} className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreements.age}
                    onChange={(e) => setAgreements({ ...agreements, age: e.target.checked })}
                    className="w-[22px] h-[22px] rounded border-2 border-grayscale-300 text-primary-orange outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary-orange"
                  />
                  <span className="text-gray-700 text-[15px]"><span className="text-primary-orange font-semibold mr-1">[필수]</span> 만 14세 이상 확인</span>
                </div>
                <button type="button" onClick={() => handleOpenTerms("AGE_OVER_14_CONFIRMATION")} className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => setAgreements({ ...agreements, privacy: e.target.checked })}
                    className="w-[22px] h-[22px] rounded border-2 border-grayscale-300 text-primary-orange outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer accent-primary-orange"
                  />
                  <span className="text-gray-700 text-[15px]"><span className="text-primary-orange font-semibold mr-1">[필수]</span> 개인정보 수집 및 이용 동의</span>
                </div>
                <button type="button" onClick={() => handleOpenTerms("PRIVACY_POLICY")} className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 mt-4 bg-primary-orange text-white text-base font-bold rounded-xl hover:bg-primary-orange/90 transition-colors shadow-sm"
          >
            다음
          </button>

          <div className="flex gap-2 text-sm justify-center mt-6">
            <p className="text-grayscale-400">이미 계정이 있으신가요?</p>
            <Link to="/login" className="font-semibold text-primary-orange hover:underline">
              로그인하기
            </Link>
          </div>

        </form>
      </div>

      {/* 약관 보기 모달 */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-grayscale-200">
              <h2 className="text-xl font-bold text-gray-900">{modalContent.title}</h2>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto p-6 text-[15px] text-gray-800 space-y-4 leading-relaxed [&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_h2]:hidden [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-grayscale-200 [&_th]:bg-grayscale-100 [&_th]:p-2 [&_td]:border [&_td]:border-grayscale-200 [&_td]:p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: modalContent.detailHtml }}
            />
            
            <div className="p-6 pt-4 border-t border-grayscale-200">
              <button 
                type="button"
                onClick={() => setModalContent(null)}
                className="w-full h-12 bg-primary-orange text-white font-bold rounded-xl hover:bg-primary-orange/90 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

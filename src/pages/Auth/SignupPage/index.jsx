import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();

  // 1. 이메일
  const [email, setEmail] = useState("");
  const [emailRequested, setEmailRequested] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  // 2. 전화번호
  const [phone, setPhone] = useState("");
  const [phoneRequested, setPhoneRequested] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");

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

  // 시뮬레이션
  const handleEmailRequest = () => {
    if (!email) return alert("이메일을 입력해주세요.");
    setEmailRequested(true);
    alert("이메일로 인증번호가 발송되었습니다.");
  };

  const handlePhoneRequest = () => {
    if (!phone) return alert("전화번호를 입력해주세요.");
    setPhoneRequested(true);
    alert("입력하신 번호로 인증번호가 발송되었습니다.");
  };

  const handleBusinessVerify = () => {
    if (!businessNumber) return alert("사업자번호를 입력해주세요.");
    setBusinessVerified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 기본적인 빈값 체크
    if (!email || !phone || !name || !businessNumber || !password) {
      return alert("모든 항목을 입력하고 인증해주세요.");
    }
    if (password !== passwordConfirm) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    if (!allAgreed) {
      return alert("필수 약관에 모두 동의해주세요.");
    }
    alert("성공적으로 파트너 가입이 완료되었습니다!");
    navigate("/login");
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
                className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleEmailRequest}
                className="shrink-0 px-4 h-12 rounded-xl border border-primary-orange text-primary-orange hover:bg-primary-orange/5 text-sm font-semibold transition-colors"
              >
                인증요청
              </button>
            </div>
            {emailRequested && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="인증번호 6자리"
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-20"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-orange text-sm font-medium">04:59</span>
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
                className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                type="button"
                onClick={handlePhoneRequest}
                className="shrink-0 px-4 h-12 rounded-xl border border-primary-orange text-primary-orange hover:bg-primary-orange/5 text-sm font-semibold transition-colors"
              >
                인증요청
              </button>
            </div>
            {phoneRequested && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="인증번호 6자리"
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm pr-20"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-orange text-sm font-medium">04:59</span>
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
                  className="w-full h-12 px-4 rounded-xl border border-grayscale-300 focus:outline-none focus:border-primary-orange transition-colors text-sm"
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleBusinessVerify}
                  className="shrink-0 px-6 h-12 rounded-xl bg-primary-orange hover:bg-primary-orange/90 text-white text-sm font-bold transition-colors"
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
                <button type="button" className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
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
                <button type="button" className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
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
                <button type="button" className="text-[13px] text-primary-orange font-semibold hover:underline">보기</button>
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
    </div>
  );
}

import React, { useEffect } from "react";

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-grayscale-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-grayscale-200">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-grayscale-900 tracking-tight">개인정보처리방침</h1>
        <p className="text-grayscale-500 font-medium mb-12">워커웨이 서비스 개인정보처리방침 및 마케팅 수신 동의</p>
        
        <div className="space-y-12 text-sm sm:text-base text-grayscale-600 leading-loose break-keep">
          
          <section>
            <p className="mb-6">회사는 서비스 이용 시 아래와 같이 개인정보를 처리합니다. 추가적인 개인정보를 수집하는 경우 해당 사실을 알리고 동의를 구하고 있습니다.</p>
            
            <div className="overflow-x-auto rounded-xl border border-grayscale-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-grayscale-50 text-grayscale-900 text-sm">
                  <tr>
                    <th className="border-b border-grayscale-200 p-4 font-bold w-1/5">법적 근거</th>
                    <th className="border-b border-grayscale-200 p-4 font-bold w-1/4">수집·이용목적</th>
                    <th className="border-b border-grayscale-200 p-4 font-bold w-1/4">항목</th>
                    <th className="border-b border-grayscale-200 p-4 font-bold w-1/4">보유·이용기간</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-grayscale-200">
                  <tr>
                    <td className="p-4 align-top">개인정보 보호법 제15조<br/>제1항 제4호(계약이행)</td>
                    <td className="p-4 align-top">
                      <ul className="list-disc pl-4 space-y-1">
                        <li>이메일 및 간편 회원가입</li>
                        <li>서비스 이용</li>
                        <li>상담·불만·민원처리</li>
                        <li>결제 취소 및 환불</li>
                        <li>불법·부정 이용방지</li>
                      </ul>
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-bold text-grayscale-900 mb-1">가입 및 서비스 이용시</p>
                      <p className="mb-3">ID(이메일), 비밀번호, 이름, 휴대폰 번호, 업체 정보</p>
                      <p className="font-bold text-grayscale-900 mb-1">고객상담 시</p>
                      <p>상담내용 및 상담에 필요한 기타 개인정보</p>
                    </td>
                    <td className="p-4 align-top">
                      <ul className="list-disc pl-4 space-y-2 text-grayscale-900 font-medium">
                        <li>회원 탈퇴 시까지</li>
                        <li>단, 관계법령에 의해 보존할 경우 그 의무 기간 동안 보관</li>
                        <li>환불 처리 및 민원처리를 위해 추가 30일 보관 후 삭제</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 align-top">개인정보 보호법 제15조<br/>제1항 제4호(계약이행)</td>
                    <td className="p-4 align-top">
                      <ul className="list-disc pl-4 space-y-1">
                        <li>본인인증 및 성인인증 관련</li>
                        <li>본인인증 정보로 회원 실명 반영</li>
                      </ul>
                    </td>
                    <td className="p-4 align-top">이름, 생년월일, 성별, 휴대폰번호, CI</td>
                    <td className="p-4 align-top">
                      <ul className="list-disc pl-4 space-y-2 text-grayscale-900 font-medium">
                        <li>회원 탈퇴 시까지 유지</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm bg-blue-50/50 text-blue-600 p-4 rounded-lg font-medium">※ 동의를 거부할 권리가 있으나, 서비스 제공에 필수적인 항목이므로 동의하지 않을 경우 가입 및 이용이 극히 제한될 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-grayscale-900 mb-6 pb-2 border-b border-grayscale-200">개인정보의 보유기간 및 파기</h2>
            
            <div className="space-y-6">
              <p>회사는 이용자가 동의를 철회하거나 개인정보 보유기간의 경과, 처리목적을 달성 할 경우 지체없이 해당 개인정보를 파기합니다.</p>
              <p>부정 이용 방지를 위해 ID 및 주요 식별값은 탈퇴 일정 기간(7일) 후 파기됩니다.</p>
              <p>이용자로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 법령에 따라 보관해야 하는 경우 별도 테이블로 분리하여 엄격히 보관합니다.</p>

              <div className="overflow-x-auto rounded-xl border border-grayscale-200 mt-6 !mb-8">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-grayscale-50 text-grayscale-900 text-sm">
                    <tr>
                      <th className="border-b border-grayscale-200 p-4 font-bold w-1/4">보유 정보</th>
                      <th className="border-b border-grayscale-200 p-4 font-bold w-1/3">보유 항목</th>
                      <th className="border-b border-grayscale-200 p-4 font-bold w-1/6">보유 기간</th>
                      <th className="border-b border-grayscale-200 p-4 font-bold w-1/4">법적 근거</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-grayscale-200">
                    <tr>
                      <td className="p-4 align-top">대금결제/이용 기록</td>
                      <td className="p-4 align-top">예약내역, 이름, 연락처</td>
                      <td className="p-4 align-top">5년</td>
                      <td className="p-4 align-top text-xs">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="p-4 align-top">소비자 불만/분쟁처리</td>
                      <td className="p-4 align-top">상담내용 및 개인정보</td>
                      <td className="p-4 align-top">3년</td>
                      <td className="p-4 align-top text-xs">전자상거래법</td>
                    </tr>
                    <tr>
                      <td className="p-4 align-top">웹 접속 방문 기록</td>
                      <td className="p-4 align-top">접속로그, IP, 쿠키</td>
                      <td className="p-4 align-top">3개월</td>
                      <td className="p-4 align-top text-xs">통신비밀보호법</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-grayscale-900">개인정보의 파기 절차 및 방법은 다음과 같습니다.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-bold text-grayscale-900">파기 절차</span>: 목적 달성 후 내부 물리적 보안 지침에 따라 영구 파기 데이터 목록을 추출하여 스크립트로 분리 보관 후 파기 기한 도래 시 즉각 파기합니다.</li>
                  <li><span className="font-bold text-grayscale-900">파기 방법</span>: 전자적 파일(DB) 형태의 개인정보는 레코드를 복구 불가능하게 영구 덮어쓰기 논리 삭제합니다.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-grayscale-50 p-6 md:p-8 rounded-2xl border border-grayscale-200">
            <h2 className="text-xl font-extrabold text-grayscale-900 mb-4">마케팅 알림 수신 동의 (선택)</h2>
            <div className="space-y-6">
              <p className="font-bold text-primary-blue">회사는 사장님에게 유용한 프로모션, B2B 혜택 등을 전달하기 위해 마케팅 알림을 전송할 수 있습니다.</p>
              <div>
                <h3 className="font-bold text-grayscale-800 mb-2">수신 내용 예시:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>워커웨이 호스트 대상 전용 수수료 이벤트</li>
                  <li>신규 기능 업데이트 및 지원금 정보 등 안내</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-xl border border-grayscale-200 text-sm mt-4">
                <h3 className="font-extrabold text-grayscale-900 mb-2">유의사항:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>마케팅 수신 동의는 온전히 선택사항이며 제재를 받거나 불이익을 받지 않습니다.</li>
                  <li>수신을 원하지 않을 경우 설정 프로필에서 언제든 알림을 OFF로 돌릴 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

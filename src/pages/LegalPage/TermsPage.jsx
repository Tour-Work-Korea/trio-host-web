import React, { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-grayscale-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-grayscale-200">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-grayscale-900 tracking-tight">서비스 이용약관</h1>
        <p className="text-grayscale-500 font-medium mb-12">워커웨이 일자리 및 숙박 플랫폼 회원 약관</p>
        
        <div className="space-y-12 text-sm sm:text-base text-grayscale-600 leading-loose break-keep">
          
          {/* 제1장 */}
          <section>
            <h2 className="text-xl font-extrabold text-grayscale-900 mb-6 pb-2 border-b border-grayscale-200">제1장 (총칙)</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제1조 (목적)</h3>
                <p>본 약관은 워커웨이 (이하 "회사") 가 운영하는 "서비스"를 이용함에 있어 "회사"와 회원간의 이용 조건 및 제반 절차, 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제2조 (용어의 정의)</h3>
                <p className="mb-2">이 약관에서 사용하는 정의는 다음과 같습니다.</p>
                <ul className="list-none space-y-2 pl-2">
                  <li><span className="font-extrabold text-grayscale-700">1호</span> "서비스"라 함은 회사가 운영하는 사이트를 통하여 개인이 구직 등의 목적으로 등록하는 자료를 각 목적에 맞게 분류 가공, 집계하여 정보를 제공하는 서비스와 게스트하우스의 구직 공고 탐색 및 기타 정보 검색과 숙박의 예약, 기타 사이트에서 제공하는 모든 부대 서비스를 말합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">2호</span> "사이트"라 함은 회사가 서비스를 "회원"에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한 가상의 영업장 또는 회사가 운영하는 웹사이트, 모바일 웹, 어플리케이션 등의 서비스를 제공하는 모든 매체를 통칭하며, 통합된 하나의 회원 계정(아이디 및 비밀번호)을 이용하여 서비스를 제공받을 수 있는 아래의 사이트를 말합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">3호</span> "회원"이라 함은 "회사"가 제공하는 서비스를 이용하거나 이용하려는 자로, "회사"와 이용계약을 체결한자 또는 체결하려는 자를 포함하며 아이디와 비밀번호의 설정 등 회원가입 절차를 거쳐 회사의 서비스에 회원 등록을 완료한 "개인회원"을 말합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">4호</span> "아이디"이라 함은 회원가입시 회원의 식별과 서비스 이용을 위하여 회원이 선정하고 회사가 부여하는 문자와 숫자의 조합을 말합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">5호</span> "비밀번호"라 함은 위 제4항에 따라 회원이 회원가입시 아이디를 설정하면서 아이디를 부여 받은 자와 동일인임을 확인하고 "회원"의 권익을 보호하기 위하여 "회원"이 선정한 문자와 숫자의 조합을 의미합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">6호</span> "비회원"이라 함은 회원가입절차를 거치지 않고 "회사"가 제공하는 서비스를 이용하거나 하려는 자를 말합니다.</li>
                  <li><span className="font-extrabold text-grayscale-700">7호</span> "이용자"라 함은 회사의 서비스를 이용하는 자로서, "회원"과 "비회원"을 의미합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제3조 (약관의 명시와 효력)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생하며, 이 약관에 동의하지 않거나 본 약관을 준수하지 않는 경우 회사가 운영하는 모든 서비스에 대한 접근 및 이용이 금지됩니다.</li>
                  <li>이용자는 회사가 운영하는 서비스에 접근하여 서비스를 이용할 경우 본 약관 및 관련 운영정책을 확인하고 준수하여야 합니다.</li>
                  <li>회사는 이용자가 서비스 이용 시 약관을 확인할 수 있도록 본 약관과 상호, 영업소 소재지, 대표자 성명, 사업자등록번호, 연락처 등을 초기화면에 게시하거나 기타의 방법으로 이용자에게 공지하여야 합니다.</li>
                  <li>회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                  <li>회사가 약관을 변경할 시에, 적용일자와 변경 사유를 변경 약관의 적용일 7일 전부터 일까지 공지합니다. 단 회원에게 불리한 변경일 경우 적용일 30일 전부터 공지합니다.</li>
                  <li>회원은 변경된 약관에 대하여 거부할 수 있으며, 이 경우 서비스 이용계약을 해지할 수 있습니다. 명시적으로 거부하지 않고 계속 서비스를 이용하면 동의한 것으로 간주합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제4조 (약관의 해석)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>이 약관에서 규정하지 않은 사항에 관해서는 관계법령에 따릅니다.</li>
                  <li>회사는 개별 서비스 또는 서비스 내 항목에 대하여 개별약관 또는 이용정책을 정할 수 있습니다. 상충할 경우 개별약관 또는 정책이 우선 적용됩니다.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제2장 */}
          <section>
            <h2 className="text-xl font-extrabold text-grayscale-900 mb-6 pb-2 border-b border-grayscale-200">제2장 (이용계약의 성립 및 정보 보호)</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제5조 (이용계약의 성립)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>서비스 이용계약은 가입신청자가 가입을 신청하고 회사가 이를 승낙함으로써 성립합니다. 본 약관과 방침에 동의 버튼을 누른 경우 동의한 것으로 간주합니다.</li>
                  <li>회사는 실명확인 및 본인인증을 요청할 수 있으며, 요구되는 정보를 제공해야 합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제6조 (가입 승낙과 제한)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>허위 기재, 타인 도용, 범죄 목적 등의 경우 가입 승낙을 거절할 수 있습니다.</li>
                  <li>서비스 설비나 기술적 지장이 있을 경우 승낙을 유보할 수 있습니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제7조 (회원정보의 관리 및 보호)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>계정의 관리책임은 전적으로 회원 본인에게 있으며, 타인에게 양도하거나 대여할 수 없습니다.</li>
                  <li>개인정보의 수집 및 이용, 보호에 관한 사항은 회사의 개인정보처리방침을 적용합니다.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제3장 */}
          <section>
            <h2 className="text-xl font-extrabold text-grayscale-900 mb-6 pb-2 border-b border-grayscale-200">제3장 (서비스의 운영)</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제9조 (콘텐츠 권리)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>회사가 제공하는 서비스에 대한 디자인, 로고, 소스 등의 지식재산권은 회사가 보유합니다.</li>
                  <li>이용자는 회사의 사전 승낙 없이 무단으로 영리 목적으로 정보를 유출하거나 타인에게 배포할 수 없습니다.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-grayscale-800 mb-2">제10조 (계약 해지)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>회원은 언제든지 절차에 따라 서비스 해지를 요청할 수 있으며, 처리방침에 따라 신속하게 데이터를 삭제합니다.</li>
                  <li>회원의 타당한 귀책사유로 인해 타인에게 피해를 입힌 경우 사전 알림 없이 일방적으로 제재 및 해지를 통보할 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

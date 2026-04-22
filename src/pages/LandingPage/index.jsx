import { useState } from "react";
import RegisterModal from "./RegisterModal/RegisterModal";
import { HeroSection } from "./LandingComponents/HeroSection";
import { FeaturesSection } from "./LandingComponents/FeaturesSection";
import { PartnersSection } from "./LandingComponents/PartnersSection";
import { EarlyBirdSection } from "./LandingComponents/EarlyBirdSection";
import { HostCtaSection } from "./LandingComponents/HostCtaSection";

export default function LandingPage() {
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    businessName: "", //상호명
    businessType: "", //사업장 유형
    employeeCount: "", //직원 수
    managerName: "", //담당자 이름
    managerEmail: "", //담당자 이메일
    businessPhone: "", //사업장 전화번호
    address: "", //사업자 주소
    detailAddress: "", //사업자 상세 주소
    businessRegistrationNumber: "", //사업자 등록번호
    img: null, //사업자 등록증 이미지

    //회원가입용 정보
    name: "", //이름
    phone: "", //전화번호
    email: "", //이메일
    password: "", //비밀번호
    passwordConfirm: "", //비밀번호 확인
  });

  const handleRegisterModal = () => {
    setRegisterModalVisible(true);
  };

  return (
    <>
      <HeroSection handleRegisterModal={handleRegisterModal} />
      <PartnersSection />
      <FeaturesSection />
      <EarlyBirdSection handleRegisterModal={handleRegisterModal} />
      <HostCtaSection handleRegisterModal={handleRegisterModal} />
      
      {/* 입점신청, 회원가입 모달 */}
      <RegisterModal
        visible={registerModalVisible}
        setVisible={setRegisterModalVisible}
        formData={registerForm}
        setFormData={setRegisterForm}
      />
    </>
  );
}

import { useState } from "react";
import RegisterModal from "./RegisterModal/RegisterModal";
import Banner from "./IntroduceSection/Banner";
import Intro1 from "./IntroduceSection/Intro1";
import Intro2 from "./IntroduceSection/Intro2";
import VisionMission from "./IntroduceSection/VisionMission";
import IntroUI1 from "./IntroduceSection/IntroUI1";
import IntroUI2 from "./IntroduceSection/IntroUI2";
import IntroUI3 from "./IntroduceSection/IntroUI3";
import InstallBox from "./IntroduceSection/InstallBox";
import StoreGuesthouses from "./IntroduceSection/StoreGuesthouses";

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
    <div className="flex-col flex items-center">
      <Banner handleRegisterModal={handleRegisterModal} />
      <StoreGuesthouses />
      <Intro1 />
      <Intro2 />
      <VisionMission />
      <IntroUI1 />
      <IntroUI2 />
      <IntroUI3 />
      <InstallBox />
      {/* 입점신청, 회원가입 모달 */}
      <RegisterModal
        visible={registerModalVisible}
        setVisible={setRegisterModalVisible}
        formData={registerForm}
        setFormData={setRegisterForm}
      />
    </div>
  );
}

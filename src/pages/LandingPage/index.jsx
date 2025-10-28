import ButtonOrange from "@components/ButtonOrange";
import { useState } from "react";
import RegisterModal from "./RegisterModal/RegisterModal";

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
    <div>
      {/* 배너 */}
      <div className="from-primary-orange to-white py-20 flex flex-col justify-center items-center md:px-20 lg:px-40 bg-gradient-to-b">
        <h3 className="text-2xl font-semibold text-white w-full mb-20">
          사장님을 위한 워커웨이
          <br />
          게스트하우스 등록부터 일자리·파티 모집까지
          <br />한 곳에서 시작하세요
        </h3>
        <div className="w-72">
          <ButtonOrange
            title="입점신청서 작성하기"
            onPress={handleRegisterModal}
          />
        </div>
      </div>

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

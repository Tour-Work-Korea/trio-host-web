import React from "react";
import ButtonOrange from "@components/ButtonOrange";

import UiMockup from "@assets/images/landing/ui_mockup.svg";

export default function Banner({ handleRegisterModal }) {
  return (
    <div className="landing-container">
      <div className="landing-divide">
        {/* 왼쪽 요소 */}
        <div className="flex-col">
          <h1 className="text-5xl font-bold">
            사장님을 위한&nbsp;
            <br className="sm:hidden" />
            워커웨이
          </h1>
          <h3 className="text-xl font-bold mt-[20px]">
            게스트하우스 숙박 예약과 콘텐츠 참여 관리를 
            <br className="sm:hiddne" />한 곳에서 시작하세요
          </h3>
          <div className="w-72 mt-[40px]">
            <ButtonOrange
              title="입점신청하고 회원가입하기"
              onPress={handleRegisterModal}
            />
          </div>
        </div>
        {/* 오른쪽 요소 */}
        <div>
          <img src={UiMockup} className=" sm:min-w-[496px]" />
        </div>
      </div>
    </div>
  );
}

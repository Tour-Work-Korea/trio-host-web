import React from "react";
import BgWaW from "@assets/images/landing/bg_wa_w.svg";
import UI1 from "@assets/images/landing/ui_1_1.png";
import UI2 from "@assets/images/landing/ui_1_2.png";
import WaSuccessBlue from "@assets/images/wa_success_blue.svg";
import ImageSlider from "@components/ImageSlider";

export default function IntroUI1() {
  return (
    <section className="landing-container relative overflow-hidden">
      {/* 배경 */}
      <img
        src={BgWaW}
        aria-hidden="true"
        className="absolute top-0 left-0 w-[591px] h-auto -z-10 pointer-events-none select-none"
      />

      {/* 양쪽 박스 높이 동일 */}
      <div className="landing-divide flex gap-8 items-stretch w-full">
        {/* 왼쪽 */}
        <div className="flex justify-center w-full">
          <ImageSlider images={[UI1, UI2]} />
        </div>

        {/* 오른쪽 */}
        <div className="flex justify-end w-full sm:justify-center">
          <div className="landing-ui-intro-section ">
            <h2 className="text-[40px] font-bold mt-4">스탭 모집 ・ 관리</h2>
            <div className="flex flex-col items-center w-full gap-5 mt-4">
              <div className="landing-ui-box">
                MBTI, 경력 등 <b>스탭의 성향과 역량</b>을
                <br />
                파악할 수 있는 <b>WA 전용 이력서 제공</b>
              </div>
              <div className="landing-ui-box">
                쉽게 작성 가능한 <b>템플릿</b>으로
                <br /> <b>빠르게 공고</b> 등록
              </div>
              <div className="w-full">
                <div className="landing-ui-box">
                  인앱 <b>채팅방 기능</b>
                  <span className="text-primary-orange">*</span>
                  <br />
                </div>
                <p className="text-primary-orange font-semibold text-sm text-right">
                  *버전2 출시 기능
                </p>
              </div>
            </div>
            <div className="flex justify-end w-full mt-4">
              <img src={WaSuccessBlue} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

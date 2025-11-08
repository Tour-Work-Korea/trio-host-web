import React from "react";
import BgWaA from "@assets/images/landing/bg_wa_a.svg";
import UI1 from "@assets/images/landing/ui_2_1.png";
import UI2 from "@assets/images/landing/ui_2_2.png";
import WaSuccessOrange from "@assets/images/wa_success_orange.svg";
import ImageSlider from "@components/ImageSlider";

export default function IntroUI2() {
  return (
    <section className="landing-container relative overflow-hidden">
      {/* 배경 */}
      <img
        src={BgWaA}
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[591px] h-auto -z-10 pointer-events-none select-none"
      />

      {/* 양쪽 박스 높이 동일 */}
      <div className="landing-divide flex gap-8 items-stretch w-full">
        {/* 왼쪽 */}
        <div className="landing-ui-intro-section">
          <h2 className="text-[40px] font-bold">모임 참여자 예약 ・ 결제</h2>
          <div className="flex flex-col items-center w-full gap-5 mt-4">
            <div className="landing-ui-box">
              귀찮은 공고 올리기는 이제 그만.
              <br />
              반복되는 <b>모임 자동 등록</b>
            </div>
            <div className="landing-ui-box">
              <b>참여 인원 수에 따라 진행 여부 설정</b>
              <br />
              파티 관련 안내 자동 전송
            </div>
            <div className="landing-ui-box">
              일반 여행객(비숙박객) 대상 예약 시스템
              <br />
              모임 <b>홍보와 예약을 동시에</b>
            </div>
          </div>
          <div className="flex justify-start w-full mt-4">
            <img src={WaSuccessOrange} />
          </div>
        </div>
        {/* 오른쪽 */}
        <div className="flex justify-center">
          <ImageSlider images={[UI1, UI2]} />
        </div>
      </div>
    </section>
  );
}

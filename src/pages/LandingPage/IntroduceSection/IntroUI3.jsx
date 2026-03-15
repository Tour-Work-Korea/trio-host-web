import React from "react";
import UI1 from "@assets/images/landing/객실_1.png";
import UI2 from "@assets/images/landing/객실_2.png";
import UI3 from "@assets/images/landing/객실_3.png";
import UI4 from "@assets/images/landing/객실_4.png";
import UI5 from "@assets/images/landing/객실_5.png";
import UI6 from "@assets/images/landing/객실_6.png";
import WaEmptyBlue from "@assets/images/wa_blue_empty.svg";
import ImageSlider from "@components/ImageSlider";

export default function IntroUI3() {
  return (
    <section className="landing-container relative overflow-hidden">
      {/* 양쪽 박스 높이 동일 */}
      <div className="landing-divide flex gap-8 items-stretch w-full">
        {/* 왼쪽 */}{" "}
        <div className="flex justify-center w-full">
          <ImageSlider images={[UI1, UI2, UI3, UI4, UI5, UI6]} />
        </div>
        {/* 오른쪽 */}
        <div className="flex justify-end w-full sm:justify-center">
          <div className="landing-ui-intro-section ">
            <h2 className="text-[40px] font-bold  mt-4">객실 예약 ・ 관리</h2>
            <div className="flex flex-col items-center w-full gap-5 mt-4">
              <div className="landing-ui-box">
                일반 여행객
                <br />
                <b>객실 결제</b> 기능
              </div>
              <div className="landing-ui-box">
                게스트하우스 <b>특유의 매력</b>을<br />
                <b>홍보</b> 해주는 단독 플랫폼 구조
              </div>
              <div className="landing-ui-box">
                <b>카카오톡 알림 기반 체크인</b>
                <br />모임·파티 정보 통합 안내
                {/* <br />
                <b>워커웨이 대리 응대</b> 서비스 제공 */}
              </div>
            </div>
            <div className="flex justify-end w-full mt-4">
              <img src={WaEmptyBlue} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

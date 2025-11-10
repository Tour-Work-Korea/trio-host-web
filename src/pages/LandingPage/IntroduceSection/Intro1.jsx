import React from "react";
import WaLogoOrange from "@assets/images/wa_logo_text_orange.svg";
import VentureLogo from "@assets/images/landing/venture_logo.png";

/**
 * 회사 한 줄 소개
 */
export default function Intro1() {
  return (
    <div className="landing-container animate-soft-enter">
      <div className="landing-divide">
        {/* 왼쪽 */}
        <div className="flex-col w-full">
          <img src={WaLogoOrange} className="w-72" />
          <p className="mt-5 font-medium text-lg">
            편하고 의미 있는 제주도 한달 살이 체류를 가능하게 하는 로컬 워킹트립
            플랫폼
          </p>
        </div>
        {/* 오른쪽 */}
        <div className="flex landing-blue-box md:min-h-[370px] ">
          <img src={VentureLogo} className="h-[104px] md:min-w-[310px] " />
        </div>
      </div>
    </div>
  );
}

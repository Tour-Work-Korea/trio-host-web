import React from "react";
import InstallCard from "@assets/images/landing/install_card.svg";
export default function InstallBox() {
  return (
    <div className="landing-container">
      <div className="landing-divide p-8 items-center bg-primary-orange rounded-3xl">
        <div>
          <h2 className="text-[36px] font-bold text-neutral-white">
            지금 앱스토어에서&nbsp;
            <br className="sm:hidden" />
            다운 받아 보세요
          </h2>
          <h3 className="text-2xl font-semibold text-neutral-white mt-4">
            게스트하우스 등록부터&nbsp; <br className="sm:hidden" />
            일자리·파티 모집까지
            <br />한 곳에서 시작하세요
          </h3>
        </div>
        <img src={InstallCard} />
      </div>
    </div>
  );
}

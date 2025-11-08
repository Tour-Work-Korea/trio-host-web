import React from "react";

export default function VisionMission() {
  return (
    <div className="landing-container">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="font-bold text-[40px] text-center">Vision & Mission</h1>

        {/* 카드 둘을 가로로 배치 + 높이 동일하게 */}
        <div className="landing-divide mt-16 flex gap-8 items-stretch w-full">
          {/* Vision 카드 */}
          <div className="landing-blue-box w-full flex flex-col justify-start">
            <div className="rounded-xl bg-primary-blue text-white px-5 py-2.5 text-2xl font-bold">
              Vision
            </div>
            <div className="flex flex-col text-center mt-8 items-center justify-center flex-1">
              <h3 className="text-2xl font-bold">
                지속 가능한 게스트하우스와 로컬 라이프
              </h3>
              <p className="text-lg font-medium mt-6">
                지역 게스트하우스의 지속 가능성 향상, 여행자에게 로컬 라이프
                경험 제공하는 구조를 창출합니다.
              </p>
            </div>
          </div>

          {/* Mission 카드 */}
          <div className="landing-blue-box w-full flex flex-col justify-start">
            <div className="rounded-xl bg-primary-blue text-white px-5 py-2.5 text-2xl font-bold">
              Mission
            </div>
            <div className="flex flex-col text-center mt-8 flex-1">
              <h3 className="text-2xl font-bold">순환형 로컬 워킹트립</h3>

              <div className="text-lg font-medium mt-6">
                <p className="font-bold text-primary-blue">여행자에게</p>
                <p>
                  단순한 여행을 넘어, 의미 있는 체류와 경험을 가능하게 하는
                  순환형 로컬 워킹트립 플랫폼 제공합니다
                </p>
              </div>

              <div className="text-lg font-medium mt-3">
                <p className="font-bold text-primary-blue">사장님에게</p>
                <p>지역 인력 부족 문제를 해소해줍니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

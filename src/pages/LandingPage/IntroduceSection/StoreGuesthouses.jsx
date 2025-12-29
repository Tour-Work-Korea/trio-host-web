import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import gh1 from "@assets/images/landing/gh_1.png";
import gh2 from "@assets/images/landing/gh_2.png";
import gh3 from "@assets/images/landing/gh_3.png";
import gh4 from "@assets/images/landing/gh_4.png";
const gh_cards = [
  { title: "베드라디오 동문점", url: gh1 },
  { title: "백패커스홈", url: gh2 },
  { title: "비지터 게스트하우스", url: gh3 },
  { title: "캡틴 제주 게스트하우스", url: gh4 },
  { title: "베드라디오 동문점", url: gh1 },
  { title: "백패커스홈", url: gh2 },
  { title: "비지터 게스트하우스", url: gh3 },
  { title: "캡틴 제주 게스트하우스", url: gh4 },
  { title: "베드라디오 동문점", url: gh1 },
  { title: "백패커스홈", url: gh2 },
  { title: "비지터 게스트하우스", url: gh3 },
  { title: "캡틴 제주 게스트하우스", url: gh4 },
  { title: "베드라디오 동문점", url: gh1 },
  { title: "백패커스홈", url: gh2 },
];

export default function StoreGuesthouses() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000, // 한 번 트랙을 도는 시간
    autoplaySpeed: 0, // 멈추는 시간 없이 바로바로
    cssEase: "linear", // 일정 속도로 쭉
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <div className="landing-container relative overflow-hidden">
      <h1 className="mb-12 text-2xl font-semibold">
        워커웨이 입점 게스트하우스
      </h1>
      <Slider {...settings}>
        {gh_cards?.slice(0, 7).map((el, id) => (
          <div key={id} className="flex-col flex items-center px-2">
            <img src={el.url} className="w-full rounded-lg" />
            <p className="font-medium text-center mt-4 text-base">{el.title}</p>
          </div>
        ))}
      </Slider>
      <div className="h-10" />
      <Slider {...settings}>
        {gh_cards?.slice(7, 14).map((el, id) => (
          <div key={id} className="flex-col flex items-center px-2">
            <img src={el.url} className="w-full rounded-lg" />
            <p className="font-medium text-center mt-4 text-base">{el.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

/* eslint-disable react/prop-types */
// ImageSlider.tsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageSlider({ images }) {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2500,
    waitForAnimate: false,
  };

  return (
    <div className="w-full max-w-[363px]">
      <Slider {...settings}>
        {images?.map((el, id) => (
          <div key={id}>
            <img src={el} className="w-[363px] rounded-3xl" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageSlider;

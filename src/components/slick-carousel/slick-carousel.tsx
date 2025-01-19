"use client";
import React, { ReactNode } from "react";
import Slider from "react-slick";

interface SlickSliderProps {
  children?: ReactNode;
  className?: string;
  settings?: object;
}

export const CustomSlickCarousel = (props: SlickSliderProps) => {
  const { children, className, settings: customSettings } = props;

  //Default Settings
  const defaultSettings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 800,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          slidesToShow: 1,
          adaptiveHeight: true,
        },
      },
    ],
  };

  const settings = { ...defaultSettings, ...customSettings };

  return (
    <Slider {...settings} className={className ?? ""}>
      {children}
    </Slider>
  );
};

export default CustomSlickCarousel;

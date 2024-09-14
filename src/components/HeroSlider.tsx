import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const sliderItems = [
  {
    image: "https://placehold.co/400x100",
    caption: "Caption for first image",
  },
  {
    image: "https://placehold.co/400x100",
    caption: "Caption for second image",
  },
  {
    image: "https://placehold.co/400x100",
    caption: "Caption for third image",
  },
];

const HeroSlider: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Carousel autoPlay infiniteLoop showArrows={true} showThumbs={false}>
        {sliderItems.map((item, index) => (
          <div key={index} className="relative">
            <img
              src={item.image}
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-96"
            />
            <p className="legend absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {item.caption}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider;

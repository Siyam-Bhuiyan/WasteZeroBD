"use client"

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="skill bg-gray-50 py-16" id="skills">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Skills</h2>
          <p className="text-gray-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy text.
          </p>
        </div>
        <Carousel
          responsive={responsive}
          infinite={true}
          className="owl-carousel owl-theme"
        >
          <div className="item text-center">
            <Image
              src="/assets/pic.png"
              alt="Web Development"
              width={150}
              height={150}
            />
            <h5 className="text-lg font-medium mt-4">Web Development</h5>
          </div>
          <div className="item text-center">
            <Image
              src="/assets/pic.png"
              alt="Brand Identity"
              width={150}
              height={150}
            />
            <h5 className="text-lg font-medium mt-4">Brand Identity</h5>
          </div>
          <div className="item text-center">
            <Image
              src="/assets/pic.png"
              alt="Logo Design"
              width={150}
              height={150}
            />
            <h5 className="text-lg font-medium mt-4">Logo Design</h5>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

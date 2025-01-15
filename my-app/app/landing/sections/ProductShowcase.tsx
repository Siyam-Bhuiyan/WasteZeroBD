"use client";
import changeImage from "../assets/change.png"; // Import the new image
import pyramidImage from "../assets/pyramid.png";
import tubeImage from "../assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip flex items-center justify-center"
    >
      <div className="container flex flex-col items-center justify-center relative">
        {/* Center Tagline */}
        <div className="max-w-[540px] text-center">
          <h2 className="text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#006a4e] text-transparent bg-clip-text mt-5">
            Our motivation behind Waste Zero Bangladesh
          </h2>
          <p className="section-des mt-5 md:text-[35px]">It all starts with ONE.</p>
        </div>

        {/* Center Image and 3D Images */}
        <div className="relative flex items-center justify-center mt-10">
          {/* Main Image */}
          <Image
            src={changeImage} // Updated to use change.png
            alt="Product Showcase"
            className="z-10 w-[60%] md:w-auto"
          />

          {/* 3D Images */}
          <motion.img
            src={pyramidImage.src}
            alt="Pyramid image"
            height={200}
            width={200}
            className="absolute -right-24 -top-16 md:-right-36 md:-top-32"
            style={{
              translateY: translateY,
            }}
          />
          <motion.img
            src={tubeImage.src}
            alt="Tube image"
            height={200}
            width={200}
            className="absolute -left-24 bottom-16 md:-left-36 md:bottom-24"
            style={{
              translateY: translateY,
            }}
          />
        </div>
      </div>
    </section>
  );
};

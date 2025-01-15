"use client";
import ArrowRight from "../assets/arrow-right.svg";
import starImage from "../assets/star.png";
import springImage from "../assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip flex items-center justify-center"
    >
      <div className="container text-center">
        {/* Section Heading */}
        <div className="section-heading relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Join our mission
          </h2>
          <p className="text-lg md:text-xl font-medium mt-5 max-w-3xl mx-auto">
            Celebrate the joy of accomplishment with our app designed to track
            your progress and motivate your efforts.
          </p>

          {/* Decorative Images */}
          <motion.img
            src={starImage.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>

        {/* Call to Action Button */}
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-text gap-1 text-lg font-semibold px-6 py-3">
            <span>Join </span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

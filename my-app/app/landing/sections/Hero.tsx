"use client";
import ArrowIcon from "../assets/arrow-right.svg";
import cogImage from "../assets/cog.png";
import cylinderImage from "../assets/cylinder.png";
import noodleImage from "../assets/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { useRef } from "react";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center justify-center pt-8 pb-20 md:pt-5 md:pb-10 overflow-x-clip"
      style={{
        background:
          "radial-gradient(ellipse 200% 100% at bottom left, #f7f9f8, #ffffff 100%)",
      }}
    >
      <div className="container flex flex-col md:flex-row items-center justify-center text-center md:text-left md:ml-10">
        {/* Left Section: Text Content */}
        <div className="md:w-[478px]">
          <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
            The future is here
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-6 text-black">
            Waste Zero <span className="text-[#006a4e]">Bangladesh</span>
          </h1>

          {/* Tagline */}
          <h2 className="text-3xl font-semibold text-black mt-6">
            A more effective way for waste management
          </h2>

          {/* Description */}
          <p className="text-lg text-black tracking-tight mt-4">
            Effortlessly and seamlessly handle your waste with the help of AI.
          </p>

          <div className="flex gap-1 items-center mt-[30px] justify-center md:justify-start">
            <div className="border border-[#006a4e] rounded-lg p-4 shadow-lg">
              <Link href="/user">
                <button className="btn btn-primary">Let's Get Started</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Images */}
        <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
          <motion.img
            src={cogImage.src}
            alt="Cog"
            className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
            animate={{
              translateY: [-30, 30],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 3,
              ease: "easeInOut",
            }}
          />
          <motion.img
            src={cylinderImage.src}
            width={220}
            height={220}
            alt="Cylinder image"
            className="hidden md:block -top-8 -left-32 md:absolute"
            style={{
              translateY: translateY,
            }}
          />
          <motion.img
            src={noodleImage.src}
            width={220}
            alt="Noodle image"
            className="hidden lg:block top-[524px] left-[448px] absolute rotate-[30deg]"
            style={{
              rotate: 30,
              translateY: translateY,
            }}
          />
        </div>
      </div>
    </section>
  );
};

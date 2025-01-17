"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For animations
import Image from "next/image"; // Next.js optimized image handling
import globeImg from "@/app/landing/assets/img/globe.png"; // Replace with your globe image path

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["Waste Zero Bangladesh", "Make A Change", "Sustainability"];
  const period = 2000;

  useEffect(() => {
    const ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text]);

  const tick = () => {
    const i = loopNum % toRotate.length;
    const fullText = toRotate[i];
    const updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section
      className="banner bg-white flex items-center justify-center h-[60vh] w-[70vw] mx-auto rounded-lg shadow-lg"
      id="home"
    >
      <div className="w-full px-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side: Text Content */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center ml-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-green-600 font-medium uppercase text-lg">
            hello{/* Customize tagline */}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold my-6">
            {`Hi! Welcome to`}{" "}
            <span className="text-green-600">
              {text} {/* Typing effect text */}
            </span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">
            Join our mission of zero waste by actively reporting and collecting
            waste, creating a cleaner, greener future for all!{" "}
          </p>
          <button
            onClick={() => console.log("connect")}
            className="bg-transparent text-green-600 font-medium w-auto border-none hover:underline transition-all"
          >
            Let’s Connect
          </button>
        </motion.div>

        {/* Right Side: Spinning Globe */}
        <motion.div
          className="lg:w-1/2 flex justify-center mt-10 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            animate={{
              rotate: 360, // Spin the globe 360 degrees
            }}
            transition={{
              duration: 10, // Takes 10 seconds for one full spin
              repeat: Infinity, // Repeats the animation forever
              ease: "linear", // Maintains constant speed
            }}
            className="w-[350px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]"
          >
            <Image
              src={globeImg} // Replace with your spinning globe image path
              alt="Spinning Globe"
              width={450}
              height={450}
              className="rounded-full shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

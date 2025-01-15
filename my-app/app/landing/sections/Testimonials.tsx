"use client";
import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatar6 from "../assets/avatar-6.png";
import avatar7 from "../assets/avatar-7.png";
import avatar8 from "../assets/avatar-8.png";
import avatar9 from "../assets/avatar-9.png";
import Image from "next/image";
import React, { use } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Waste Zero Bangladesh has given me a sense of purpose. Every time I report waste, I feel like I’m making a small difference for my country.",
    imageSrc: avatar1.src,
    name: "তানভীর ইসলাম",
    username: "@tanvir123",
  },
  {
    text: "This app has brought our neighborhood together. Seeing how much cleaner our streets are now fills my heart with pride.",
    imageSrc: avatar2.src,
    name: "মাহিন আহমেদ",
    username: "@mahinahmed",
  },
  {
    text: "Volunteering to collect waste through this app is one of the most fulfilling experiences of my life. Knowing that my efforts are appreciated motivates me every day.",
    imageSrc: avatar3.src,
    name: "ফারহান হোসেন",
    username: "@farhan07",
  },
  {
    text: "When I received my first certification for composting, I almost cried. This app has shown me that small actions can lead to big changes.",
    imageSrc: avatar4.src,
    name: "আফরিন খান",
    username: "@afrin_khan",
  },
  {
    text: "Waste Zero Bangladesh gave me a platform to teach my kids about sustainability. They now proudly report waste with me, and it feels like we’re shaping a better future together.",
    imageSrc: avatar5.src,
    name: "নাইমা রহমান",
    username: "@naima.r",
  },
  {
    text: "The leaderboard is such a motivating feature. It’s amazing to see my name there, knowing my contributions are helping create a cleaner Bangladesh.",
    imageSrc: avatar6.src,
    name: "রিদওয়ান আলী",
    username: "@ridwan_bondhu",
  },
  {
    text: "This app is more than a tool; it’s a movement. I feel proud to be part of a community working toward a zero-waste Bangladesh.",
    imageSrc: avatar7.src,
    name: "নূরুল ইসলাম",
    username: "@nurul.in",
  },
  {
    text: "I never thought an app could inspire such change. Waste Zero Bangladesh has truly transformed the way I look at waste and sustainability.",
    imageSrc: avatar8.src,
    name: "শারমিন আক্তার",
    username: "@sharmin1998",
  },
  {
    text: "Seeing my community adopt waste management practices has brought me immense joy. I feel hopeful for a greener and cleaner Bangladesh.",
    imageSrc: avatar9.src,
    name: "আরিফুল ইসলাম",
    username: "@ariful.zero",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, imageSrc, name, username }) => (
                <div className="card" key={username}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      width={40}
                      height={40}
                      src={imageSrc}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="leading-5 tracking-tight">{username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="bg-white flex items-center justify-center flex-col min-h-screen">
      <div className="container text-center">
        {/* Section Heading */}
        <div className="section-heading">
          {/* Tag */}
          <div className="flex justify-center">
            <div className="tag text-lg font-semibold">Testimonials</div>
          </div>

          {/* Main Title */}
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mt-5">
            What our users say
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl font-medium mt-5 max-w-3xl mx-auto">
            Waste Zero Bangladesh isn’t just an app, it’s a movement. We dream
            that it will touch lives and inspire hope for a better future for
            our country.
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

"use client";
import CheckIcon from "../assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Concept 1",
    buttonText: "REPORT WASTE",
    popular: false,
    inverse: false,
    features: [
      "Just upload a picture of waste from your location",
      "AI will analyze waste type and approximate weight",
      "It is the simplest waste reporting system for everyone",
    ],
  },
  {
    title: "Concept 2",
    buttonText: "COLLECT WASTE",
    popular: true,
    inverse: true,
    features: [
      "View reported waste from any location",
      "Volunteer to collect waste",
      "AI will verify and update waste collection status (pending, in progress, verified)",
    ],
  },
  {
    title: "Concept 3",
    buttonText: "REWARD",
    popular: false,
    inverse: false,
    features: [
      "Get reward points based on waste report and collection",
      "top waste reporters and collectors  will be on the leaderboard",
      "Leaderboard will have ranks to gamify our experience",
      "top ranks are gold silver iron bronze",
    ],
  },
  {
    title: "Concept 4",
    buttonText: "RECYCLE",
    popular: false,
    inverse: false,
    features: [
      "If youre are not sure how to recycle a waste, we will help you",
      "Just upload a picture of waste and we will tell you how to recycle it",
      "you can see recycling methonds,centers,impacts and more",
      "You can also download the report of recycling",
    ],
  },
  {
    title: "Concept 5",
    buttonText: "RE-USE",
    popular: false,
    inverse: false,
    features: [
      "You can reuse waste by buying or selling",
      "Can also donate waste to others",
    ],
  },
  {
    title: "Concept 6",
    buttonText: "CERTIFICATION",
    popular: true,
    inverse: true,
    features: [
      "Certifications is based on reward points and leaderboard ranks",
      "Get recognition for your active waste management",
      "Certifications will have categories - gold silver iron bronze",
      "Certifications will play a crucial role creating brand image and to gain trust of people for businesses",
    ],
  },
  {
    title: "Concept 7",
    buttonText: "RESIDENTIAL SERVICES",
    popular: false,
    inverse: false,
    features: [
      "You can book a residential waste collection service",
      "A easy and convenient way to get rid of residential waste",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white py-24">
      <div className="container text-center">
        {/* Centered Heading */}
        <div>
          <h2 className="text-5xl font-extrabold">
            7 concepts of Zero Waste :
          </h2>
          <p className="section-des mt-5">
            to achieve the goal of waste zero Bangladesh
          </p>
        </div>

        {/* Centered Pricing Tiers */}
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-stretch lg:justify-center lg:flex-wrap">
          {pricingTiers.map(
            ({ title, buttonText, popular, features, inverse }) => (
              <div
                key={title}
                className={twMerge(
                  "p-10 rounded-3xl border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full",
                  inverse === true && "border-black bg-black text-white"
                )}
              >
                <div className="flex justify-between">
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50",
                      inverse && "text-white/60"
                    )}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: "-100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                      >
                        Popular
                      </motion.span>
                    </div>
                  )}
                </div>
                <button
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px]",
                    inverse && "bg-white text-black"
                  )}
                >
                  {buttonText}
                </button>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm flex items-center gap-4"
                    >
                      <CheckIcon className="h-6 w-6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

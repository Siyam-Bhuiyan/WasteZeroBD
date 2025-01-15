"use client";
import reuseLogo from "../assets/reuse.png"; // Import reuse.png
import recycleLogo from "../assets/recycle.png"; // Import recycle.png
import rewardsLogo from "../assets/rewards.png"; // Import rewards.png
import certificationLogo from "../assets/certification.png"; // Import certification.png
import collectLogo from "../assets/collect.png"; // Import collect.png
import { motion } from "framer-motion";
import Image from "next/image";

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container">
        <div
          className="flex overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black, transparent)",
          }}
        >
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image
              src={recycleLogo}
              alt="Recycle logo"
              className="logo-ticker-image"
            />
            <Image
              src={rewardsLogo}
              alt="Rewards logo"
              className="logo-ticker-image"
            />
            <Image
              src={reuseLogo}
              alt="Reuse logo"
              className="logo-ticker-image"
            />

            <Image
              src={certificationLogo}
              alt="Certification logo"
              className="logo-ticker-image"
            />
            <Image
              src={collectLogo}
              alt="Collect logo"
              className="logo-ticker-image" // Add collect image here
            />

            <Image
              src={recycleLogo}
              alt="Recycle logo"
              className="logo-ticker-image"
            />
            <Image
              src={rewardsLogo}
              alt="Rewards logo"
              className="logo-ticker-image"
            />
            <Image
              src={reuseLogo}
              alt="Reuse logo"
              className="logo-ticker-image"
            />

            <Image
              src={certificationLogo}
              alt="Certification logo"
              className="logo-ticker-image"
            />
            <Image
              src={collectLogo}
              alt="Collect logo"
              className="logo-ticker-image"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

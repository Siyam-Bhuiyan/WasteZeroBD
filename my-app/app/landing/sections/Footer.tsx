import logo from "../assets/logosaas.png";
import SocialX from "../assets/social-x.svg";
import SocialInsta from "../assets/social-insta.svg";
import SocialLinkedin from "../assets/social-linkedin.svg";
import SocialPin from "../assets/social-pin.svg";
import SocialYoutube from "../assets/social-youtube.svg";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center flex items-center justify-center flex-col">
      <div className="container text-center">
        {/* Gradient Divider */}
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute"></div>

        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="">About</a>
          <a href="">Report</a>
          <a href="">Collect</a>
          <a href="">Recommendations</a>
          <a href="">Marketplace</a>
          <a href="">Help</a>
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <SocialX />
          <SocialInsta />
          <SocialLinkedin />
          <SocialPin />
          <SocialYoutube />
        </div>

        {/* Footer Text */}
        <p className="mt-6">
          &copy; 2024 Waste Zero Bangladesh, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

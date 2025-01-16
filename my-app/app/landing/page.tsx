import { CallToAction } from "./sections/CallToAction";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { LogoTicker } from "./sections/LogoTicker";
import { Pricing } from "./sections/Pricing";
import { ProductShowcase } from "./sections/ProductShowcase";
import { Testimonials } from "./sections/Testimonials";
import Sponsor from "@/app/landing/sections/Sponsor" // Ensure this path is correct

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing />
      <Sponsor />
      <Testimonials />
      <CallToAction />
      <Footer />
         
    </div>
  );
}

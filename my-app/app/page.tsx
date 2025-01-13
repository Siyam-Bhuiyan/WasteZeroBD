// page.tsx
"use client";
import React, { useState } from "react";

interface Slide {
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Recycling Stats",
    description: "In 2024, we recycled over 10,000 tons of materials.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvKLeqjy5lhcsoE2Xf5EqHZM1AyjOQvaU8ug&s",
  },
  {
    title: "Carbon Footprint Reduction",
    description:
      "Reduced carbon emissions by 20% through efficient waste disposal.",
    image:
      "https://www.cercarbono.com/wp-content/uploads/Cercarbono-and-Global-Zero-Waste-Register.png",
  },
  {
    title: "Community Impact",
    description:
      "Partnered with 50 communities to implement waste segregation.",
    image:
      "data:image/jpeg;base64,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",
  },
];
const Page: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="flex transition-transform duration-500 h-full"
          style={{ transform: ` translateX(-${currentIndex * 100}%) ` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 h-60% relative"
              style={{ width: "100%" }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-white text-lg">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-300 z-20"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-300 z-20"
      >
        &#8594;
      </button>
      {/* Circular Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center mt-4 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-green-600" : "bg-gray-400"
            } focus:outline-none`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Page;

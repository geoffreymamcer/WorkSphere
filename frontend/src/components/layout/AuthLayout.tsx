import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Logo } from "../ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
}

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920",
    text: "Redefine how your team collaborates.",
    subtext: "Experience clarity and focus like never before.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920",
    text: "Designed for modern professionals.",
    subtext: "A workspace that adapts to your needs.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=1920",
    text: "Seamless workflow integration.",
    subtext: "Connect your tools and simplify your day.",
  },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-200">
      {/* Left Panel - Scrollable Form Area */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-gray-900 z-10 w-full lg:w-[48%] xl:w-[40%] relative transition-colors duration-200">
        {/* Subtle Ambient Background Blob for Uniqueness */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-[100px] opacity-60 pointer-events-none transition-colors duration-200" />

        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <div className="mb-10">
            <Logo className="scale-105 origin-left" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
              {title}
            </h2>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </div>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Right Panel - Interactive Slideshow */}
      <div className="relative hidden w-0 flex-1 lg:block bg-gray-900 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image with slow zoom effect */}
            <div
              className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
            >
              <img
                className="h-full w-full object-cover"
                src={slide.image}
                alt="Background"
              />
            </div>

            {/* Gradient Overlay - Mixed with Indigo for brand consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/90 via-black/50 to-black/20 mix-blend-multiply" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-20 pb-24">
              <div
                className={`transform transition-all duration-700 delay-300 ${
                  index === currentSlide
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <div className="border-l-4 border-[#4F46E5] pl-6">
                  <p className="text-4xl font-bold text-white leading-tight tracking-tight">
                    {slide.text}
                  </p>
                  <p className="mt-4 text-lg text-indigo-100 font-medium opacity-90">
                    {slide.subtext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-20 right-0 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 bg-[#4F46E5]"
                  : "w-4 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

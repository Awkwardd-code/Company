"use client";
// components/Testimonial.tsx
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SliderRef {
  slickGoTo: (index: number) => void;
}

interface SliderComponentProps extends Settings {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<SliderRef>;
}

const Slider = dynamic(() => import("react-slick"), { ssr: false }) as React.ComponentType<SliderComponentProps>;

interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  imageSrc: string;
}

const TestimonialSection: React.FC = () => {
  const sliderRef = useRef<SliderRef | null>(null);

  const testimonials: TestimonialItem[] = [
    {
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce condimentum sapien ac leo cursus dignissim.",
      name: "Deniyal Shifer",
      title: "Founder @democompany",
      imageSrc: "/images/testimonial/image-1.jpg",
    },
    {
      quote:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      name: "John Doe",
      title: "CEO @examplecorp",
      imageSrc: "/images/testimonial/image-1.jpg",
    },
  ];

  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    dotsClass: "slick-dots custom-dots",
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, []);

  return (
    <section id="testimonial" className="pt-10 sm:pt-16 lg:pt-24">
      <div className="px-4 sm:px-6 xl:container mx-auto">
        {/* Section Title */}
        <div
          className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
          data-wow-delay=".2s"
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] leading-[1] font-extrabold opacity-20 bg-gradient-to-b from-[rgba(74,108,247,0.4)] to-[rgba(74,108,247,0)] bg-clip-text text-transparent">
            BLOGS
          </span>
          <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
            Latest News & Articles From Our Blog
          </h2>
          <p className="text-dark-text text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros. Donec vitae tortor
            lacus. Phasellus aliquam ante in maximus.
          </p>
        </div>

        <div className="w-full px-4 sm:px-6">
          <div className="drop-shadow-light relative z-10 overflow-hidden rounded-sm bg-white px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 dark:drop-shadow-none dark:bg-gray-800">
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              className="testimonial-active"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-item">
                  <div className="flex flex-col items-center gap-y-6 sm:gap-y-8 lg:flex-row lg:gap-x-8 lg:gap-y-0">
                    {/* Text Content */}
                    <div className="w-full text-center lg:w-1/2 lg:text-left">
                      <p className="font-heading text-dark-text mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg xl:text-xl font-light italic">
                        “{testimonial.quote}”
                      </p>
                      <h3 className="font-heading text-dark text-lg sm:text-xl lg:text-2xl font-semibold dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-dark-text text-xs sm:text-sm lg:text-base">
                        {testimonial.title}
                      </p>
                    </div>
                    {/* Image */}
                    <div className="w-full max-w-[300px] sm:max-w-[360px] lg:w-1/2 lg:max-w-none">
                      <div className="relative mx-auto h-[300px] w-full sm:h-[360px] lg:h-[400px]">
                        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
                          <Image
                            src={testimonial.imageSrc}
                            alt="testimonial-image"
                            width={280}
                            height={280}
                            className="object-cover w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] lg:w-[360px] lg:h-[360px]"
                          />
                          <div className="border-primary/10 bg-primary/5 dark:border-opacity-10 absolute -top-4 -right-4 -z-10 h-full w-full border backdrop-blur-[6px] dark:border-white/10 dark:bg-white/10"></div>
                        </div>
                        <div className="absolute -right-2 bottom-12 sm:bottom-16 z-40 lg:bottom-20">
                          <svg
                            width="48"
                            height="24"
                            viewBox="0 0 72 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="sm:w-[60px] sm:h-[32px] lg:w-[72px] lg:h-[38px]"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M62.0035 2.04985C59.6808 1.76671..."
                              fill="#4A6CF7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Custom CSS for Slider Dots */}
      <style jsx>{`
        .custom-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          gap: 8px;
        }
        .custom-dots li {
          width: 12px;
          height: 12px;
          margin: 0;
        }
        .custom-dots li button {
          width: 12px;
          height: 12px;
          padding: 0;
        }
        .custom-dots li button:before {
          content: "";
          width: 12px;
          height: 12px;
          background: rgba(74, 108, 247, 0.3);
          border-radius: 50%;
          opacity: 1;
          transition: background 0.3s ease;
        }
        .custom-dots li.slick-active button:before {
          background: #4a6cf7;
        }
        @media (max-width: 640px) {
          .custom-dots {
            bottom: -30px;
            gap: 6px;
          }
          .custom-dots li {
            width: 10px;
            height: 10px;
          }
          .custom-dots li button:before {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
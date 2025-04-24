"use client";

import React, { useRef } from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Musharof Chowdhury",
    title: "Founder @ Ayro UI",
    image: "/images/testimonials/user1.jpg",
    review:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
  },
  {
    name: "William Smith",
    title: "Founder @ Trorex",
    image: "/images/testimonials/user2.jpg",
    review:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
  },
  {
    name: "Sabo Masties",
    title: "Founder @ Rolex",
    image: "/images/testimonials/user3.jpg",
    review:
      "Our members are so impressed. It's intuitive. It's clean. It's distraction free. If you're building a community.",
  },
];

const TestimonialsSlider = () => {
  const sliderRef = useRef<Slider>(null);

  const sliderSettings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section id="testimonials" className="py-16">
      <div className="max-w-7xl mx-auto px-4">

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

        <div className="relative">
          <Slider ref={sliderRef} {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md h-full transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.951c.3.921-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.175 0l-3.367 2.448c-.785.57-1.84-.197-1.54-1.118l1.287-3.951a1 1 0 00-.364-1.118L2.08 9.377c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.95z" />
                        </svg>
                      ))}
                  </div>
                  <p className="text-gray-700 mb-6">{testimonial.review}</p>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-200 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-200 transition"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;


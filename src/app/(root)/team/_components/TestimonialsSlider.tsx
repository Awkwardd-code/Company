"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Settings } from "react-slick";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TryUsOutButton from "../../(home)/_components/TryUsOutButton";

// Type definitions
type SupportMessageWithUserImage = {
  _id: Id<"supportMessages">;
  _creationTime: number;
  userId: Id<"users">;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  rating: number;
  termsAccepted: boolean;
  createdAt: number;
  userImage: string;
};

interface Testimonial {
  _id: Id<"supportMessages">;
  name: string;
  title?: string;
  image: string;
  review: string;
  rating: number;
}

interface SliderRef {
  slickGoTo: (index: number) => void;
}

interface SliderComponentProps extends Settings {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<SliderRef>;
}

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
}) as React.ComponentType<SliderComponentProps>;

const TestimonialsSlider: React.FC = React.memo(() => {
  const sliderRef = useRef<SliderRef | null>(null);
  const { userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

  const supportMessages = useQuery(api.supportMessages.getSupportMessages);
  const userIdentity = useQuery(api.users.getMe, isAuthenticated ? {} : "skip");

  useEffect(() => {
    setIsAuthenticated(userId !== null);
  }, [userId]);

  useEffect(() => {
    if (userIdentity !== undefined) {
      setIsUserLoaded(true);
    }
  }, [userIdentity]);

  const hasUserSubmitted = useQuery(
    api.supportMessages.hasUserSubmitted,
    isAuthenticated && isUserLoaded && userIdentity?._id
      ? { userId: userIdentity._id }
      : "skip"
  );

  // Memoize testimonials to prevent unnecessary recomputation
  const testimonials: Testimonial[] = useMemo(() => {
    if (!Array.isArray(supportMessages)) return [];
    return supportMessages.map((msg: SupportMessageWithUserImage) => ({
      _id: msg._id,
      name: msg.name,
      title: "Client",
      image: msg.userImage || "/fallback-image.png",
      review: msg.message,
      rating: Math.min(5, Math.max(1, msg.rating)),
    }));
  }, [supportMessages]);

  const sliderSettings: Settings = {
    dots: true,
    infinite: testimonials.length > 1,
    speed: 600,
    slidesToShow: Math.min(2, testimonials.length),
    slidesToScroll: 1,
    arrows: false,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 4000,
    adaptiveHeight: false,
    dotsClass: "slick-dots custom-dots",
    fade: false,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 400,
        },
      },
    ],
  };

  // Reset slider on testimonials change
  useEffect(() => {
    if (sliderRef.current && testimonials.length > 0) {
      sliderRef.current.slickGoTo(0);
    }
  }, [testimonials]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${e.currentTarget.src}`);
    e.currentTarget.src = "/fallback-image.png";
  }, []);

  const isMessagesLoading = supportMessages === undefined;
  const isUserLoading = isAuthenticated && userIdentity === undefined;

  // Loading state
  if (isMessagesLoading || isUserLoading) {
    return (
      <section
        id="testimonials"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden"
        aria-label="Testimonials Loading"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 opacity-50 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/patterns/wave-light.png')] dark:bg-[url('/patterns/wave-dark.png')] bg-cover bg-center opacity-30"></div>
        <div className="relative px-4 sm:px-6 xl:container mx-auto">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (testimonials.length === 0) {
    return (
      <section
        id="testimonials"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden"
        aria-label="Testimonials Section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 opacity-50 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/patterns/wave-light.png')] dark:bg-[url('/patterns/wave-dark.png')] bg-cover bg-center opacity-30"></div>
        <div className="relative px-4 sm:px-6 xl:container mx-auto">
          <div className="relative mx-auto mb-12 max-w-[620px] pt-12 text-center md:mb-20">
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 text-[50px] sm:text-[80px] lg:text-[120px] font-extrabold leading-none opacity-15"
              style={{
                background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.5) 0%, rgba(74, 108, 247, 0) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              TRUSTS
            </span>
            <div className="relative">
              <h2 className="font-heading text-dark mb-4 text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight dark:text-white">
                Our Community's Voice
              </h2>
              <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed">
                Be the first to share your experience with our cutting-edge solutions.
              </p>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-6">
              No testimonials available yet.
            </p>
            {isAuthenticated && userIdentity && hasUserSubmitted === false ? (
              <Link
                href="/submit-testimonial"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Share Your Experience
              </Link>
            ) : (
              <TryUsOutButton />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden"
      aria-label="Testimonials Section"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-900 opacity-50 animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('/patterns/wave-light.png')] dark:bg-[url('/patterns/wave-dark.png')] bg-cover bg-center opacity-30"></div>
      <div className="relative px-4 sm:px-6 xl:container mx-auto">
        <div className="relative mx-auto mb-10 max-w-[700px] pt-12 text-center">
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 text-[50px] sm:text-[80px] lg:text-[120px] font-extrabold leading-none opacity-15"
            style={{
              background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.5) 0%, rgba(74, 108, 247, 0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            TRUSTS
          </span>
          <div className="relative">
            <h2 className="font-heading text-dark mb-4 text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight dark:text-white">
              Trusted by Our Community
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed">
              Discover why our users love and trust our innovative solutions.
            </p>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6">
          <div className="relative z-10 overflow-hidden rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg p-4 sm:p-6 lg:p-8">
            {Slider ? (
              <Slider
                {...sliderSettings}
                ref={sliderRef}
                className="testimonial-active"
                aria-label="Testimonials Slider"
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial._id}
                    className="testimonial-item px-4"
                    role="group"
                    aria-label={`Testimonial by ${testimonial.name}, rated ${testimonial.rating} out of 5 stars`}
                  >
                    <div className="flex flex-col items-center gap-y-4 lg:flex-row lg:gap-x-6 lg:gap-y-0">
                      {/* Text Content */}
                      <div className="w-full text-center lg:w-1/2 lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-4" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < testimonial.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.367 2.448a1 1 0 00-.364 1.118l1.287 3.951c.3.921-.755 1.688-1.54 1.118l-3.367-2.448a1 1 0 00-1.175 0l-3.367 2.448c-.785.57-1.84-.197-1.54-1.118l1.287-3.951a1 1 0 00-.364-1.118L2.08 9.377c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.95z" />
                              </svg>
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-200 text-base lg:text-lg font-light italic relative before:content-['“'] before:absolute before:-left-5 before:text-blue-600 before:text-2xl after:content-['”'] after:absolute after:text-blue-600 after:text-2xl">
                          {testimonial.review}
                        </p>
                        <h3 className="font-heading text-gray-900 dark:text-white text-lg lg:text-xl font-semibold mt-4">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base capitalize">
                          {testimonial.title}
                        </p>
                      </div>
                      {/* Image */}
                      <div className="w-full max-w-[80px] lg:w-1/2">
                        <div className="relative mx-auto">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-[40px] sm:h-[60px] lg:h-[80px] rounded-full"
                            onError={handleImageError}
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
                  Loading slider...
                </p>
              </div>
            )}

            {/* Prompt for user to submit a testimonial */}
            <div className="text-center mt-8">
              {isAuthenticated ? (
                isUserLoaded && userIdentity ? (
                  hasUserSubmitted === false ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-4">
                        We'd love to hear your feedback!
                      </p>
                      <TryUsOutButton />
                    </>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      You've already submitted a review.
                    </p>
                  )
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Loading user information...
                  </p>
                )
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    Log in
                  </Link>{" "}
                  to share your testimonial.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Slider Dots, Animations, and Background */}
      <style jsx>{`
        .custom-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          gap: 10px;
        }
        .custom-dots li {
          width: 10px;
          height: 10px;
          margin: 0;
        }
        .custom-dots li button {
          width: 10px;
          height: 10px;
          padding: 0;
        }
        .custom-dots li button:before {
          content: "";
          width: 10px;
          height: 10px;
          background: rgba(74, 108, 247, 0.4);
          border-radius: 50%;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .custom-dots li.slick-active button:before {
          background: #4a6cf7;
          transform: scale(1.3);
        }
        .testimonial-item {
          opacity: 0;
          animation: slideIn 0.6s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.5;
          }
        }
        @media (max-width: 640px) {
          .custom-dots {
            bottom: -30px;
            gap: 8px;
          }
          .custom-dots li {
            width: 8px;
            height: 8px;
          }
          .custom-dots li button:before {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </section>
  );
});

TestimonialsSlider.displayName = "TestimonialsSlider";

export default TestimonialsSlider;
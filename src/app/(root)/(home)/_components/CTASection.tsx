import React from 'react';

const CTASection = () => {
  return (
    <section id="cta" className="py-16 sm:py-24 lg:py-32 transition-all duration-500 ease-in-out">
      <div className="px-4 xl:container mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl px-6 py-12 sm:px-16 sm:py-16 shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Background Noise Pattern */}
          <div
            className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-10 dark:opacity-20 -z-10 transition-opacity duration-300"
            aria-hidden="true"
          ></div>

          {/* Gradient Glow Effect */}
          <div className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 opacity-70 dark:opacity-50">
            <svg width="1400" height="300" viewBox="0 0 1400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_63_363)">
                <rect x="350" y="50" width="700" height="400" fill="url(#paint0_linear_63_363)" />
              </g>
              <defs>
                <filter
                  id="filter0_f_63_363"
                  x="0"
                  y="-300"
                  width="1400"
                  height="1100"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="175" result="effect1_foregroundBlur_63_363" />
                </filter>
                <linearGradient
                  id="paint0_linear_63_363"
                  x1="350"
                  y1="150"
                  x2="1050"
                  y2="450"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#93C5FD" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                Ready to Collaborate? Start Now!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Join us to create something extraordinary. Let's bring your ideas to life with seamless collaboration.
              </p>
            </div>
            <div className="lg:w-1/3 text-center lg:text-right">
              <a
                href="#"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-heading text-lg font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Get started with collaboration"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
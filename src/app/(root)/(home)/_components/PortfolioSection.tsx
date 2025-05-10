"use client";
import Image from "next/image";
import { useState } from "react";

interface PortfolioItem {
  category: string;
  imageSrc: string;
  title: string;
  description: string;
  delay: string;
}

const PortfolioSection: React.FC = () => {
  const [filter, setFilter] = useState<string>("*");

  const portfolioItems: PortfolioItem[] = [
    {
      category: "ecom",
      imageSrc: "/images/portfolio/image-1.jpg",
      title: "Photo Retouching",
      description: "Branded Ecommerce",
      delay: ".2s",
    },
    {
      category: "branding",
      imageSrc: "/images/portfolio/image-2.jpg",
      title: "Photo Retouching",
      description: "Branded Ecommerce",
      delay: ".25s",
    },
    {
      category: "digital",
      imageSrc: "/images/portfolio/image-3.jpg",
      title: "Photo Retouching",
      description: "Branded Ecommerce",
      delay: ".3s",
    },
    {
      category: "ecom",
      imageSrc: "/images/portfolio/image-4.jpg",
      title: "Photo Retouching",
      description: "Branded Ecommerce",
      delay: ".35s",
    },
  ];

  const filteredItems = filter === "*"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === filter.replace(".", ""));

  return (
    <section id="portfolio" className="pt-10 sm:pt-16 lg:pt-24">
      <div className="px-4 sm:px-6 xl:container mx-auto">
        {/* Section Title */}
        <div
          className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
          data-wow-delay=".2s"
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] leading-[1] font-extrabold opacity-20 bg-gradient-to-b from-[rgba(74,108,247,0.4)] to-[rgba(74,108,247,0)] bg-clip-text text-transparent">
            PRODUCTS
          </span>
          <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">

            Innovative, scalable software solutions.
          </h2>
          <p className="text-dark-text text-base">
            Explore our products: innovative software, seamless integrations, scalable platforms, and robust tools designed to empower your business success.
          </p>
        </div>

        <div className="w-full">
          {/* Filter Buttons */}
          <div
            className="portfolio-btn-wrapper mb-8 sm:mb-12 flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300"
            data-wow-delay=".2s"
          >
            <button
              className={`font-heading text-dark px-4 sm:px-5 py-2 text-sm sm:text-base whitespace-nowrap dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative ${filter === "*" ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
                }`}
              onClick={() => setFilter("*")}
            >
              All
            </button>
            <button
              className={`font-heading text-dark px-4 sm:px-5 py-2 text-sm sm:text-base whitespace-nowrap dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative ${filter === ".branding" ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
                }`}
              onClick={() => setFilter(".branding")}
            >
              Branding
            </button>
            <button
              className={`font-heading text-dark px-4 sm:px-5 py-2 text-sm sm:text-base whitespace-nowrap dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative ${filter === ".digital" ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
                }`}
              onClick={() => setFilter(".digital")}
            >
              Digital
            </button>
            <button
              className={`font-heading text-dark px-4 sm:px-5 py-2 text-sm sm:text-base whitespace-nowrap dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative ${filter === ".ecom" ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""
                }`}
              onClick={() => setFilter(".ecom")}
            >
              eCommerce
            </button>
          </div>

          {/* Portfolio Grid */}
          <div className="portfolio-grid grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-x-4">
            {filteredItems.length === 1 ? (
              /* Single Item Layout */
              <div className="col-span-1">
                <div className="group relative overflow-hidden rounded-none">
                  <Image
                    src={filteredItems[0].imageSrc}
                    alt="portfolio-image"
                    className="w-full h-full object-cover"
                    width={300}
                    height={300}
                    layout="responsive"
                  />
                  <div
                    className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex translate-y-8 items-center justify-between rounded-sm bg-black/30 px-3 sm:px-4 py-3 sm:py-4 opacity-0 backdrop-blur-[20px] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:left-5 lg:px-4 xl:px-6"
                  >
                    <div className="border-r border-[#e9e9e9]/30 pr-3 sm:pr-4 lg:pr-4 xl:pr-5">
                      <h3 className="font-heading text-sm sm:text-base lg:text-base xl:text-xl font-medium text-white">
                        {filteredItems[0].title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-[#d9e9e9]/30">
                        {filteredItems[0].description}
                      </p>
                    </div>
                    <div className="pl-3 sm:pl-4 lg:pl-4 xl:pl-5">
                      <a
                        href="javascript:void(0)"
                        className="dark:hover:bg-primary hover:bg-primary flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-[#f8f8f8]/15 text-white hover:opacity-100 dark:hover:opacity-100"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          className="fill-current"
                        >
                          <path d="M13.4767 9.16689L9.00671 4.69689L10.185 3.51855L16.6667 10.0002L10.185 16.4819L9.00671 15.3036L13.4767 10.8336H3.33337V9.16689H13.4767Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-Item Layout */
              <>
                {/* Left Column: First, Third, and Fourth Images */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 gap-4 lg:grid-rows-2 lg:gap-y-4">
                  {/* First Image (Top-Left, Spans 2 Columns on lg) */}
                  <div className="group relative overflow-hidden rounded-none lg:row-span-1">
                    <Image
                      src={filteredItems[0]?.imageSrc || "/images/portfolio/image-1.jpg"}
                      alt="portfolio-image"
                      className="w-full h-full object-cover"
                      width={600}
                      height={300}
                      layout="responsive"
                    />
                    <div
                      className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex translate-y-8 items-center justify-between rounded-sm bg-black/30 px-3 sm:px-4 py-3 sm:py-4 opacity-0 backdrop-blur-[20px] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:left-5 lg:px-4 xl:px-6"
                    >
                      <div className="border-r border-[#e9e9e9]/30 pr-3 sm:pr-4 lg:pr-4 xl:pr-5">
                        <h3 className="font-heading text-sm sm:text-base lg:text-base xl:text-xl font-medium text-white">
                          {filteredItems[0]?.title || "Photo Retouching"}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-[#d9e9e9]/30">
                          {filteredItems[0]?.description || "Branded Ecommerce"}
                        </p>
                      </div>
                      <div className="pl-3 sm:pl-4 lg:pl-4 xl:pl-5">
                        <a
                          href="javascript:void(0)"
                          className="dark:hover:bg-primary hover:bg-primary flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-[#f8f8f8]/15 text-white hover:opacity-100 dark:hover:opacity-100"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            className="fill-current"
                          >
                            <path d="M13.4767 9.16689L9.00671 4.69689L10.185 3.51855L16.6667 10.0002L10.185 16.4819L9.00671 15.3036L13.4767 10.8336H3.33337V9.16689H13.4767Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Third and Fourth Images (Bottom-Left and Bottom-Middle on lg) */}
                  {filteredItems.length > 2 && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4 lg:row-span-1">
                      <div className="group relative overflow-hidden rounded-none">
                        <Image
                          src={filteredItems[2]?.imageSrc || "/images/portfolio/image-3.jpg"}
                          alt="portfolio-image"
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                          layout="responsive"
                        />
                        <div
                          className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex translate-y-8 items-center justify-between rounded-sm bg-black/30 px-3 sm:px-4 py-3 sm:py-4 opacity-0 backdrop-blur-[20px] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:left-5 lg:px-4 xl:px-6"
                        >
                          <div className="border-r border-[#e9e9e9]/30 pr-3 sm:pr-4 lg:pr-4 xl:pr-5">
                            <h3 className="font-heading text-sm sm:text-base lg:text-base xl:text-xl font-medium text-white">
                              {filteredItems[2]?.title || "Photo Retouching"}
                            </h3>
                            <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-[#d9e9e9]/30">
                              {filteredItems[2]?.description || "Branded Ecommerce"}
                            </p>
                          </div>
                          <div className="pl-3 sm:pl-4 lg:pl-4 xl:pl-5">
                            <a
                              href="javascript:void(0)"
                              className="dark:hover:bg-primary hover:bg-primary flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-[#f8f8f8]/15 text-white hover:opacity-100 dark:hover:opacity-100"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                className="fill-current"
                              >
                                <path d="M13.4767 9.16689L9.00671 4.69689L10.185 3.51855L16.6667 10.0002L10.185 16.4819L9.00671 15.3036L13.4767 10.8336H3.33337V9.16689H13.4767Z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      {filteredItems.length > 3 && (
                        <div className="group relative overflow-hidden rounded-none">
                          <Image
                            src={filteredItems[3]?.imageSrc || "/images/portfolio/image-4.jpg"}
                            alt="portfolio-image"
                            className="w-full h-full object-cover"
                            width={300}
                            height={300}
                            layout="responsive"
                          />
                          <div
                            className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex translate-y-8 items-center justify-between rounded-sm bg-black/30 px-3 sm:px-4 py-3 sm:py-4 opacity-0 backdrop-blur-[20px] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:left-5 lg:px-4 xl:px-6"
                          >
                            <div className="border-r border-[#e9e9e9]/30 pr-3 sm:pr-4 lg:pr-4 xl:pr-5">
                              <h3 className="font-heading text-sm sm:text-base lg:text-base xl:text-xl font-medium text-white">
                                {filteredItems[3]?.title || "Photo Retouching"}
                              </h3>
                              <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-[#d9e9e9]/30">
                                {filteredItems[3]?.description || "Branded Ecommerce"}
                              </p>
                            </div>
                            <div className="pl-3 sm:pl-4 lg:pl-4 xl:pl-5">
                              <a
                                href="javascript:void(0)"
                                className="dark:hover:bg-primary hover:bg-primary flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-[#f8f8f8]/15 text-white hover:opacity-100 dark:hover:opacity-100"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 20 20"
                                  className="fill-current"
                                >
                                  <path d="M13.4767 9.16689L9.00671 4.69689L10.185 3.51855L16.6667 10.0002L10.185 16.4819L9.00671 15.3036L13.4767 10.8336H3.33337V9.16689H13.4767Z" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Second Image (Top-Right on lg) */}
                {filteredItems.length > 1 && (
                  <div className="col-span-1">
                    <div className="group relative overflow-hidden rounded-none">
                      <Image
                        src={filteredItems[1]?.imageSrc || "/images/portfolio/image-2.jpg"}
                        alt="portfolio-image"
                        className="w-full h-full object-cover"
                        width={300}
                        height={600}
                        layout="responsive"
                      />
                      <div
                        className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex translate-y-8 items-center justify-between rounded-sm bg-black/30 px-3 sm:px-4 py-3 sm:py-4 opacity-0 backdrop-blur-[20px] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:left-5 lg:px-4 xl:px-6"
                      >
                        <div className="border-r border-[#e9e9e9]/30 pr-3 sm:pr-4 lg:pr-4 xl:pr-5">
                          <h3 className="font-heading text-sm sm:text-base lg:text-base xl:text-xl font-medium text-white">
                            {filteredItems[1]?.title || "Photo Retouching"}
                          </h3>
                          <p className="text-xs sm:text-sm lg:text-sm xl:text-base text-[#d9e9e9]/30">
                            {filteredItems[1]?.description || "Branded Ecommerce"}
                          </p>
                        </div>
                        <div className="pl-3 sm:pl-4 lg:pl-4 xl:pl-5">
                          <a
                            href="javascript:void(0)"
                            className="dark:hover:bg-primary hover:bg-primary flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-[#f8f8f8]/15 text-white hover:opacity-100 dark:hover:opacity-100"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              className="fill-current"
                            >
                              <path d="M13.4767 9.16689L9.00671 4.69689L10.185 3.51855L16.6667 10.0002L10.185 16.4819L9.00671 15.3036L13.4767 10.8336H3.33337V9.16689H13.4767Z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* See More Button */}
          <div className="w-full pt-8 sm:pt-10 text-center" data-wow-delay=".2s">
            <a
              href="javascript:void(0)"
              className="bg-primary font-heading hover:bg-primary/90 inline-flex items-center rounded-sm px-6 sm:px-8 py-3 sm:py-[14px] text-sm sm:text-base text-white"
            >
              See More Projects
              <span className="pl-2 sm:pl-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.172 7L6.808 1.636L8.222 0.222L16 8L8.222 15.778L6.808 14.364L12.172 9H0V7H12.172Z"
                    fill="white"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
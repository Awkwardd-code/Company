'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Counter Component
function Counter({ end, label }: { end: number; label: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="text-center">
            <h3 className="text-4xl font-bold text-indigo-600">{count}+</h3>
            <p className="text-gray-600">{label}</p>
        </div>
    );
}

export default function WhyUsSection() {
    return (
        <div className="bg-transparent py-12">
            {/* Section Title */}
            <div
                className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
            >
                <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] font-extrabold leading-none opacity-20"
                    style={{
                        background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.4) 0%, rgba(74, 108, 247, 0) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    WHY_US
                </span>

                <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
                Designed for Speed, Built for Results
                </h2>

                {/* Animated Counters */}
                <div className="flex justify-center items-center gap-12 mt-10">
                    <Counter end={250} label="UI elements" />
                    <Counter end={150} label="Pre-made blocks" />
                    <Counter end={100} label="Neatly coded pages" />
                </div>
            </div>

            {/* Main Section */}
            <div className="flex items-start justify-center px-4 lg:px-0">
                <div className="container mx-auto flex flex-col lg:flex-row gap-10">
                    {/* Left Section with Hero Card */}
                    <div className="lg:w-2/3 relative flex justify-center">
                        <div className="bg-transparent rounded-2xl shadow-lg p-8 w-full max-w-[800px]">
                            <Image
                                src="/images/blog/mi1@2x.png"
                                alt="Business Growth"
                                width={800}
                                height={450}
                                layout="responsive"
                                className="rounded-lg object-cover w-full h-auto"
                            />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-6">
                        {[
                            {
                                iconColor: 'text-blue-500',
                                title: 'Color & Font Options',
                                desc: 'Easily customize colors and fonts, or choose from provided options.',
                                path: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
                            },
                            {
                                iconColor: 'text-purple-500',
                                title: 'Cool Features & Elements',
                                desc: 'Equipped with stunning features and elements for designing appealing pages.',
                                path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                            },
                            {
                                iconColor: 'text-pink-500',
                                title: 'Modern Portfolio Layouts',
                                desc: 'Effortlessly create and maintain a visually stunning and impactful portfolio.',
                                path: 'M12 4v16m8-8H4',
                            },
                            {
                                iconColor: 'text-green-500',
                                title: 'Real-time Collaboration',
                                desc: 'Work with your team in real-time for seamless productivity and communication.',
                                path: 'M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m4-6a4 4 0 110 8 4 4 0 010-8z',
                            },
                        ].map(({ iconColor, title, desc, path }, idx) => (
                            <div key={idx} className="bg-transparent rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-3">
                                    <svg
                                        className={`w-8 h-8 ${iconColor}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d={path}
                                        />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 mt-2">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

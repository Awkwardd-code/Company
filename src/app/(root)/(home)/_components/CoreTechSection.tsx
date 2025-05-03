"use client"

import { useState } from 'react';

export default function CoreTechSection() {
  // State to manage the active filter
  const [filter, setFilter] = useState('All');

  // Data for the technologies with categories
  const technologies = [
    {
      title: 'React',
      description: 'A powerful library for building dynamic, interactive user interfaces with reusable components.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v16h16M12 4v16M4 12h16"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Tailwind CSS',
      description: 'A utility-first CSS framework for creating responsive and customizable designs quickly.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-teal-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12h18M3 6h18M3 18h18"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Headless UI',
      description: 'Accessible, unstyled UI components built to work seamlessly with Tailwind CSS.',
      category: 'UI',
      icon: (
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Vite',
      description: 'A fast build tool offering an optimized development and build experience for modern web projects.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      ),
    },
    {
      title: 'React Router',
      description: 'A flexible solution for managing routing and navigation in React applications.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Tanstack Table',
      description: 'A feature-rich library for creating performant and customizable data tables in React.',
      category: 'Backend',
      icon: (
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4h18v16H3z"
          ></path>
        </svg>
      ),
    },
    {
      title: 'React Hook Forms',
      description: 'A lightweight library for building flexible and high-performance form handling in React.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-pink-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Yup',
      description: 'A schema validation library for easily validating and transforming object shapes.',
      category: 'Backend',
      icon: (
        <svg
          className="w-10 h-10 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Node.js',
      description: 'A JavaScript runtime built on Chrome’s V8 engine for building scalable server-side applications.',
      category: 'Backend',
      icon: (
        <svg
          className="w-10 h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M12 5v14"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Express',
      description: 'A fast, minimalist framework for Node.js to build robust APIs and web applications.',
      category: 'Backend',
      icon: (
        <svg
          className="w-10 h-10 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h8M12 8v8"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Figma',
      description: 'A collaborative design tool for creating user interfaces and prototypes with ease.',
      category: 'UX',
      icon: (
        <svg
          className="w-10 h-10 text-pink-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2v20M2 12h20"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Next.js',
      description: 'A React framework for building server-rendered, static, and SEO-friendly web applications.',
      category: 'Frontend',
      icon: (
        <svg
          className="w-10 h-10 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          ></path>
        </svg>
      ),
    },
    {
      title: 'Chakra UI',
      description: 'A simple, modular, and accessible component library for building React applications.',
      category: 'UI',
      icon: (
        <svg
          className="w-10 h-10 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14M12 5v14"
          ></path>
        </svg>
      ),
    },
  ];

  // Filter technologies based on the selected category
  const filteredTechnologies =
    filter === 'All' ? technologies : technologies.filter((tech) => tech.category === filter);

  return (
    <section className="bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div
        className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
        data-wow-delay=".2s"
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
          CORE_TECH
        </span>

        <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
          Our Unique & Awesome Core Features
        </h2>
        <p className="text-dark-text text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis
          tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in
          maximus.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["All", "Frontend", "Backend", "UI", "UX"].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === category
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Technology Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTechnologies.map((tech, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{tech.icon}</div>
            <h3 className="text-lg font-semibold text-white">{tech.title}</h3>
            <p className="text-sm text-gray-400 mt-2">{tech.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
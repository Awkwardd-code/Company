"use client";

import type { NextPage } from 'next';
import { useState } from 'react';

const ProjectCard = () => (
  <div className="relative group">
    <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 overflow-hidden h-[380px]">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500" />
            <div className="space-y-1">
              <h3 className="text-white text-lg font-semibold">Jane Smith</h3>
              <p className="text-gray-400 text-sm">April 16, 2025</p>
            </div>
          </div>
          <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
            Web Dev
          </span>
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-32 bg-gray-700 rounded-lg" />

        {/* Title and Description */}
        <div className="space-y-1">
          <h2 className="text-white text-xl font-bold">
            E-Commerce Platform
          </h2>
          <p className="text-gray-400 text-sm">
            A scalable online store built with Next.js and Stripe.
          </p>
        </div>

        {/* Project Language */}
        <div>
          <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
            TypeScript
          </span>
        </div>

        {/* Tech Stack Snippet */}
        <div className="space-y-2 bg-black/30 rounded-lg p-4 text-gray-300 text-sm">
          <p>Tech: Next.js, TypeScript, Tailwind CSS</p>
          <p>Payments: Stripe API</p>
          <p>Database: PostgreSQL</p>
        </div>
      </div>
    </div>
  </div>
);

const ProjectsPage: NextPage = () => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const totalProjects = 6;
  const featuredProjects = 3;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Ambient background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-20 py-12">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-20 flex items-center justify-between rounded-xl mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Looking for a collaboration? <br /> Get Started Today!
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
            Get Started Now
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`py-2 px-6 rounded-lg font-semibold text-white transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('all')}
          >
            All Projects
          </button>
          <button
            className={`py-2 px-6 rounded-lg font-semibold text-white transition-colors ${
              filter === 'featured'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('featured')}
          >
            Featured Projects
          </button>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Our Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(filter === 'all' ? totalProjects : featuredProjects)].map((_, i) => (
              <div key={i}>
                <ProjectCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
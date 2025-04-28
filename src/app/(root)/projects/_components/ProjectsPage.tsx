"use client";

import { useState } from 'react';
import { NextPage } from 'next';
import { useQuery } from 'convex/react';
import ProjectCard from '@/components/ProjectCard';
import { api } from '../../../../../convex/_generated/api';

const ProjectsPage: NextPage = () => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  
  // Fetch the list of projects from Convex
  const projects = useQuery(api.projects.getProjects);  // No need to access `data` here
  
  const totalProjects = projects ? projects.length : 0;
  const featuredProjects = projects?.slice(0, 3) || [];

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
            {projects === undefined ? (
              <p>Loading projects...</p> // Handle undefined (loading) state
            ) : (
              [...Array(filter === 'all' ? totalProjects : featuredProjects.length)].map((_, i) => (
                <div key={i}>
                  <ProjectCard project={filter === 'all' ? projects[i] : featuredProjects[i]} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

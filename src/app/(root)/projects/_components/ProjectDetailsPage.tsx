"use client";

import type { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProjectDetailsPage: NextPage = () => {
  // Dummy data for the chart (e.g., monthly updates)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Commits',
        data: [10, 15, 8, 20, 12, 18],
        borderColor: 'rgba(59, 130, 246, 1)', // Blue to match the theme
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Issues Closed',
        data: [5, 8, 3, 10, 6, 9],
        borderColor: 'rgba(34, 197, 94, 1)', // Green to match the language badge
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Project Activity Over Time',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-20 py-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-20 flex items-center justify-between rounded-xl mb-16">
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
        <div className="space-y-12">
          {/* Main Content */}
          <div>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                E-Commerce Platform: A Scalable Solution
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500" />
                <div>
                  <p className="text-white font-semibold">Jane Smith</p>
                  <p className="text-gray-400 text-sm">April 16, 2025</p>
                </div>
                <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                  Web Dev
                </span>
              </div>
              <div className="w-full h-64 bg-gray-700 rounded-lg mb-6" />
              <div className="space-y-1 mb-4">
                <p className="text-gray-300">
                  This project is a fully functional e-commerce platform designed to provide a seamless shopping experience. Built with modern technologies, it ensures scalability, security, and performance for businesses of all sizes.
                </p>
              </div>
              <div className="mb-4">
                <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                  TypeScript
                </span>
              </div>
              <div className="space-y-2 bg-black/30 rounded-lg p-4 text-gray-300 text-sm mb-6">
                <p>Tech: Next.js, TypeScript, Tailwind CSS</p>
                <p>Payments: Stripe API</p>
                <p>Database: PostgreSQL</p>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300">
                <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Project Overview</h2>
                <p>
                  The E-Commerce Platform project was developed to address the needs of modern online businesses. It features a responsive design, secure payment processing with Stripe, and a robust backend powered by PostgreSQL. The use of Next.js ensures fast page loads and SEO optimization, while TypeScript adds type safety to the development process.
                </p>
                <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Implementation Details</h2>
                <p>
                  One of the key challenges was integrating the Stripe API for secure payments. Below is a snippet of how we set up the payment gateway in the backend:
                </p>
                <div className="bg-black/30 rounded-lg p-4 my-4 text-sm">
                  <p className="text-gray-300">import Stripe from 'stripe';</p>
                  <p className="text-gray-300">const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);</p>
                  <p className="text-gray-300">const session = await stripe.checkout.sessions.create({});</p>
                </div>
                <p>
                  Additionally, we optimized the database queries to handle large product catalogs efficiently, ensuring a smooth user experience even under heavy load.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Updates Section with Chart */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Recent Updates
            </h2>
            <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-6">
              <div className="h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
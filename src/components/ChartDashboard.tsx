"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  // Data for the donut chart
  const data = {
    labels: ['73% Financial Overhead', '55% Bonus & Found', '38% IT Infrastructure', '20.93% Gift Code Inventory'],
    datasets: [
      {
        data: [73, 55, 38, 20.93],
        backgroundColor: ['#1E90FF', '#4682B4', '#87CEFA', '#B0C4DE'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%', // Creates the donut effect
    maintainAspectRatio: true, // Ensures the chart doesn't resize unexpectedly
    plugins: {
      legend: {
        display: false, // Custom legend below
      },
      tooltip: {
        enabled: true, // Enable tooltips on hover
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="max-w-4xl w-full mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg p-8 shadow-[0_6px_30px_rgba(150,150,150,0.4)] dark:shadow-[0_6px_30px_rgba(100,100,100,0.5)]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Donut Chart with Fixed Size */}
          <div className="w-[300px] h-[300px] flex items-center justify-center">
            <Doughnut data={data} options={options} />
          </div>

          {/* Text and Legend */}
          <div className="text-gray-800 dark:text-gray-200 max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">
              <span className="text-blue-500 dark:text-blue-400">TOKEN</span> SALE
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center md:text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              condimentum tellus at lectus pulvinar, id auctor felis iaculis. In
              vestibulum neque sem, at dapibus justo facilisis in.
            </p>

            {/* Custom Legend */}
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start">
                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                <span>73% FINANCIAL OVERHEAD</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                <span>55% BONUS & FOUND</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="w-4 h-4 rounded-full bg-blue-300 mr-2"></span>
                <span>38% IT INFRASTRUCTURE</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="w-4 h-4 rounded-full bg-blue-200 mr-2"></span>
                <span>20.93% GIFT CODE INVENTORY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
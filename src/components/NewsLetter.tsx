import type { NextPage } from 'next';

const NewsLetter: NextPage = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 px-20 flex items-center justify-between">
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
  );
};

export default NewsLetter;
import type { NextPage } from 'next';

const NewsLetter: NextPage = () => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white py-10 px-4 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          Looking for a collaboration? <br /> Get Started Today!
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mt-2 text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-4 md:mt-0">
        Get Started Now
      </button>
    </div>
  );
};

export default NewsLetter;


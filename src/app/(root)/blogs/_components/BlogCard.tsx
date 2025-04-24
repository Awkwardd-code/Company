import type { NextPage } from 'next';

const Card = () => (
  <div className="relative group">
    <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 overflow-hidden h-[380px]">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500" />
            <div className="space-y-1">
              <h3 className="text-white text-lg font-semibold">John Doe</h3>
              <p className="text-gray-400 text-sm">April 16, 2025</p>
            </div>
          </div>
          <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
            Tech
          </span>
        </div>

        {/* Image Placeholder */}
        <div className="w-full h-32 bg-gray-700 rounded-lg" />

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-white text-xl font-bold">
            Building a Modern Web App
          </h2>
          <p className="text-gray-400 text-sm">
            A guide to creating scalable web applications.
          </p>
        </div>

        {/* Code block */}
        <div className="space-y-2 bg-black/30 rounded-lg p-4 text-gray-300 text-sm">
          <p>const app = express();</p>
          <p>app.use(express.json());</p>
          <p>app.listen(3000, () = console.log('Server running'));</p>
        </div>
      </div>
    </div>
  </div>
);

const BlogPage: NextPage = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <Card />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
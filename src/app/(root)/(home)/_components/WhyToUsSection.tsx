import Image from 'next/image';

export default function WhyToUsSection() {
  return (
    <div className="bg-transparent min-h-screen flex items-center justify-center p-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar with Features */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Feature 1 */}
          <div className="bg-transparent rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                Well-Written Code
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              Pixel-perfect and easily editable code with comprehensive comments.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-transparent rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                Gorgeous Shop Layouts
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              Present your products to your visitors in an efficient and visually appealing manner.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-transparent rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m6 9a9 9 0 01-9-9m9 9a9 9 0 009-9"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                Fully Responsive Layouts
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              Adjusts to varying screen sizes, ensuring seamless compatibility across all devices.
            </p>
          </div>

          {/* 🆕 Feature 4 (New Div) */}
          <div className="bg-transparent rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                Quality Assurance
              </h3>
            </div>
            <p className="text-gray-600 mt-2">
              Every product is tested for performance, reliability, and scalability.
            </p>
          </div>
        </div>

        {/* Right Section with Image */}
        <div className="lg:w-2/3 flex justify-center items-center">
          <div className="bg-transparent rounded-2xl shadow-lg p-6 w-full">
            <Image
              src="/images/blog/mi2@2x.png"
              alt="Team Collaboration"
              width={700}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

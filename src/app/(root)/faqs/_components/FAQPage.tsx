"use client";
import type { NextPage } from 'next';
import { useState } from 'react';

const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 p-6 mb-4">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={onToggle}
      >
        <h3 className="text-xl font-semibold text-white">{question}</h3>
        <span className="text-white text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mt-4 text-gray-300">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQPage: NextPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the purpose of this platform?",
      answer:
        "Our platform connects developers and creators to collaborate on exciting projects. Whether you're a coder, designer, or innovator, you can find opportunities to work together and build something amazing.",
    },
    {
      question: "How do I get started with collaboration?",
      answer:
        "Simply click the 'Get Started Now' button in the banner above, sign up for an account, and start exploring projects or creating your own. You can also browse our blog for tips and inspiration.",
    },
    {
      question: "Is there a cost to join?",
      answer:
        "We offer a free tier with limited access to features. For more advanced collaboration tools and higher usage limits, you can upgrade to a premium plan. Check our pricing page for details.",
    },
    {
      question: "Can I share code snippets on the platform?",
      answer:
        "Yes! Our platform supports sharing code snippets in blog posts and project descriptions. You can format your code using markdown, and it will be displayed in a styled code block, as seen in our blog posts.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via the contact form on our website or by emailing support@platform.com. We're here to help with any questions or issues you might have.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
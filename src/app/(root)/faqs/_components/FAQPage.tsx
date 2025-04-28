"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQ {
  question: string;
  answer: string;
}

const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <article
      className="bg-white dark:bg-[#1a1a2e] rounded-xl border border-gray-200 dark:border-[#2a2a3a] p-6 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <button
        className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 rounded-md"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question}`}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {question}
        </h3>
        <span className="text-gray-900 dark:text-white">
          {isOpen ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
        id={`faq-answer-${question}`}
      >
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          <p>{answer}</p>
        </div>
      </div>
    </article>
  );
};

const FAQPage: NextPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
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
    {
      question: "What kind of projects can I find on the platform?",
      answer:
        "Our platform hosts a wide variety of projects, including web development, mobile apps, open-source contributions, and creative design collaborations. You can filter projects by category, skill level, or required expertise to find the perfect match.",
    },
    {
      question: "How do I ensure my contributions are recognized?",
      answer:
        "All contributions are tracked within project dashboards, and you can showcase your work in your profile. We also provide badges and recognition for top contributors, which you can share on your portfolio or social media.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-20%] w-80 h-80 bg-blue-400/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[30%] right-[-20%] w-80 h-80 bg-purple-400/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#1a1a2e] dark:to-[#2a2a3a] text-gray-900 dark:text-white py-12 px-6 sm:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between rounded-xl mb-16 shadow-lg">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Looking for Collaboration? <br /> Get Started Today!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm sm:text-base max-w-md">
              Join our platform to connect with developers, designers, and innovators to build amazing projects together.
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Get started with collaboration"
          >
            Get Started Now
          </Button>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
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
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
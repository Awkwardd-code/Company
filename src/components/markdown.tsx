"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Key, LegacyRef } from 'react';

// Utility function to filter out Framer Motion-specific props
const filterMotionProps = <T extends Record<string, any>>(props: T): Omit<T, keyof HTMLMotionProps<any>> => {
  const motionPropsToOmit = [
    'animate',
    'initial',
    'transition',
    'whileHover',
    'whileTap',
    'drag',
    'dragConstraints',
    'onDrag',
    'onDragStart',
    'onDragEnd',
    'onAnimationComplete',
    'variants',
  ];
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !motionPropsToOmit.includes(key))
  ) as Omit<T, keyof HTMLMotionProps<any>>;
};

interface MarkdownProps {
  content: string;
}

export const Markdown = ({ content }: MarkdownProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <motion.h1
            {...filterMotionProps(props)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: 'easeOut' }}
            className="text-4xl font-bold my-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          />
        ),
        h2: ({ node, ...props }) => (
          <motion.h2
            {...filterMotionProps(props)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: 'easeOut' }}
            className="text-3xl font-bold my-5 text-gray-900 dark:text-white"
          />
        ),
        h3: ({ node, ...props }) => (
          <motion.h3
            {...filterMotionProps(props)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: 'easeOut' }}
            className="text-2xl font-bold my-4 text-gray-900 dark:text-white"
          />
        ),
        p: ({ node, ...props }) => (
          <motion.p
            {...filterMotionProps(props)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: 'easeOut' }}
            className="my-5 leading-loose text-gray-700 dark:text-gray-200"
          />
        ),
        a: ({ node, ...props }) => (
          <motion.a
            {...filterMotionProps(props)}
            href={props.href}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 group"
            aria-label={props.children?.toString() || 'Link'}
          >
            {props.children}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300" />
          </motion.a>
        ),
        ul: ({ node, ...props }) => (
          <motion.ul
            {...filterMotionProps(props)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, ease: 'easeOut' }}
            className="my-4 pl-8 list-none space-y-2"
          />
        ),
        li: ({ node, ...props }) => (
          <motion.li
            {...filterMotionProps(props)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, ease: 'easeOut' }}
            className="relative pl-4 text-gray-700 dark:text-gray-200 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-indigo-600 before:rounded-full"
          />
        ),
        ol: ({ node, ...props }) => (
          <motion.ol
            {...filterMotionProps(props)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, ease: 'easeOut' }}
            className="my-4 pl-8 list-decimal text-gray-700 dark:text-gray-200"
          />
        ),
        code: ({ node, ...props }) => {
          const isInline = node && node.position
            ? !node.position.start.line || node.position.start.line === node.position.end.line
            : true; // Fallback to inline if node is undefined
          return isInline ? (
            <motion.code
              {...filterMotionProps(props)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, ease: 'easeOut' }}
              className="bg-gray-100 dark:bg-gray-800/80 rounded px-2 py-1 text-sm text-gray-800 dark:text-gray-200 font-mono"
            />
          ) : (
            <motion.code
              {...filterMotionProps(props)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, ease: 'easeOut' }}
              className="block bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 text-sm text-gray-800 dark:text-gray-200 font-mono border border-gray-200/50 dark:border-gray-700/50"
            />
          );
        },
        pre: ({ node, children, ...props }) => (
          <motion.div
            {...filterMotionProps(props)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="relative bg-gradient-to-b from-gray-100/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md rounded-lg p-4 my-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto">
              {children}
            </pre>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCopy(children?.toString() || '')}
              className="absolute top-3 right-3 p-2 bg-blue-500/10 dark:bg-blue-900/20 rounded-md text-gray-600 dark:text-gray-300 hover:bg-blue-500/20 dark:hover:bg-blue-900/30 transition-colors"
              aria-label={copied ? 'Code copied' : 'Copy code'}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.button>
          </motion.div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
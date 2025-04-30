"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Blog {
  _id: Id<"blogs">;
  _creationTime: number;
  slug: string;
  title: string;
  content: string;
  coverImage?: string;
  authorId: Id<"users">;
  createdAt: number;
  tags?: string[];
  updatedAt?: number;
  published: boolean;
}

const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden h-[380px] animate-pulse">
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const Card = ({ blog }: { blog: Blog }) => {
  const author = useQuery(api.users.getAuthorDetails, { userId: blog.authorId });
  const tag = blog.tags && blog.tags.length > 0 ? blog.tags[0] : "General";
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/blogs/${blog.slug}`} className="relative group block" aria-label={`Read ${blog.title}`}>
        <div className="bg-white dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden h-[400px] transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 transition-transform duration-300 group-hover:scale-105" />
                <div className="space-y-1">
                  <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
                    {author?.name || "Unknown Author"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg transition-transform duration-300 group-hover:scale-105">
                {tag}
              </span>
            </div>

            {blog.coverImage && !imageError ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image
                  src={blog.coverImage}
                  alt={`${blog.title} cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  priority={false}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg transition-colors duration-300" />
            )}

            <div className="space-y-1">
              <h2 className="text-gray-900 dark:text-white text-xl font-bold line-clamp-1 transition-colors duration-300">
                {blog.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                {blog.content}
              </p>
            </div>

            <button className="mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
              Read More
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BlogSection: NextPage = () => {
  const blogs = useQuery(api.blogs.get);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blogs !== undefined) {
      setIsLoading(false);
    }
  }, [blogs]);

  // Filter published blogs client-side
  const publishedBlogs = blogs?.filter((blog) => blog.published) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] -left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl transition-colors duration-300" />
        <div className="absolute top-[20%] -right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl transition-colors duration-300" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
          data-wow-delay=".2s"
        >
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] font-extrabold leading-none opacity-20"
            style={{
              background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.4) 0%, rgba(74, 108, 247, 0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            BLOGS
          </span>

          <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
            Discover Expert Insights <br /> Start Your Journey Today!
          </h2>
          <p className="text-dark-text text-base">
            Explore our collection of tutorials and insights from industry experts.
          </p>
        </div>


        {isLoading || blogs === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : publishedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600 dark:text-gray-400">
            <p className="text-lg font-medium">No blogs found</p>
            <p className="text-sm">Check back later for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedBlogs.map((blog: Blog) => (
              <Card key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;

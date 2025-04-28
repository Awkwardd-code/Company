"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { format } from "date-fns";
import { Loader2Icon, ArrowLeft, Share2, Bookmark, Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const blog = useQuery(api.blogs.getBySlug, { slug });
  const allBlogs = useQuery(api.blogs.get) ?? [];

  // Fetch author details for the main blog
  const author = useQuery(api.users.getAuthorDetails, blog ? { userId: blog.authorId } : "skip");

  // Fetch professional record for the author
  const professional = useQuery(api.professionals.getByUserId, author ? { userId: author._id } : "skip");

  // Get related blogs (excluding current blog, only published)
  const relatedBlogs = allBlogs
    .filter((b) => b._id !== blog?._id && b.published)
    .slice(0, 3);

  if (blog === null) notFound();
  if (!blog) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900">
      {/* Floating gradient blobs */}
      <FloatingBlobs />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Link
                href="/blogs"
                className="flex items-center group text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <motion.div whileHover={{ x: -4 }} className="flex items-center">
                  <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to all articles</span>
                </motion.div>
              </Link>
            </motion.div>

            {/* Main article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/70 dark:border-gray-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Cover image with parallax effect */}
              {blog.coverImage && (
                <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <Image
                      src={blog.coverImage}
                      alt={`${blog.title} cover`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </motion.div>
                </div>
              )}

              {/* Content container */}
              <div className="p-6 sm:p-8 md:p-12 space-y-8">
                {/* Article header */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-6">
                  {/* Author and date */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                      >
                        {author?.name?.charAt(0) || "A"}
                      </motion.div>
                      <div className="space-y-1">
                        <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
                          {author?.name || "Unknown Author"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
                          {blog.updatedAt && (
                            <span className="text-gray-400 dark:text-gray-500 ml-2">
                              (Updated {format(new Date(blog.updatedAt), "MMMM dd, yyyy")})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            whileHover={{ y: -2 }}
                            className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <motion.h1
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight"
                  >
                    {blog.title}
                  </motion.h1>

                  {/* Action buttons */}
                  <div className="flex items-center gap-6 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group"
                    >
                      <Heart className="h-5 w-5 group-hover:fill-current transition-all" />
                      <span>Like</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                    >
                      <Bookmark className="h-5 w-5 group-hover:fill-current transition-all" />
                      <span>Save</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Comment</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Content with smooth appearance */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 leading-relaxed"
                >
                  <Markdown content={blog.content} />
                </motion.div>
              </div>
            </motion.article>

            {/* Author bio */}
            {author && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/70 dark:border-gray-700/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0"
                  >
                    {author.name?.charAt(0) || "A"}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{author.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {professional?.bio || (author.role ? author.role.charAt(0).toUpperCase() + author.role.slice(1) : "Writer at our blog")}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all"
                    >
                      Follow Author
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Comments section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/70 dark:border-gray-700/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Discussion ({Math.floor(Math.random() * 50) + 10} comments)
              </h2>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Share your thoughts..."
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all"
                    >
                      Post Comment
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Sample comment */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      This article was incredibly insightful! I particularly enjoyed the section about performance optimization. Looking forward to more content like this.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Reply</button>
                      <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1">
                        <Heart className="h-4 w-4" /> 12
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ease: "easeInOut" }}
              className="sticky top-24 space-y-6"
            >
              {/* Table of Contents */}
              {blog.content.includes("#") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, ease: "easeInOut" }}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </motion.span>
                    Table of Contents
                  </h2>
                  <div className="space-y-3">
                    {blog.content.split("\n").filter((line) => line.startsWith("# ")).map((heading, i) => (
                      <motion.a
                        key={i}
                        href={`#${heading.replace("# ", "").toLowerCase().replace(/ /g, "-")}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, ease: "easeInOut" }}
                        className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors pl-4 border-l-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 py-1"
                        aria-label={`Jump to ${heading.replace("# ", "")}`}
                      >
                        {heading.replace("# ", "")}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
              />

              {/* Related Blogs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, ease: "easeInOut" }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-2 rounded-lg shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </motion.span>
                  {relatedBlogs.length > 0 ? "Related Articles" : "Popular Reads"}
                </h2>
                {relatedBlogs.length > 0 ? (
                  <div className="space-y-6">
                    {relatedBlogs.map((blog, index) => (
                      <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                      >
                        <BlogCard blog={blog} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Newsletter Subscription */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, ease: "easeInOut" }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/30"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscribe to Our Newsletter</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                        Get the latest articles delivered straight to your inbox.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="flex-1 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Email for newsletter subscription"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all whitespace-nowrap"
                          aria-label="Subscribe to newsletter"
                        >
                          Subscribe
                        </motion.button>
                      </div>
                    </motion.div>
                    {/* Community Call-to-Action */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, ease: "easeInOut" }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-r from-purple-50/70 to-pink-50/70 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/30"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Join Our Community</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                        Connect with other readers and share your thoughts.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all w-full"
                        aria-label="Join community"
                      >
                        Join Now
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
              />

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, ease: "easeInOut" }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-2 rounded-lg shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </motion.span>
                  Stay Connected
                </h2>
                <div className="flex gap-4 justify-center">
                  {[
                    {
                      href: "https://twitter.com",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742.457-1.421.673-2.896.672-4.381 0-.997-.312-1.943-.852-2.777 1.02-.708 1.892-1.638 2.495-2.806z" />
                        </svg>
                      ),
                      color: "blue",
                      label: "Twitter",
                    },
                    {
                      href: "https://facebook.com",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                      color: "blue",
                      label: "Facebook",
                    },
                    {
                      href: "https://linkedin.com",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.048c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                      color: "blue",
                      label: "LinkedIn",
                    },
                    {
                      href: "https://youtube.com",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      ),
                      color: "red",
                      label: "YouTube",
                    },
                  ].map(({ href, icon, color, label }, index) => (
                    <motion.a
                      key={href}
                      href={href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1, ease: "easeInOut" }}
                      whileHover={{ y: -4, scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-${color}-100 dark:bg-${color}-900/30 p-3 rounded-full text-${color}-600 dark:text-${color}-400 hover:text-white hover:bg-${color}-600 dark:hover:bg-${color}-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${color}-500`}
                      aria-label={`Follow us on ${label}`}
                    >
                      {icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 flex items-center justify-center">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
      <Loader2Icon className="h-16 w-16 text-blue-600 dark:text-blue-400" />
    </motion.div>
  </div>
);

// Floating gradient blobs
const FloatingBlobs = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-10">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -80, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 25, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute top-[15%] -left-1/3 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[80px]"
    />
    <motion.div
      animate={{
        x: [0, -100, 0],
        y: [0, 80, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 30, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute top-[15%] -right-1/3 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-[80px]"
    />
    <motion.div
      animate={{
        x: [0, 60, 0],
        y: [0, 120, 0],
        scale: [1, 1.2, 1],
        transition: { duration: 35, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute bottom-[10%] left-1/4 w-[400px] h-[400px] bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-[70px]"
    />
  </div>
);

// Component for blog cards in related articles
const BlogCard = ({ blog }: { blog: any }) => {
  const author = useQuery(api.users.getAuthorDetails, { userId: blog.authorId });
  const tag = blog.tags && blog.tags.length > 0 ? blog.tags[0] : "General";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/70 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/blog/${blog.slug}`} className="block group">
        {blog.coverImage && (
          <div className="relative w-full h-40 overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={`${blog.title} cover`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        )}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 shadow-sm" />
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {author?.name || "Unknown Author"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {blog.title}
          </h3>

          <div className="flex justify-between items-center">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(Math.random() * 10) + 1} min read</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
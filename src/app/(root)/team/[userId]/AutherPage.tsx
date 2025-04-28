"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { api } from "../../../../../convex/_generated/api";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

interface BlogPost {
  _id: Id<"blogs">;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  published: boolean;
  authorId: Id<"users">;
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
}

interface Project {
  _id: Id<"projects">;
  userId: Id<"users">;
  name: string;
  url: string;
  _creationTime: number;
}

// ProjectCard Component
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Website Preview */}
      <div className="aspect-video overflow-hidden rounded-t-md border-b border-gray-200/50 dark:border-gray-700/50 group">
        <iframe
          src={project.url}
          title={project.name}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          className="w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
          {project.name}
        </h3>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all mb-4 block"
        >
          {project.url}
        </a>
        <motion.a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-4 py-2 bg-blue-500/10 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-900/30 transition-colors duration-300"
        >
          View Project
        </motion.a>
      </div>
    </motion.div>
  );
};

// Floating gradient blobs (from TeamPage)
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

export default function AuthorPage() {
  const { userId } = useParams<{ userId: string }>();

  // Validate userId before querying
  if (!userId || typeof userId !== "string") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Invalid Author ID
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The author ID is missing or invalid. Please check the URL.
          </p>
        </motion.div>
      </div>
    );
  }

  const author = useQuery(api.users.getUserById, { userId: userId as Id<"users"> });
  const professional = useQuery(api.professionals.getByUserId, { userId: userId as Id<"users"> });
  const allBlogs = useQuery(api.blogs.get);
  const allProjects = useQuery(api.projects.getProjects);

  // Memoize filtered and formatted blog posts
  const formattedBlogPosts = useMemo(() => {
    if (!allBlogs) return [];
    return allBlogs
      .filter((blog) => blog.authorId === userId && blog.published)
      .map((blog) => ({
        ...blog,
        date: new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
  }, [allBlogs, userId]);

  // Memoize filtered projects
  const formattedProjects = useMemo(() => {
    if (!allProjects) return [];
    return allProjects.filter((project) => project.userId === userId);
  }, [allProjects, userId]);

  // Loading state
  if (author === undefined || professional === undefined || allBlogs === undefined || allProjects === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Loader2Icon className="size-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  // Error state (e.g., author or professional not found)
  if (!author || !professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Author Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The author you’re looking for doesn’t exist or has been removed.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 py-12">
      <FloatingBlobs />

      {/* Profile Section */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={container}
        className="text-center mb-16 max-w-4xl mx-auto"
      >
        {/* Avatar */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 mx-auto mb-6"
        >
          <Image
            src={professional.image || "/default-avatar.png"}
            alt={author.name}
            width={128}
            height={128}
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:border-blue-400 transition-all duration-300"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
            sizes="(max-width: 768px) 100vw, 128px"
          />
        </motion.div>

        {/* Name and Description */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4"
        >
          {author.name}
        </motion.h1>
        <motion.p
          variants={item}
          className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          {professional.bio || "No bio available"}
        </motion.p>

        {/* Social Links / Follow Button */}
        <motion.div variants={item} className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-2 bg-blue-500/10 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-900/30 transition-colors duration-300"
            aria-label={`Follow ${author.name}`}
          >
            Follow
          </motion.button>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-blue-500/10 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 dark:hover:bg-blue-900/30 transition-colors"
            aria-label="LinkedIn profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Blog Posts Grid */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-6xl mx-auto mb-16"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-8 text-center"
        >
          Posts by {author.name}
        </motion.h2>
        <AnimatePresence>
          {formattedBlogPosts.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {formattedBlogPosts.map((post) => (
                <motion.div
                  key={post._id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative">
                    <Image
                      src={post.coverImage || "/default-post.png"}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/default-post.png";
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")}
                    </p>

                    {/* Author and Date */}
                    <div className="flex items-center mb-4">
                      <Image
                        src={professional.image || "/default-avatar.png"}
                        alt={author.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-2"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        {author.name} • {post.date}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.length ? (
                        post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-blue-100/80 dark:bg-blue-900/80 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="inline-block bg-blue-100/80 dark:bg-blue-900/80 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full">
                          Blog
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn}
              className="text-center py-16"
            >
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                No Posts Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {author.name} hasn’t published any posts yet. Check back soon!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Projects Grid */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          variants={item}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-8 text-center"
        >
          Projects by {author.name}
        </motion.h2>

        <AnimatePresence>
          {formattedProjects.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {formattedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn}
              className="text-center py-16"
            >
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {author.name} hasn’t added any projects yet. Check back soon!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}
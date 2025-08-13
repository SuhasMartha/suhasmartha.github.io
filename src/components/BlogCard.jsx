import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ post, index }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
    >
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white shadow-lg">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Reading time overlay */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {post.readTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-lhilit-1/10 text-lhilit-1 dark:bg-dhilit-1/10 dark:text-dhilit-1 border border-lhilit-1/20 dark:border-dhilit-1/20 hover:bg-lhilit-1/20 dark:hover:bg-dhilit-1/20 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2 group-hover:text-lhilit-1 dark:group-hover:text-dhilit-1 transition-colors duration-300 leading-tight">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed text-sm">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <time>{formatDate(post.date)}</time>
          </div>
        </div>

        {/* Read More Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-lhilit-1 dark:text-dhilit-1 font-semibold hover:gap-3 transition-all duration-300 group/link text-sm"
          >
            Read More
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
import React, { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import HorizontalLine from "../components/HorizontalLine";
import 'highlight.js/styles/github-dark.css';
import Navbar from "../Navbar";
import Footer from "./Footer";
import { getPostBySlug } from "../utils/getMarkdownPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const [commentData, setCommentData] = React.useState({
    name: '',
    email: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState('');

  // If post not found, redirect to 404
  if (!post) {
    return <Navigate to="/404" replace />;
  }

  // Handle comment form input changes
  const handleCommentInputChange = (e) => {
    const { name, value } = e.target;
    setCommentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle comment form submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const formData = new FormData();
      formData.append('name', commentData.name);
      formData.append('email', commentData.email);
      formData.append('comment', commentData.comment);
      formData.append('_subject', `New comment on: ${post.title}`);
      formData.append('post_title', post.title);
      formData.append('post_url', window.location.href);
      formData.append('_captcha', 'false');

      const response = await fetch('https://formspree.io/f/xyzpoeby', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        setCommentData({ name: '', email: '', comment: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Comment submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  // SEO metadata
  useEffect(() => {
    document.title = `${post.title} - Suhas Martha Blog`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", post.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = post.excerpt;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = post.tags.join(', ');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = keywords;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", post.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute("property", "og:title");
      meta.content = post.title;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", post.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute("property", "og:description");
      meta.content = post.excerpt;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", post.image);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute("property", "og:image");
      meta.content = post.image;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [post]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Navbar />

      <Helmet>
      <title>{post.title} - Suhas Martha Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta name="keywords" content={post.tags.join(', ')} />
      <meta name="author" content={post.author} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={post.image} />
    </Helmet>
      
      <div className="min-h-screen pt-20">
        <div className="mycontainer">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-lhilit-1 dark:text-dhilit-1 hover:gap-3 transition-all duration-300 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {post.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white">
                    Featured
                  </span>
                </div>
              )}
            </motion.div>

            {/* Blog Header */}
            <motion.header
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="px-3 py-1 text-sm font-semibold rounded-full bg-lhilit-1/10 text-lhilit-1 dark:bg-dhilit-1/10 dark:text-dhilit-1 border border-lhilit-1/20 dark:border-dhilit-1/20"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              
              <h1 className="head1 mb-6 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white font-semibold">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{post.author}</p>
                      <p className="text-sm">Full Stack Developer</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <time className="font-medium">{formatDate(post.date)}</time>
                  <span>•</span>
                  <span className="font-medium">{post.readTime}</span>
                </div>
              </div>
            </motion.header>

            {/* Blog Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-lhilit-1 dark:prose-code:text-dhilit-1 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-a:text-lhilit-1 dark:prose-a:text-dhilit-1 prose-a:no-underline hover:prose-a:underline"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({children}) => <h1 className="text-4xl font-bold mt-12 mb-6 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h1>,
                  h2: ({children}) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>,
                  h3: ({children}) => <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>,
                  p: ({children}) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
                  code: ({inline, children}) => 
                    inline ? 
                      <code className="text-lhilit-1 dark:text-dhilit-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code> :
                      <code className="text-gray-100">{children}</code>,
                  pre: ({children}) => <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-200 dark:border-gray-700">{children}</pre>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-lhilit-1 dark:text-dhilit-1 hover:underline font-medium">{children}</a>,
                  ul: ({children}) => <ul className="mb-4 space-y-2">{children}</ul>,
                  li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  strong: ({children}) => <strong className="text-gray-900 dark:text-gray-100 font-semibold">{children}</strong>,
                  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />
                }}
              >
                {post.content}
              </ReactMarkdown>
            </motion.div>

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"></div>
                <h3 className="head4">Comments & Discussion</h3>
              </div>

              {/* Comment Form */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  Share your thoughts
                </h4>
                
                <form 
                  onSubmit={handleCommentSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={commentData.name}
                        onChange={handleCommentInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={commentData.email}
                        onChange={handleCommentInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comment *
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={commentData.comment}
                      onChange={handleCommentInputChange}
                      required
                      rows="5"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300 resize-vertical disabled:opacity-50"
                      placeholder="Share your thoughts about this post..."
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your email won't be published. All fields are required.
                    </p>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        'Post Comment'
                      )}
                    </button>
                  </div>
                </form>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        Comment posted successfully! Thank you for your feedback.
                      </span>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-900/20 dark:border-red-800"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-700 dark:text-red-300 font-medium">
                        Failed to post comment. Please try again later.
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Comment Guidelines */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  💬 Comment Guidelines
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Be respectful and constructive in your feedback</li>
                  <li>• Share your experiences and insights related to the topic</li>
                  <li>• Ask questions if something needs clarification</li>
                  <li>• Comments are moderated and will appear after review</li>
                </ul>
              </div>
            </motion.section>
            </motion.article>
           &nbsp;
          <hr />
          <div className="py-8"></div>
          <Footer />
          <div className="pb-12"></div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
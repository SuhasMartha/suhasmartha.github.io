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
import { getSupabasePostBySlug } from "../utils/getMarkdownPosts";
import { supabase } from "../lib/supabase";
import { analytics, trackView, trackShare, trackReadingTime } from "../utils/analytics";
import ShareButtons from "./ShareButtons";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(true);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentData, setCommentData] = React.useState({
    name: '',
    email: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState('');

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await getSupabasePostBySlug(slug);
        setPost(postData);
        
        // Track view when post loads
        if (postData) {
          await trackView(postData.id, postData.slug);
          loadLikes(postData.id);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [slug]);

  // Load likes for the post
  const loadLikes = async (postId) => {
    try {
      const { data, error } = await supabase
        .from('post_analytics')
        .select('likes')
        .eq('post_id', postId)
        .single();

      if (data) {
        setLikeCount(data.likes || 0);
      }

      // Check if user has liked this post (using localStorage for simplicity)
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setIsLiked(likedPosts.includes(postId));
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  // Handle like button click
  const handleLike = async () => {
    if (!post) return;

    try {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      
      if (isLiked) {
        // Unlike
        const updatedLikedPosts = likedPosts.filter(id => id !== post.id);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));

        // Update in database
        await supabase.rpc('decrement_post_likes', { post_id: post.id });
      } else {
        // Like
        const updatedLikedPosts = [...likedPosts, post.id];
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
        setIsLiked(true);
        setLikeCount(prev => prev + 1);

        // Update in database
        await supabase.rpc('increment_post_likes', { post_id: post.id });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  // Track reading time when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (post) {
        trackReadingTime(post.id);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && post) {
        trackReadingTime(post.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (post) {
        trackReadingTime(post.id);
      }
    };
  }, [post]);
  // Load comments for the post
  useEffect(() => {
    const loadComments = async () => {
      if (!post) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_comments')
          .select('*')
          .eq('post_id', post.id)
          .eq('approved', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [post]);

  // If post not found, redirect to 404
  if (!loading && !post) {
    return <Navigate to="/404" replace />;
  }

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lhilit-1 dark:border-dhilit-1 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
          </div>
        </div>
      </>
    );
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
      const { error } = await supabase
        .from('blog_comments')
        .insert([
          {
            post_id: post.id,
            name: commentData.name,
            email: commentData.email,
            comment: commentData.comment,
            approved: false // Comments need approval by default
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setCommentData({ name: '', email: '', comment: '' });
    } catch (error) {
      console.error('Comment submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Handle comment form submission (keeping the old implementation as backup)
  const handleCommentSubmitOld = async (e) => {
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Navbar />

      {post && (
        <Helmet>
          <title>{post.title} - Suhas Martha Blog</title>
          <meta name="description" content={post.excerpt} />
          <meta name="keywords" content={post.tags.join(', ')} />
          <meta name="author" content={post.author} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={post.image} />
        </Helmet>
      )}
      
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

            {/* Share and Like Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 flex items-center justify-between"
            >
              {/* Share Buttons (left) */}
              <ShareButtons 
                post={post} 
                onShare={(platform) => trackShare(post.id, platform)}
              />

              {/* Like Button */}
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`group relative flex items-center justify-center px-6 py-3 rounded-full border-2 transition-all duration-300 ml-auto
                  ${isLiked
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-red-400 dark:hover:border-red-400 hover:text-red-400 dark:hover:text-red-400"
                  }`}
                aria-label={isLiked ? "Unlike this post" : "Like this post"}
              >
                <span className="mr-2 font-semibold text-base">Like</span>
                {/* Heart Icon */}
                <motion.svg
                  className="w-7 h-7"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={isLiked ? 0 : 2}
                  viewBox="0 0 24 24"
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </motion.svg>
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {/* Pulse animation when liked */}
                {isLiked && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-400"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
            </motion.div>

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
                        Comment submitted successfully! It will appear after moderation.
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

              {/* Existing Comments */}
              <div className="mt-8">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  💬 Comments ({comments.length})
                </h5>
                
                {loadingComments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lhilit-1 dark:border-dhilit-1 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(comment.name)}`}>
                            {getInitials(comment.name)}
                          </div>
                          
                          {/* Comment content */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h6 className="font-semibold text-gray-900 dark:text-gray-100">
                                {comment.name}
                              </h6>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatCommentDate(comment.created_at)}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                    </svg>
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
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
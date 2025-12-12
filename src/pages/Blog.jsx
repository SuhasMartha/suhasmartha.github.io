import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { getSupabasePosts, getSupabaseFeaturedPosts, getSupabaseRecentPosts } from "../utils/getMarkdownPosts";
import { supabase } from "../lib/supabase";

const MonthlyArchive = ({ onMonthClick, selectedMonth }) => {
  const [archiveData, setArchiveData] = useState({});
  const [expandedYears, setExpandedYears] = useState({});

  useEffect(() => {
    const loadArchiveData = async () => {
      try {
        const posts = await getSupabasePosts();
        const archive = {};

        posts.forEach(post => {
          const date = new Date(post.date || post.created_at);
          const year = date.getFullYear();
          const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

          if (!archive[year]) {
            archive[year] = {};
          }
          if (!archive[year][monthYear]) {
            archive[year][monthYear] = [];
          }
          archive[year][monthYear].push(post);
        });

        setArchiveData(archive);

        // Keep all years collapsed by default
        setExpandedYears({});
      } catch (error) {
        console.error('Error loading archive data:', error);
      }
    };

    loadArchiveData();
  }, []);

  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const sortedYears = Object.keys(archiveData)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Monthly Archive
      </h3>
      <div className="space-y-4">
        {sortedYears.map(year => (
          <div key={year}>
            <button
              onClick={() => toggleYear(year)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              <span>{year}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expandedYears[year] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {expandedYears[year] && (
              <div className="space-y-2 pl-2">
                {Object.entries(archiveData[year])
                  .sort(([a], [b]) => new Date(b) - new Date(a))
                  .map(([monthYear, posts]) => (
                    <button
                      key={monthYear}
                      onClick={() => onMonthClick(monthYear)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${selectedMonth === monthYear
                        ? "bg-lhilit-1 dark:bg-dhilit-1 text-white"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      <span className="text-sm">{monthYear.split(' ')[0]} {monthYear.split(' ')[1]}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedMonth === monthYear
                        ? "bg-white/30 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}>
                        {posts.length}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingPosts = () => {
  const navigate = useNavigate();
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        // Try to read global trending slugs from Supabase `trending_posts` table
        const { data: tdata, error: terr } = await supabase
          .from('trending_posts')
          .select('slug')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!terr && tdata && tdata.length > 0) {
          const slugs = tdata.map(r => r.slug);
          const all = await getSupabasePosts();
          // Preserve order of slugs
          const matched = slugs.map(s => all.find(p => p.slug === s)).filter(Boolean);
          setTrendingPosts(matched.slice(0, 3));
          setLoading(false);
          return;
        }

        // Fallback: compute top by views
        const posts = await getSupabasePosts();
        const sorted = posts
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 3);
        setTrendingPosts(sorted);
      } catch (error) {
        console.error('Error loading trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Trending Posts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Trending Posts</h3>
      <div className="space-y-3">
        {trendingPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition group text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-lhilit-1 dark:group-hover:text-dhilit-1 transition">
                {post.title}
              </p>
              {/* views intentionally hidden in list */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTag, setSelectedTag] = useState("All");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterData, setNewsletterData] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 9;

  // Read `month` query param so links like /blog?month=June%202025 filter correctly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const month = params.get('month');
    if (month) {
      setSelectedMonth(month);
    }
  }, [location.search]);

  // Load posts from markdown files
  useEffect(() => {
    const loadPosts = async () => {
      const supabasePosts = await getSupabasePosts();
      setPosts(supabasePosts);
      setFilteredPosts(supabasePosts);
    };

    loadPosts();
  }, []);

  // Handle newsletter form input changes
  const handleNewsletterInputChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle newsletter form submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const formData = new FormData();
      formData.append('email', newsletterData.email);
      formData.append('_subject', 'New Blog Newsletter Subscription');
      formData.append('_captcha', 'false');

      const response = await fetch('https://formspree.io/f/mldlaegq', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        setNewsletterData({ email: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Get all unique tags
  const allTags = ["All", ...new Set(posts.flatMap(post => post.tags))];

  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const loadFeaturedAndRecent = async () => {
      const featured = await getSupabaseFeaturedPosts();
      const recent = await getSupabaseRecentPosts(3);
      setFeaturedPosts(featured);
      setRecentPosts(recent);
    };

    loadFeaturedAndRecent();
  }, []);

  // SEO metadata
  useEffect(() => {
    document.title = "Blog - Suhas Martha | Tech Insights";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore my blog for insights on web development, React, JavaScript, CSS, and modern web technologies. Learn from practical examples and tutorials.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Explore my blog for insights on web development, React, JavaScript, CSS, and modern web technologies. Learn from practical examples and tutorials.";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "Blog, Web Development, React, JavaScript, CSS, Tailwind CSS, Programming, Tech Tutorials");
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = "Blog, Web Development, React, JavaScript, CSS, Tailwind CSS, Programming, Tech Tutorials";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  // Filter posts based on selected tag and search term
  useEffect(() => {
    let filtered = posts;

    // Filter by tag
    if (selectedTag !== "All") {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by month if selected
    if (selectedMonth) {
      filtered = filtered.filter(post => {
        const date = new Date(post.date || post.created_at);
        const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        return monthYear === selectedMonth;
      });
    }

    // Make a shallow copy before sorting to avoid mutating original array
    filtered = filtered.slice();

    // Sort posts based on selected sort order
    switch (sortOrder) {
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true }));
        break;
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base', numeric: true }));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at));
        break;
      case "trending":
        // Sort by views if available, otherwise by date
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0) || new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedTag, searchTerm, posts, sortOrder, selectedMonth]);

  // Pagination logic
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: scroll to top of posts section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <Navbar />

      <div className="min-h-screen pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <h1 className="head1 mb-6">
              Welcome to My <span className="texthilit1">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Dive into the world of web development, modern technologies, and creative solutions.
              I share insights, tutorials, and experiences from my journey as a developer.
            </p>
          </motion.section>

          {/* Search and Filter Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex flex-col items-center gap-5">
              {/* Search Bar + Show Tags Button */}
              <div className="flex items-center gap-3 w-full max-w-3xl mx-auto">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-3 pl-16 rounded-3xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg shadow-sm focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Show/Hide Tags Button */}
                <button
                  onClick={() => setShowTags(prev => !prev)}
                  className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition whitespace-nowrap"
                >
                  {showTags ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Tags below search (toggleable, hidden by default) */}
              {showTags && (
                <div className="w-full flex justify-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedTag === tag
                          ? "bg-lhilit-1 dark:bg-dhilit-1 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-lhilit-1/10 dark:hover:bg-dhilit-1/10 hover:text-lhilit-1 dark:hover:text-dhilit-1"
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && selectedTag === "All" && !searchTerm && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"></div>
                <h2 className="head4">Featured Posts</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </motion.section>
          )}

          {/* All Posts Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"></div>
                <h2 className="head4">
                  {selectedMonth ? `Posts from ${selectedMonth}` :
                    selectedTag === "All" && !searchTerm ? "All Posts" :
                      searchTerm ? `Search Results for "${searchTerm}"` :
                        `Posts tagged with "${selectedTag}"`}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                </div>

                {/* Sort button beside posts header */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-haspopup="true"
                    aria-expanded={showSortMenu}
                    title="Sort posts"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    <span className="text-sm hidden sm:inline">Sort</span>
                  </button>

                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => { setSortOrder('a-z'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOrder === 'a-z' ? 'font-semibold' : ''}`}
                          >
                            A - Z
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortOrder('z-a'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOrder === 'z-a' ? 'font-semibold' : ''}`}
                          >
                            Z - A
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortOrder('newest'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOrder === 'newest' ? 'font-semibold' : ''}`}
                          >
                            Newest
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortOrder('oldest'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOrder === 'oldest' ? 'font-semibold' : ''}`}
                          >
                            Oldest
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortOrder('trending'); setShowSortMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOrder === 'trending' ? 'font-semibold' : ''}`}
                          >
                            Trending
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} hideMetadata={true} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 1.441.383 2.794 1.052 3.962" />
                  </svg>
                </div>
                <h3 className="flex justify-center text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No posts found</h3>
                <p className="flex justify-center text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms or browse all posts."
                    : selectedMonth
                      ? `No posts found for ${selectedMonth}.`
                      : `No posts found for the "${selectedTag}" tag. Try selecting a different tag.`
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedTag("All");
                    setSearchTerm("");
                    setSelectedMonth(null);
                  }}
                  className="px-6 py-3 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-full font-semibold hover:bg-lhilit-2 dark:hover:bg-dhilit-2 transition-colors duration-300"
                >
                  View All Posts
                </button>
              </motion.div>
            )}
          </motion.section>

          {/* Monthly Archive + Trending Posts (bottom) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-1 h-8 bg-gradient-to-b from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"></div>
              <h2 className="head4">Browse</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <MonthlyArchive
                  onMonthClick={setSelectedMonth}
                  selectedMonth={selectedMonth}
                />

                {selectedMonth && (
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                  >
                    Clear Month Filter
                  </button>
                )}
              </div>

              <div>
                <TrendingPosts />
              </div>
            </div>
          </motion.section>

          {/* Newsletter Signup Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 mb-16"
          >
            <div className="bg-gradient-to-r from-lhilit-1/10 to-lhilit-2/10 dark:from-dhilit-1/10 dark:to-dhilit-2/10 rounded-2xl p-8 md:p-12 text-center border border-lhilit-1/20 dark:border-dhilit-1/20">
              <h3 className="head4 mb-4">Stay Updated</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Get notified when I publish new posts about web development, programming tips, and tech insights.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  value={newsletterData.email}
                  onChange={handleNewsletterInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-full font-semibold hover:bg-lhilit-2 dark:hover:bg-dhilit-2 transition-colors duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Successfully subscribed! Welcome to the newsletter.
                    </span>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-900/20 dark:border-red-800 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      Failed to subscribe. Please try again later.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
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

export default Blog;
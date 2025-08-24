import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../components/Footer";
import BlogCard from "../components/BlogCard";
import { getSupabasePosts, getSupabaseFeaturedPosts, getSupabaseRecentPosts } from "../utils/getMarkdownPosts";

const MonthlyArchive = () => {
  const [archiveData, setArchiveData] = useState([]);

  useEffect(() => {
    const loadArchiveData = async () => {
      try {
        const posts = await getSupabasePosts();
        const archive = {};
        
        posts.forEach(post => {
          const date = new Date(post.date || post.created_at);
          const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          
          if (!archive[monthYear]) {
            archive[monthYear] = [];
          }
          archive[monthYear].push(post);
        });
        
        const sortedArchive = Object.entries(archive)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .slice(0, 6); // Show last 6 months
        
        setArchiveData(sortedArchive);
      } catch (error) {
        console.error('Error loading archive data:', error);
      }
    };
    
    loadArchiveData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Monthly Archive
      </h3>
      <div className="space-y-3">
        {archiveData.map(([monthYear, posts]) => (
          <div key={monthYear} className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">{monthYear}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {posts.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


const Blog = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterData, setNewsletterData] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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

    setFilteredPosts(filtered);
  }, [selectedTag, searchTerm, posts]);

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <Navbar />
      
      <div className="min-h-screen pt-20">
        <div className="mycontainer">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
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
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
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

              {/* Tag Filter */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTag === tag
                        ? "bg-lhilit-1 dark:bg-dhilit-1 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-lhilit-1/10 dark:hover:bg-dhilit-1/10 hover:text-lhilit-1 dark:hover:text-dhilit-1"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Posts Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 rounded-full"></div>
                  <h2 className="head4">
                    {selectedTag === "All" && !searchTerm ? "All Posts" : 
                     searchTerm ? `Search Results for "${searchTerm}"` : 
                     `Posts tagged with "${selectedTag}"`}
                  </h2>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                </div>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
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
                      : `No posts found for the "${selectedTag}" tag. Try selecting a different tag.`
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTag("All");
                      setSearchTerm("");
                    }}
                    className="px-6 py-3 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-full font-semibold hover:bg-lhilit-2 dark:hover:bg-dhilit-2 transition-colors duration-300"
                  >
                    View All Posts
                  </button>
                </motion.div>
              )}
            </motion.section>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-1 space-y-8"
            >
              {/* Monthly Archive */}
              <MonthlyArchive />
            </motion.aside>
          </div>
          {/* Newsletter Signup Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
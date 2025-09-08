import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { analytics } from "../../utils/analytics";

const PostAnalytics = ({ posts, comments, analyticsData }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postStats, setPostStats] = useState({});
  const [realTimeAnalytics, setRealTimeAnalytics] = useState({});
  const [seoData, setSeoData] = useState({});
  const [editingSEO, setEditingSEO] = useState(null);
  const [seoFormData, setSeoFormData] = useState({});

  useEffect(() => {
    calculatePostStats();
    initializeSEOData();
    loadRealTimeAnalytics();
  }, [posts, comments]);

  const loadRealTimeAnalytics = async () => {
    try {
      const analyticsData = await analytics.getAllPostsAnalytics();
      const analyticsMap = {};
      
      analyticsData.forEach(item => {
        if (item.blog_posts) {
          analyticsMap[item.post_id] = {
            views: item.views || 0,
            unique_views: item.unique_views || 0,
            shares: item.shares || 0,
            reading_time: item.reading_time || 0
          };
        }
      });
      
      setRealTimeAnalytics(analyticsMap);
    } catch (error) {
      console.error('Error loading real-time analytics:', error);
    }
  };
  const calculatePostStats = () => {
    const stats = {};
    
    posts.forEach(post => {
      const postComments = comments.filter(comment => comment.post_id === post.id);
      stats[post.id] = {
        comments: postComments.length,
        approvedComments: postComments.filter(c => c.approved).length,
        pendingComments: postComments.filter(c => !c.approved).length,
        views: Math.floor(Math.random() * 1000) + 50, // Simulated views - replace with real data
        engagement: postComments.length > 0 ? (postComments.length / 100 * 100).toFixed(1) : 0
      };
    });
    
    setPostStats(stats);
  };

  const initializeSEOData = () => {
    const seo = {};
    posts.forEach(post => {
      seo[post.id] = {
        metaTitle: post.title,
        metaDescription: post.excerpt,
        keywords: post.tags ? post.tags.join(', ') : '',
        ogImage: post.image,
        canonicalUrl: `https://suhasmartha.github.io/blog/${post.slug}`
      };
    });
    setSeoData(seo);
  };

  const handleSEOUpdate = async (postId, seoUpdates) => {
    try {
      // Update the post with SEO data in Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: seoUpdates.metaTitle,
          excerpt: seoUpdates.metaDescription,
          // You can add custom SEO fields to your database if needed
        })
        .eq('id', postId);

      if (error) throw error;

      setSeoData(prev => ({
        ...prev,
        [postId]: { ...prev[postId], ...seoUpdates }
      }));
      setEditingSEO(null);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successDiv.textContent = 'SEO data updated successfully!';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (error) {
      console.error('Error updating SEO:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Failed to update SEO data';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    }
  };

  const handleEditSEO = (postId) => {
    setEditingSEO(postId);
    setSeoFormData(seoData[postId] || {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getEngagementColor = (engagement) => {
    if (engagement >= 75) return "text-green-600 dark:text-green-400";
    if (engagement >= 50) return "text-yellow-600 dark:text-yellow-400";
    if (engagement >= 25) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const topPosts = posts
    .map(post => ({
      ...post,
      stats: postStats[post.id] || { comments: 0, views: 0 }
    }))
    .sort((a, b) => (b.stats.comments + b.stats.views) - (a.stats.comments + a.stats.views))
    .slice(0, 5);

  const recentPosts = posts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Post Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights into your blog performance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views (Simulated)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.totalViews?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Comments/Post</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {posts.length > 0 ? (analyticsData.totalComments / posts.length).toFixed(1) : '0'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.totalLikes || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Views/Post</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.avgViewsPerPost || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performing Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {post.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(post.created_at)}</span>
                    <span>•</span>
                    <span>{post.stats.comments} comments</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-lhilit-1 dark:text-dhilit-1">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Recent Posts Performance
          </h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {post.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    post.published 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatDate(post.created_at)}
                  </span>
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                    <span>{postStats[post.id]?.comments || 0} comments</span>
                    <span>•</span>
                    <span>{postStats[post.id]?.views || 0} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Post List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            All Posts Analytics
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {post.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {postStats[post.id]?.comments || 0}
                      {postStats[post.id]?.pendingComments > 0 && (
                        <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">
                          ({postStats[post.id].pendingComments} pending)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {realTimeAnalytics[post.id]?.views || postStats[post.id]?.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {realTimeAnalytics[post.id]?.likes || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditSEO(post.id)}
                      className="text-lhilit-1 dark:text-dhilit-1 hover:text-lhilit-2 dark:hover:text-dhilit-2 mr-3 px-3 py-1 border border-lhilit-1 dark:border-dhilit-1 rounded transition-colors duration-300"
                    >
                      🔍 Edit SEO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* SEO Edit Modal */}
      {editingSEO && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                🔍 Edit SEO Settings
              </h3>
              <button
                onClick={() => setEditingSEO(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📝 Meta Title
                </label>
                <input
                  type="text"
                  value={seoFormData.metaTitle || ''}
                  onChange={(e) => setSeoFormData(prev => ({
                    ...prev,
                    metaTitle: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                  placeholder="Enter SEO-optimized title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📄 Meta Description
                </label>
                <textarea
                  value={seoFormData.metaDescription || ''}
                  onChange={(e) => setSeoFormData(prev => ({
                    ...prev,
                    metaDescription: e.target.value
                  }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                  placeholder="Enter compelling meta description (150-160 characters)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {seoFormData.metaDescription?.length || 0}/160 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🏷️ Keywords
                </label>
                <input
                  type="text"
                  value={seoFormData.keywords || ''}
                  onChange={(e) => setSeoFormData(prev => ({
                    ...prev,
                    keywords: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate keywords with commas
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingSEO(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSEOUpdate(editingSEO, seoFormData)}
                  className="px-6 py-2 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  💾 Save SEO
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PostAnalytics;
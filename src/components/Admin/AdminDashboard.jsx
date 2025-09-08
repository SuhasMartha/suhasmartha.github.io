import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import BlogEditor from './BlogEditor';
import CommentModeration from './CommentModeration';
import PostAnalytics from './PostAnalytics';
import AuthorProfile from './AuthorProfile';
import { analytics } from '../../utils/analytics';

const AdminDashboard = ({ user, posts, postsLoading, onEdit, onDelete, onCreatePost }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    fetchComments();
    fetchAnalytics();
  }, []);

  // Auto logout after 20 minutes of inactivity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds

      if (inactiveTime >= twentyMinutes) {
        handleSignOut();
      }
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for inactivity every minute
    const inactivityInterval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityInterval);
    };
  }, [lastActivity]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      // Get real analytics data
      const allAnalytics = await analytics.getAllPostsAnalytics();
      
      const totalViews = allAnalytics.reduce((sum, item) => sum + (item.views || 0), 0);
      const totalShares = allAnalytics.reduce((sum, item) => sum + (item.shares || 0), 0);
      const totalLikes = allAnalytics.reduce((sum, item) => sum + (item.likes || 0), 0);
      
      const analyticsData = {
        totalViews,
        totalShares,
        totalLikes,
        avgViewsPerPost: posts.length > 0 ? Math.round(totalViews / posts.length) : 0,
        totalComments: comments.length,
        engagementRate: totalViews > 0 ? Math.round(((totalShares + totalLikes + comments.length) / totalViews) * 100) : 0
      };
      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .eq('id', commentId);
      
      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleRejectComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
    }
  };

  const handleToggleApproval = async (commentId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: !currentStatus })
        .eq('id', commentId);
      
      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const pendingComments = comments.filter(comment => !comment.approved);
      if (pendingComments.length === 0) {
        return;
      }

      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .in('id', pendingComments.map(c => c.id));
      
      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error bulk approving comments:', error);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleSavePost = async (postData) => {
    await onSave(postData);
    setIsEditing(false);
    setSelectedPost(null);
    setActiveTab('posts');
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const handleViewAuthor = (authorName) => {
    setSelectedAuthor(authorName);
    setActiveTab('author-profile');
  };

  const getStats = () => {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.published !== false).length;
    const draftPosts = totalPosts - publishedPosts;
    const featuredPosts = posts.filter(post => post.featured).length;
    const pendingComments = comments.filter(comment => !comment.approved).length;
    const totalComments = comments.length;

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      pendingComments,
      totalComments
    };
  };

  const stats = getStats();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPosts}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</h3>
                <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.draftPosts}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalComments}</p>
                {stats.pendingComments > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {stats.pendingComments} pending approval
                  </p>
                )}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Posts</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{post.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.created_at || post.date).toLocaleDateString()} • {post.author}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(post)}
                        className="text-lhilit-1 dark:text-dhilit-1 hover:text-lhilit-2 dark:hover:text-dhilit-2 text-sm px-3 py-1 border border-lhilit-1 dark:border-dhilit-1 rounded transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(post.id)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="rounded-lg shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Posts</h3>
              <button
                onClick={handleNewPost}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                New Post
              </button>
            </div>
            <div className="divide-y">
              {posts.map((post) => (
                <div key={post.slug} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()} • {post.author} • 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        post.published !== false ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(post.slug)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comments':
        return (
          <CommentModeration
            comments={comments}
            onApprove={handleApproveComment}
            onReject={handleRejectComment}
            onToggleApproval={handleToggleApproval}
            onBulkApprove={handleBulkApprove}
          />
        );

      case 'analytics':
        return (
          <PostAnalytics 
            posts={posts} 
            comments={comments} 
            analyticsData={{
              ...stats,
              totalViews: analyticsData.totalViews || 0,
              totalShares: analyticsData.totalShares || 0,
              totalLikes: analyticsData.totalLikes || 0,
              avgViewsPerPost: analyticsData.avgViewsPerPost || 0,
              engagementRate: analyticsData.engagementRate || 0
            }} 
          />
        );

      case 'authors':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Authors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...new Set(posts.map(post => post.author))].map((author) => {
                const authorPosts = posts.filter(post => post.author === author);
                return (
                  <div key={author} className="p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold">{author}</h4>
                        <p className="text-sm text-gray-500">{authorPosts.length} posts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewAuthor(author)}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'author-profile':
        return (
          <div>
            <button
              onClick={() => setActiveTab('authors')}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Authors
            </button>
            <AuthorProfile author={selectedAuthor} posts={posts} />
          </div>
        );

      case 'editor':
        return (
          <div>
            <button
              onClick={() => {
                setActiveTab('posts');
                setIsEditing(false);
                setSelectedPost(null);
              }}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Posts
            </button>
            <BlogEditor
              post={selectedPost}
              onSave={handleSavePost}
              onCancel={() => {
                setActiveTab('posts');
                setIsEditing(false);
                setSelectedPost(null);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome back, <span className="texthilit1">Admin</span>!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your blog content, moderate comments, and track analytics.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onCreatePost}
                className="px-6 py-3 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Write New Post
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'posts', label: 'Posts', icon: '📝', badge: stats.totalPosts },
              { id: 'comments', label: 'Comments', icon: '💬', badge: stats.pendingComments > 0 ? stats.pendingComments : null, badgeColor: 'bg-red-500 text-white' },
              { id: 'analytics', label: 'SEO & Analytics', icon: '📈' },
              { id: 'authors', label: 'Authors', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-lhilit-1 dark:border-dhilit-1 text-lhilit-1 dark:text-dhilit-1'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className={`ml-2 px-2 py-1 text-xs text-white rounded-full ${tab.badgeColor || 'bg-gray-500'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
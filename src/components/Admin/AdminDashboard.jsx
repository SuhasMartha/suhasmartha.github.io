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
  const [systemStatus, setSystemStatus] = useState({ status: 'checking', message: 'Connecting to database...' });

  useEffect(() => {
    fetchComments();
    fetchAnalytics();
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const start = Date.now();
      const { count, error } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
      const latency = Date.now() - start;

      if (error) throw error;

      setSystemStatus({
        status: 'online',
        message: `Database connected (${latency}ms latency)`
      });
    } catch (error) {
      console.error('System check failed:', error);
      setSystemStatus({
        status: 'error',
        message: `Connection Error: ${error.message || 'Unknown error'}`
      });
    }
  };

  // Auto logout after 20 minutes of inactivity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

      if (inactiveTime >= tenMinutes) {
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

  const [trendingSlugs, setTrendingSlugs] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [trendingError, setTrendingError] = useState('');

  const fetchTrendingSlugs = async () => {
    setLoadingTrending(true);
    setTrendingError('');
    try {
      // Try to read from trending_posts table (if it exists)
      const { data, error } = await supabase
        .from('trending_posts')
        .select('slug')
        .order('created_at', { ascending: false });

      // If table doesn't exist (404) or has data, use it
      if (!error) {
        setTrendingSlugs(data.map(r => r.slug) || []);
        return;
      }

      // Table doesn't exist, that's ok - we'll create it on save
      console.log('trending_posts table does not exist yet (will be created on save)');
      setTrendingSlugs([]);
    } catch (err) {
      console.error('Error fetching trending slugs:', err);
      // Still ok, just means table doesn't exist yet
      setTrendingSlugs([]);
    } finally {
      setLoadingTrending(false);
    }
  };

  const saveTrendingSlugs = async (selectedSlugs) => {
    setLoadingTrending(true);
    setTrendingError('');
    try {
      // Try to save to trending_posts table
      // First, delete all existing
      await supabase.from('trending_posts').delete().gte('id', '00000000-0000-0000-0000-000000000000');

      // Then insert new ones if any selected
      if (selectedSlugs.length > 0) {
        const rows = selectedSlugs.map(slug => ({ slug }));
        const { error: insError } = await supabase.from('trending_posts').insert(rows);

        if (insError) {
          // Table might not exist - try to create it and retry
          if (insError.code === 'PGRST102' || insError.message.includes('not found')) {
            console.log('trending_posts table does not exist. Please create it with: create table trending_posts (id uuid default gen_random_uuid() primary key, slug text not null, created_at timestamptz default now());');
            setTrendingError('Trending posts table not created yet. Run setup in browser console or create manually.');
            setTrendingSlugs(selectedSlugs);
            return;
          }
          throw insError;
        }
      }

      // Update local state
      setTrendingSlugs(selectedSlugs);
    } catch (err) {
      console.error('Error saving trending slugs:', err);
      setTrendingError(`Failed to save: ${err.message || 'Unknown error'}`);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    // load trending selection when admin opens dashboard
    if (activeTab === 'analytics') {
      fetchTrendingSlugs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome & Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome, <span className="text-lhilit-1 dark:text-dhilit-1">{user?.email?.split('@')[0] || 'Admin'}</span>! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Here's what's happening with your blog today.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">System Status</h3>
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${systemStatus.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : systemStatus.status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {systemStatus.status === 'online' ? 'All Systems Operational' : systemStatus.status === 'error' ? 'System Issues Detected' : 'Checking System...'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {systemStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Login Insight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center justify-between">
              <div>
                <h3 className="text-blue-800 dark:text-blue-200 font-medium">Current Session</h3>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'First Session'}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-200">
                🕒
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('posts')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalPosts}</p>
                  </div>
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">📝</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('comments')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{stats.totalComments}</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">💬</div>
                </div>
                {stats.pendingComments > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                    {stats.pendingComments} pending approval
                  </p>
                )}
              </div>

              {/* Analytics Snippets */}
              <div
                onClick={() => setActiveTab('analytics')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{analyticsData.totalViews || 0}</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">👀</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('analytics')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{analyticsData.engagementRate || 0}%</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600">📈</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('posts')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">Published Posts</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{stats.publishedPosts}</span>
                </div>
              </div>
              <div
                onClick={() => setActiveTab('posts')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">Drafts</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{stats.draftPosts}</span>
                </div>
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
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${post.published !== false ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                      onClick={() => onDelete(post.id)}
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
          <div className="space-y-6">
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

            {/* Trending Manager */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Trending Manager</h3>
                <div className="text-sm text-gray-500">
                  {posts.length === 0 ? (
                    <span className="text-red-600">No posts available</span>
                  ) : (
                    `Select posts to appear in Trending (${posts.length} posts available)`
                  )}
                </div>
              </div>

              {loadingTrending ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingError && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded">{trendingError}</div>
                  )}

                  {posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No posts available. Posts may still be loading.</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Reload Page
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-auto pr-2">
                        {posts && posts.length > 0 ? posts.map((p, idx) => {
                          const slug = p.slug || p.id || `post-${idx}`;
                          const checked = trendingSlugs.includes(slug);
                          const isDisabled = false; // No limit on trending posts
                          const position = trendingSlugs.indexOf(slug) + 1;

                          const handleToggle = () => {
                            if (checked) {
                              // Remove from trending
                              setTrendingSlugs(prev => prev.filter(s => s !== slug));
                            } else {
                              // Add to trending
                              setTrendingSlugs(prev => [...prev, slug]);
                            }
                          };

                          return (
                            <div
                              key={slug}
                              onClick={handleToggle}
                              className={`flex items-center gap-3 p-3 rounded-lg transition border-2 cursor-pointer ${isDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                } ${checked ? 'bg-lhilit-1/10 dark:bg-dhilit-1/10 border-lhilit-1 dark:border-dhilit-1' : 'border-transparent'}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={isDisabled}
                                onChange={() => { }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                              />
                              {checked && (
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lhilit-1 dark:bg-dhilit-1 text-white flex items-center justify-center text-xs font-bold">
                                  {position}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{p.title}</div>
                                <div className="text-xs text-gray-500">{new Date(p.date || p.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          );
                        }) : (
                          <div className="col-span-2 text-center text-gray-500">No posts found</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => saveTrendingSlugs(trendingSlugs)}
                          disabled={loadingTrending || trendingSlugs.length === 0}
                          className="px-4 py-2 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
                        >
                          Save Trending ({trendingSlugs.length})
                        </button>

                        <button
                          onClick={() => fetchTrendingSlugs()}
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          Reload
                        </button>

                        <div className="text-sm text-gray-500 ml-auto">Select posts to appear in trending</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'supabase':
        return (
          <div className="flex flex-col h-[calc(100vh-200px)] -m-8 relative group">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 text-center text-xs text-blue-600 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center px-4">
              <span>
                Note: You must be logged into Supabase in this browser. If it's blank or refused, it's a security block.
              </span>
              <a
                href="https://supabase.com/dashboard/project/maagvnyxarmbzozufqcd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold hover:text-blue-800"
              >
                Open External <span className="text-lg">↗</span>
              </a>
            </div>
            {/* 
              Supabase sends 'X-Frame-Options: SAMEORIGIN' which blocks standard embedding.
              This iframe will likely fail in standard browsers without extensions to strip headers.
              Restoring as per user request. 
            */}
            <iframe
              src="https://supabase.com/dashboard/project/maagvnyxarmbzozufqcd"
              className="w-full flex-1 border-0 bg-white"
              title="Supabase Dashboard"
              allow="clipboard-read; clipboard-write"
            />
          </div>
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-lhilit-1 dark:text-dhilit-1">⚡</span> Admin
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'posts', label: 'Posts', icon: '📝', badge: stats.totalPosts },
            { id: 'comments', label: 'Comments', icon: '💬', badge: stats.pendingComments > 0 ? stats.pendingComments : null, badgeColor: 'bg-red-500 text-white' },
            { id: 'analytics', label: 'SEO & Analytics', icon: '📈' },
            { id: 'authors', label: 'Authors', icon: '👥' },
            { id: 'supabase', label: 'Supabase', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${activeTab === tab.id
                ? 'bg-lhilit-1/10 text-lhilit-1 dark:text-dhilit-1'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <span className="mr-3 text-lg">{tab.icon}</span>
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.badge && (
                <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${tab.badgeColor || 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white font-bold text-xs">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Top Header Section */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'posts' && 'Blog Posts'}
                {activeTab === 'comments' && 'Comment Moderation'}
                {activeTab === 'analytics' && 'Analytics & SEO'}
                {activeTab === 'authors' && 'Author Management'}
                {activeTab === 'author-profile' && 'Author Profile'}
                {activeTab === 'supabase' && 'Database Resources'}
                {activeTab === 'editor' && 'Post Editor'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog content and performance
              </p>
            </div>

            {activeTab !== 'editor' && (
              <button
                onClick={handleNewPost}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span>+</span> New Post
              </button>
            )}
          </header>

          {/* Dynamic Content */}
          <div className="min-h-[500px]">
            {renderTabContent()}
          </div>

          <div className="pt-12 pb-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Suhas Martha Admin Panel
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
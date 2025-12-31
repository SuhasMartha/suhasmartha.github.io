// Recharts imports for Support Activity Graph
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import BlogEditor from './BlogEditor';
import CommentModeration from './CommentModeration';
import PostAnalytics from './PostAnalytics';
import AuthorProfile from './AuthorProfile';
import ContentCalendar from './ContentCalendar';
import { analytics } from '../../utils/analytics';
import supalogos from '../../assets/supabase-logo.png';
import searchConsoleLogo from '../../assets/search-console.png';
import analyticsLogo from '../../assets/google-analytics.png';

const AdminDashboard = ({ user, posts, postsLoading, onEdit, onDelete, onCreatePost, onSave }) => {
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

  // Support Data State
  const [supportData, setSupportData] = useState({ contacts: [], newsletter: [], games: [] });
  const [loadingSupport, setLoadingSupport] = useState(false);

  // Helper to get last 14 days activity
  const getSupportActivityData = () => {
    const days = 14;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Count items for this date
      const messagesCount = supportData.contacts.filter(c => c.created_at.startsWith(dateStr)).length;
      const feedbackCount = supportData.games.filter(g => g.created_at.startsWith(dateStr)).length;
      const newsletterCount = supportData.newsletter.filter(n => n.created_at.startsWith(dateStr)).length;

      data.push({
        date: shortDate,
        Messages: messagesCount,
        Feedback: feedbackCount,
        Newsletter: newsletterCount,
      });
    }
    return data;
  };

  const supportActivityData = getSupportActivityData();

  useEffect(() => {
    fetchComments();
    fetchAnalytics();
    checkSystemStatus();
    fetchSupportData();
  }, [posts]); // Refresh data when posts change

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

  const fetchSupportData = async () => {
    setLoadingSupport(true);
    try {
      const [contacts, newsletter, games] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('game_feedback').select('*').order('created_at', { ascending: false })
      ]);

      setSupportData({
        contacts: contacts.data || [],
        newsletter: newsletter.data || [],
        games: games.data || []
      });
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoadingSupport(false);
    }
  };

  const handleMarkSupportRead = async () => {
    try {
      const unreadContacts = supportData.contacts.filter(c => c.status === 'unread');
      const unreadGames = supportData.games.filter(g => g.status === 'new');

      if (unreadContacts.length > 0) {
        await supabase
          .from('contact_messages')
          .update({ status: 'read' })
          .in('id', unreadContacts.map(c => c.id));
      }

      if (unreadGames.length > 0) {
        await supabase
          .from('game_feedback')
          .update({ status: 'read' })
          .in('id', unreadGames.map(g => g.id));
      }

      await fetchSupportData();
    } catch (error) {
      console.error('Error marking support as read:', error);
    }
  };

  const handleDeleteSupport = async (table, id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchSupportData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item: ' + error.message);
    }
  };

  const handleReply = (email, subject = '', originalMessage = '', e) => {
    if (e) e.stopPropagation();
    if (!email) return;
    const subjectLine = subject ? `Re: ${subject}` : 'Re: Your message';
    const body = originalMessage ? `\n\n> ${originalMessage.substring(0, 100)}...` : '';
    // Use Gmail web interface to avoid blank tabs/unconfigured clients
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleCopyAllEmails = async () => {
    const emails = supportData.newsletter.map(sub => sub.email).join(', ');
    if (!emails) {
      alert('No subscribers to copy.');
      return;
    }
    await handleCopy(emails);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: You could add a toast state here
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const handleNewPost = (dateOrEvent = null) => {
    // If a date is provided (and it's not an event), pre-fill it
    const date = (dateOrEvent && !dateOrEvent.target) ? dateOrEvent : null;

    if (date) {
      setSelectedPost({
        title: '',
        slug: '',
        content: '',
        publish_date: date.toISOString().split('T')[0],
        published: false // Default to draft for scheduled posts
      });
    } else {
      setSelectedPost(null);
    }
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
      pendingComments,
      totalComments,
      unreadSupport: supportData.contacts.filter(c => c.status === 'unread').length + supportData.games.filter(g => g.status === 'new').length
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                onClick={() => setActiveTab('support')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Newsletter</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{supportData.newsletter.length}</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600">📧</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('support')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{supportData.contacts.length}</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">📫</div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('support')}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Game Feedback</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{supportData.games.length}</p>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">🎮</div>
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
          </div >
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

      case 'planning':
        return (
          <ContentCalendar
            posts={posts}
            onEditPost={handleEditPost}
            onNewPost={handleNewPost}
          />
        );

      case 'supabase':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <img src={supalogos} alt="Supabase Logo" className="w-12 h-12 object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Supabase Management</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                <span className="block mb-2 font-semibold text-amber-600 dark:text-amber-400">Developer Access Required</span>
              </p>
              <a
                href="https://supabase.com/dashboard/project/maagvnyxarmbzozufqcd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <span>Launch Supabase Studio</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Support Center & Analytics</h2>
              {(stats.unreadSupport > 0) && (
                <button
                  onClick={handleMarkSupportRead}
                  className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{supportData.contacts.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Newsletter Subscribers</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{supportData.newsletter.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Game Feedback</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">{supportData.games.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Messages */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Recent Messages</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {supportData.contacts.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No messages yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {supportData.contacts.map(contact => (
                        <li key={contact.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-semibold text-sm">{contact.first_name} {contact.last_name}</span>
                              <span className="text-xs text-gray-500 ml-2">{new Date(contact.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleReply(contact.email, contact.subject, contact.message, e)}
                                className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                                title="Reply via Email"
                              >
                                ↩️
                              </button>
                              <button
                                onClick={(e) => handleDeleteSupport('contact_messages', contact.id, e)}
                                className="p-1 hover:bg-red-100 text-red-600 rounded"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 cursor-pointer hover:text-blue-500" onClick={() => handleCopy(contact.email)} title="Click to copy email">
                            {contact.email}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">{contact.subject}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{contact.message}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Game Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Game Feedback</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {supportData.games.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No feedback yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {supportData.games.map(game => (
                        <li key={game.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-semibold text-sm">{game.name || 'Anonymous'}</span>
                              <span className="text-xs text-gray-500 ml-2">{new Date(game.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {game.email && (
                                <button
                                  onClick={(e) => handleReply(game.email, 'Game Feedback', game.message, e)}
                                  className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                                  title="Reply via Email"
                                >
                                  ↩️
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteSupport('game_feedback', game.id, e)}
                                className="p-1 hover:bg-red-100 text-red-600 rounded"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          {game.email && (
                            <p className="text-xs text-gray-400 mb-2 cursor-pointer hover:text-blue-500" onClick={() => handleCopy(game.email)} title="Click to copy email">
                              {game.email}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">{game.message}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Newsletter List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Newsletter Subscribers</h3>
                  <button
                    onClick={handleCopyAllEmails}
                    className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Copy all emails to clipboard"
                  >
                    📋 Copy All
                  </button>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{supportData.newsletter.length} Active</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {supportData.newsletter.map(sub => (
                    <div key={sub.id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded border border-gray-100 dark:border-gray-700 flex items-center gap-3 group relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✉️</div>
                      <div className="overflow-hidden flex-1">
                        <p
                          className="text-sm font-medium truncate cursor-pointer hover:text-blue-500"
                          onClick={(e) => { e.stopPropagation(); handleCopy(sub.email); }}
                          title="Click to copy email"
                        >
                          {sub.email}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-gray-800 rounded shadow-sm border p-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(sub.email); }}
                          className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                          title="Copy Email"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => handleDeleteSupport('newsletter_subscribers', sub.id, e)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                          title="Unsubscribe/Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'google-tools':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Google Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Search Console */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 p-4">
                  <img src={searchConsoleLogo} alt="Google Search Console" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Search Console</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
                  Monitor search performance, indexing status, and optimize visibility.
                </p>
                <a
                  href="https://search.google.com/search-console?resource_id=https%3A%2F%2Fsuhasmartha.github.io%2F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#4584da] dark:bg-[#4584da] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Open Console
                </a>
              </div>

              {/* Google Analytics */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center mb-4 p-4">
                  <img src={analyticsLogo} alt="Google Analytics" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Google Analytics</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
                  Track website traffic, user behavior, and real-time data.
                </p>
                <a
                  href="https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/a366804545p503112379/reports/intelligenthome?params=_u..nav%3Dmaui&collectionId=business-objectives"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Open Analytics
                </a>
              </div>
            </div>
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center whitespace-nowrap overflow-hidden">
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 ${!isSidebarOpen && 'hidden'}`}>
            <span className="text-lhilit-1 dark:text-dhilit-1">🛠️</span> Admin
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 ${!isSidebarOpen && 'mx-auto'}`}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'posts', label: 'Posts', icon: '📝' },
            { id: 'planning', label: 'Schedule', icon: '📅' },
            { id: 'comments', label: 'Comments', icon: '💬', badge: stats.pendingComments > 0 ? stats.pendingComments : null, badgeColor: 'bg-red-500 text-white' },
            { id: 'support', label: 'Support', icon: '📫', badge: stats.unreadSupport > 0 ? stats.unreadSupport : null, badgeColor: 'bg-blue-500 text-white' }, // New Support Tab
            { id: 'analytics', label: 'SEO & Analytics', icon: '📈' },
            { id: 'authors', label: 'Authors', icon: '👥' },
            { id: 'supabase', label: 'Supabase', icon: '⚡' },
            { id: 'google-tools', label: 'Google', icon: '🌐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${activeTab === tab.id
                ? 'bg-lhilit-1/10 text-lhilit-1 dark:text-dhilit-1'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                } ${!isSidebarOpen && 'justify-center px-2'}`}
              title={!isSidebarOpen ? tab.label : ''}
            >
              <span className={`text-lg transition-all ${isSidebarOpen ? 'mr-3' : 'mr-0'}`}>{tab.icon}</span>
              {isSidebarOpen && <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{tab.label}</span>}
              {tab.badge && isSidebarOpen && (
                <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${tab.badgeColor || 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200'}`}>
                  {tab.badge}
                </span>
              )}
              {tab.badge && !isSidebarOpen && (
                <span className={`absolute top-0 right-0 h-2 w-2 rounded-full ${tab.badgeColor ? 'bg-red-500' : 'bg-blue-500'}`} />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 whitespace-nowrap overflow-hidden">
          {isSidebarOpen ? (
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
          ) : (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white font-bold text-xs">
                {user?.email?.[0].toUpperCase() || 'A'}
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors ${!isSidebarOpen && 'px-2'}`}
            title="Sign Out"
          >
            {isSidebarOpen ? 'Sign Out' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full">
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
                {activeTab === 'google-tools' && 'Google Integrations'}
                {activeTab === 'planning' && 'Content Calendar'}
                {activeTab === 'support' && 'Support & Feedback'}
                {activeTab === 'editor' && 'Post Editor'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog content and performance
              </p>
            </div>

            {activeTab !== 'editor' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const root = document.documentElement;
                    const isDark = root.classList.contains('dark');
                    if (isDark) {
                      root.classList.remove('dark');
                      localStorage.setItem('theme', 'light');
                      root.style.setProperty('--on', '1');
                    } else {
                      root.classList.add('dark');
                      localStorage.setItem('theme', 'dark');
                      root.style.setProperty('--on', '0');
                    }
                  }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Toggle Theme"
                >
                  <span className="dark:hidden">☀️</span>
                  <span className="hidden dark:inline">🌙</span>
                </button>
                <button
                  onClick={handleNewPost}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>+</span> New Post
                </button>
              </div>
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
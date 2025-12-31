import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import Navbar from "../Navbar";
import Footer from "../components/Footer";
import AdminLogin from "../components/Admin/AdminLogin";
import AdminDashboard from "../components/Admin/AdminDashboard";
import BlogEditor from "../components/Admin/BlogEditor";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        } else {
          // No user found, ensure we show login
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch posts when user is authenticated
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      setPostsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);
  // SEO metadata
  const handleEditPost = (post) => {
    setEditingPost(post);
    setCurrentView('editor');
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Refresh posts list
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      setPosts(data || []);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post: ' + error.message);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setCurrentView('editor');
  };

  const handleSavePost = async () => {
    // Refresh posts list
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    setPosts(data || []);
    setCurrentView('dashboard');
    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('dashboard');
    setEditingPost(null);
  };

  useEffect(() => {
    document.title = "Admin Dashboard - Suhas Martha";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Admin dashboard for managing blog posts and content.");
    }
  }, []);

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lhilit-1 dark:border-dhilit-1 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      {!user ? (
        <>
          <Navbar />
          <div className="min-h-screen pt-20">
            <div className="mycontainer">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AdminLogin />
              </motion.div>

              <hr className="mt-16" />
              <div className="py-8"></div>
              <Footer />
              <div className="pb-12"></div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
          {currentView === 'dashboard' ? (
            <AdminDashboard
              user={user}
              posts={posts}
              postsLoading={postsLoading}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onCreatePost={handleCreatePost}
              onSave={handleSavePost}
            />
          ) : (
            <BlogEditor
              post={editingPost}
              onSave={handleSavePost}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Admin;
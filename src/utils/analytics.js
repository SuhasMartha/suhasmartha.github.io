import { supabase } from '../lib/supabase';

class BlogAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.currentPostId = null;
    this.hasTrackedView = false;
  }

  // Get client IP and user agent
  getClientInfo() {
    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString()
    };
  }

  // Track page view
  async trackView(postId, postSlug) {
    if (this.hasTrackedView && this.currentPostId === postId) {
      return; // Prevent duplicate tracking in same session
    }

    try {
      const clientInfo = this.getClientInfo();

      const { error } = await supabase
        .from('post_views')
        .insert([
          {
            post_id: postId,
            user_agent: clientInfo.userAgent,
            referrer: clientInfo.referrer,
            reading_time: 0
          }
        ]);

      if (error) {
        console.error('Error tracking view:', error);
      } else {
        this.hasTrackedView = true;
        this.currentPostId = postId;
        this.sessionStartTime = Date.now();
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }

  // Track reading time when user leaves
  async trackReadingTime(postId) {
    if (!this.hasTrackedView || this.currentPostId !== postId) {
      return;
    }

    const readingTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);

    if (readingTime < 5) return; // Ignore very short sessions

    try {
      // Update the most recent view record with reading time
      const { error } = await supabase
        .from('post_views')
        .update({ reading_time: readingTime })
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error updating reading time:', error);
      }
    } catch (error) {
      console.error('Error updating reading time:', error);
    }
  }

  // Track social shares
  async trackShare(postId, platform) {
    try {
      const { error } = await supabase
        .from('post_shares')
        .insert([
          {
            post_id: postId,
            platform: platform
          }
        ]);

      if (error) {
        console.error('Error tracking share:', error);
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }

  // Get analytics for a post
  async getPostAnalytics(postId) {
    try {
      const { data, error } = await supabase
        .from('post_analytics')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching analytics:', error);
        return null;
      }

      return data || {
        views: 0,
        unique_views: 0,
        shares: 0,
        likes: 0,
        reading_time: 0,
        bounce_rate: 0
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Get all posts analytics
  async getAllPostsAnalytics() {
    try {
      const { data, error } = await supabase
        .from('post_analytics')
        .select(`
          *,
          blog_posts (
            title,
            slug,
            created_at
          )
        `)
        .order('views', { ascending: false });

      if (error) {
        console.error('Error fetching all analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all analytics:', error);
      return [];
    }
  }

  // Get trending posts
  async getTrendingPosts(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('post_analytics')
        .select(`
          *,
          blog_posts (
            title,
            slug,
            excerpt,
            image,
            created_at
          )
        `)
        .order('views', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching trending posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  }
}

// Create singleton instance
export const analytics = new BlogAnalytics();

// Utility functions for easy use
export const trackView = (postId, postSlug) => analytics.trackView(postId, postSlug);
export const trackShare = (postId, platform) => analytics.trackShare(postId, platform);
export const trackReadingTime = (postId) => analytics.trackReadingTime(postId);
export const getPostAnalytics = (postId) => analytics.getPostAnalytics(postId);
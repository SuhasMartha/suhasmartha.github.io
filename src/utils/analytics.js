import { supabase } from '../lib/supabase';

class BlogAnalytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.currentPostId = null;
    this.hasTrackedView = false;
    this.userInfo = null;
  }

  // Get client IP and user agent details
  async getClientInfo() {
    // If we already have user info cached for this session, return it
    if (this.userInfo) return this.userInfo;

    try {
      // 1. Get Device Info
      const userAgent = navigator.userAgent;
      let deviceType = 'Desktop';
      if (/Mobi|Android/i.test(userAgent)) deviceType = 'Mobile';
      if (/Tablet|iPad/i.test(userAgent)) deviceType = 'Tablet';

      let os = 'Unknown';
      if (userAgent.indexOf("Win") !== -1) os = "Windows";
      if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
      if (userAgent.indexOf("Linux") !== -1) os = "Linux";
      if (userAgent.indexOf("Android") !== -1) os = "Android";
      if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

      let browser = 'Unknown';
      if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
      else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
      else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
      else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
      else if (userAgent.indexOf("Edge") > -1) browser = "Edge";
      else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
      else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

      // 2. Get Geolocation (using ipapi.co - free tier, no API key needed for low volume)
      const response = await fetch('https://ipapi.co/json/');
      const geoData = await response.json();

      this.userInfo = {
        userAgent: userAgent,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        country: geoData.country_name || 'Unknown',
        city: geoData.city || 'Unknown',
        deviceType: deviceType,
        os: os,
        browser: browser
      };

      return this.userInfo;
    } catch (error) {
      console.warn('Could not fetch geolocation:', error);
      // Fallback if geo fetch fails
      return {
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        country: 'Unknown',
        city: 'Unknown',
        deviceType: 'Unknown',
        os: 'Unknown',
        browser: 'Unknown'
      };
    }
  }

  // Track page view
  async trackView(postId, postSlug) {
    if (this.hasTrackedView && this.currentPostId === postId) {
      return; // Prevent duplicate tracking in same session
    }

    try {
      const clientInfo = await this.getClientInfo();

      const { error } = await supabase
        .from('post_views')
        .insert([
          {
            post_id: postId,
            user_agent: clientInfo.userAgent,
            referrer: clientInfo.referrer,
            reading_time: 0,
            country: clientInfo.country,
            city: clientInfo.city,
            device_type: clientInfo.deviceType,
            os: clientInfo.os,
            browser: clientInfo.browser
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
      const clientInfo = await this.getClientInfo();
      const { error } = await supabase
        .from('post_shares')
        .insert([
          {
            post_id: postId,
            platform: platform,
            country: clientInfo.country,
            city: clientInfo.city,
            device_type: clientInfo.deviceType
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
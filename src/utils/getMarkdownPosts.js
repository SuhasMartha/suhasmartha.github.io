import matter from 'gray-matter';
import { Buffer } from 'buffer';
import { supabase } from '../lib/supabase';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Static blog posts data as fallback
const staticPosts = [
  {
    id: 1,
    title: "Understanding Our Fallback Blog System - Keeping Content Accessible During Maintenance",
    slug: "fallback-blog-system",
    date: "2025-12-15",
    tags: ["Technical", "Infrastructure", "Supabase", "Error Handling", "Web Development"],
    author: "Suhas Martha",
    readTime: "5 min read",
    image: "https://images.ctfassets.net/em6l9zw4tzag/XSTZBaleYdbbtE4oiJesW/7709970e4cca45b0850617837206c4c1/1023_CRT9_404-hero.jpg?w=2520&h=945&fl=progressive&q=50&fm=jpg",
    excerpt: "Learn how our portfolio implements an intelligent fallback blog system that keeps content accessible even when Supabase database experiences outages. Understand graceful degradation, resilient architecture, and why this matters for modern web applications.",
    featured: true,
    content: `Ever wondered what happens when your blog database temporarily goes offline? Discover how our portfolio implements an intelligent fallback system that ensures content remains accessible even when cloud services experience hiccups. Learn about graceful degradation in web development and why this matters for user experience.

  ## What Is a Fallback Blog System?

  **fallback blog system** is a critical reliability feature that ensures your content remains accessible even when primary services (like Supabase database) experience temporary outages or connectivity issues.

  Think of it like a backup power generator—when the main power grid fails, the generator automatically kicks in to keep essential systems running. Similarly, when our Supabase database is unavailable, a pre-built, statically-stored blog content takes over seamlessly.

  ### The Problem It Solves

  Without a fallback system:

  - ❌ Users see broken pages or error messages
  - ❌ Content becomes completely inaccessible
  - ❌ Loss of trust in the platform
  - ❌ Poor user experience during maintenance windows

  With our fallback system:

  - ✅ Users always see content (static or dynamic)
  - ✅ Graceful degradation without visible errors
  - ✅ Continuous availability during repairs
  - ✅ Professional, reliable experience

  ***

  ## How Our Fallback Blog Works

  ### What Happens Behind the Scenes

  1. **Connection Check** — Application attempts to connect to Supabase
  2. **Timeout Detection** — If no response within 5 seconds, triggers fallback
  3. **Content Switch** — Seamlessly loads locally-stored markdown files
  4. **User Unaware** — Content displays normally, user experiences no interruption
  5. **Logging** — Issue is logged for our monitoring dashboard

  ***

  ## When Does the Fallback Activate?

  The fallback blog system automatically activates during:


  | Scenario | Duration | Impact |
  | :-- | :-- | :-- |
  | **Database Maintenance** | 5-30 minutes | Scheduled, planned downtime |
  | **Network Connectivity Issues** | Minutes to hours | Temporary network disruptions |
  | **Supabase Service Outage** | 15 minutes - 2 hours | Rare, usually quick resolution |
  | **API Rate Limiting** | Seconds to minutes | High traffic surge handling |
  | **Regional Server Issues** | 5-60 minutes | Cloud provider incidents |
  | **Development/Testing** | Varies | When we're testing new features |


  ***

  ## What You See as a User

  ### When Supabase is Online ✅

  - **Full Dynamic Features** — Latest blog posts instantly
  - **Comments \& Interactions** — Real-time feedback visible
  - **Admin Features** — Blog management available
  - **Analytics** — View counts, engagement metrics
  - **Email Notifications** — Contact form submissions trigger emails immediately


  ### When Supabase is Offline (Fallback Active) ⚙️

  - **Static Blog Content** — Pre-built posts still visible
  - **Readable, Full Experience** — Content quality unchanged
  - **No Comments/Interactions** — Since these require database
  - **No Admin Panel** — Can't add/edit posts temporarily
  - **No Email Alerts** — Submissions cached locally, processed later
  - **Visual Indicator** — Subtle "Offline Mode" badge (optional)

  ***

  ### Performance Benefits

  - **Instant Load Time** — Static markdown loads in <100ms
  - **No Network Dependency** — Works even without internet briefly
  - **Reduced Server Load** — Local files don't hit Supabase
  - **Better SEO** — Static content helps search engines index
  - **Improved Resilience** — Multiple failure points handled

  ***

  ## What We're Working On

  We're actively working to ensure maximum uptime and reliability:

  ### Current Monitoring

  ✅ **24/7 Uptime Monitoring** — Real-time alerts for any issues
  ✅ **Automated Health Checks** — Every 5 minutes
  ✅ **Fallback System Testing** — Weekly validation
  ✅ **Performance Metrics** — Track response times

  ### Ongoing Improvements

  🔧 **Connection Pooling** — Reduce database connection overhead
  🔧 **Caching Strategy** — Implement Redis caching layer
  🔧 **Regional Redundancy** — Multiple Supabase regions for failover
  🔧 **Advanced Monitoring** — Custom alerting dashboard
  🔧 **Load Balancing** — Distribute traffic during peaks

  ### Coming Soon

  🚀 **Multi-Region Replication** — Blog content across global servers
  🚀 **Advanced Offline Support** — Service Worker integration
  🚀 **Predictive Scaling** — ML-based auto-scaling
  🚀 **Enhanced Fallback UI** — Improved offline mode indicators

  ***

  ## Communication During Issues

  When maintenance or issues occur, we'll keep you informed:

  **Real-Time Updates** — Check our [Status Page](https://status.suhasmartha.com) for live updates
  **Twitter/X** — [@SuhasMarthadev](https://twitter.com/suhasmartha) for announcements
  **Email Notifications** — Subscribe to our newsletter for incident reports
  **Contact Form** — Report issues directly (cached during outages, processed when online)

  ***

  ## Why This Matters for Web Development

  This fallback system demonstrates several important web development principles:

  ### 1. **Graceful Degradation**

  Providing reduced but functional experience instead of complete failure.

  ### 2. **Defensive Programming**

  Assuming external services will fail and building accordingly.

  ### 3. **User-Centric Design**

  Prioritizing user experience over technical perfection.

  ### 4. **Redundancy**

  Having multiple paths to deliver core functionality.

  ### 5. **Transparency**

  Communicating with users about system status honestly.

  ***

  ## Conclusion

  Our fallback blog system exemplifies **resilient architecture**—designing systems that work even when things go wrong. Rather than hoping our database never fails, we've built intelligence into the system to handle failures gracefully.

  The next time you see this system in action during maintenance:

  - You'll understand why it's there
  - You'll appreciate the engineering behind it
  - You'll know we're working to get everything back online

  **Thank you for your patience and understanding as we maintain and improve your experience.**

  ***

  ## FAQ

  **Q: Why does my blog look different sometimes?**
  A: During database maintenance, the static fallback loads. Content is identical, but some interactive features temporarily unavailable.

  **Q: Will I lose my contact form submission?**
  A: No! Submissions are cached locally and processed when the system comes back online.

  **Q: How often does this happen?**
  A: Very rarely. We perform maintenance typically at 2-4 AM IST on Sundays to minimize impact.

  **Q: Can I see the fallback blog on purpose?**
  A: Yes, developers can test it by adding ?offline=true to the blog URL (local development only).

  **Q: What if the issue takes longer to fix?**
  A: We'll post updates to our status page, social media, and send email notifications.
`
  },
  {
    id: 2,
    title: "Building a Modern Portfolio Website: A Complete Tech Stack and Development Journey",
    slug: "Modern-Portfolio-Website",
    date: "2025-08-12",
    tags: ["Portfolio","GitHub","Web Dev","Blogging","Project"],
    author: "Suhas Martha",
    readTime: "6 min read",
    image: "https://i.postimg.cc/sgrJqRS8/Screenshot-2025-08-30-161941.png",
    excerpt: "Creating a standout developer portfolio is essential for showcasing your skills, projects, and professional journey. In this blog post, we dive into the development of **suhasmartha.github.io**, a modern, responsive portfolio website built with React, Vite, Tailwind CSS, and powered by Supabase for backend services. You’ll learn about the tech stack, architecture, feature implementations, deployment workflow, and how Supabase elevates the site with dynamic content and data handling.",
    featured: false,
    content: `
  ## Project Overview

  **suhasmartha.github.io** is a single-page application portfolio that highlights:

  - Personal bio and skills
  - Education, experience, and fun facts
  - Project showcases (full-stack and frontend)
  - Technical blog with MDX-powered posts
  - Interactive games section
  - Contact form with real-time backend storage

  The goal was to create a performant, accessible, and visually engaging site that reflects a developers capabilities and personality.

  ***

  ## Tech Stack

  | Layer | Technology | Role |
  | :-- | :-- | :-- |
  | UI Framework | React 19 | Component-driven interface |
  | Bundler \& Dev Server | Vite | Fast HMR, optimized builds |
  | Styling | Tailwind CSS 3.x | Utility-first design, dark/light mode support |
  | Routing | React Router v7 | Hash-based SPA navigation |
  | Backend as a Service | Supabase | Database, Auth, Functions, real-time services |
  | Hosting | GitHub Pages | Free, global CDN |


  ***

  ## Frontend Features \& UX

  ### Responsive \& Accessible Design

  - Mobile-first layouts with Tailwind breakpoints
  - Dark/light theme toggle using CSS variables
  - Semantic HTML and ARIA roles for screen readers


  ### Advanced Animations

  - **Framer Motion** for page transitions and hover effects
  - **GSAP** timelines for scroll-triggered and complex animations


  ### Interactive Sections

  - **Projects**: Animated cards, filterable by category
  - **Blog**: MDX-powered posts with dynamic routing
  - **Games**: In-browser classics like Tic-Tac-Toe, Snake, Tetris, and more
  - **Contact**: Animated form with real-time feedback

  ***

  ## Supabase Backend Integration

  By adopting Supabase, the portfolio gains robust backend capabilities without managing servers.

  1. **Contact Form Handling**
      - Submissions are validated client-side and inserted into a Supabase table.
      - Real-time storage of inquiries triggers email notifications via Supabase Functions.
  2. **Blog Content Management**
      - Posts are authored in Markdown with frontmatter metadata stored in Supabase.
      - At build time, Vite fetches post data via Supabase's REST API for dynamic previews.
  3. **Authentication \& Admin Interface**
      - **Supabase Auth** secures an admin dashboard for drafting and publishing posts.
      - Role-based policies restrict write access to authenticated users.
  4. **Analytics \& Usage Tracking**
      - Page views, form submissions, and event logs stream into Supabase for real-time dashboards.
      - Custom analytics interface displays unique visitors, popular posts, and conversion metrics.

  ***

  ## Future Enhancements

  - **Progressive Web App (PWA)** capabilities for offline access.
  - **Comment system** for blog posts.
  - **Video tutorials** and embedded demos.
  - **Multi-language support** for global reach.
  - **Custom domain** with enhanced branding.

  ***

  ## Conclusion

  Building **suhasmartha.github.io** demonstrates how modern web tools and backend services can coalesce into a fast, interactive, and maintainable portfolio site. By leveraging React, Vite, Tailwind CSS, and Supabase, developers can create rich digital resumes that not only showcase projects but also handle dynamic content, authentication, and real-time interactions, all with minimal infrastructure overhead.

  Ready to build your own? Explore the full [GitHub repository](https://github.com/SuhasMartha/suhasmartha.github.io), fork it, and start customizing a portfolio that highlights your unique story and skills.
`
  }
];

// Try to import markdown files dynamically
let postModules = {};
try {
  postModules = import.meta.glob('../data/posts/*.md?raw', {
    eager: true
  });
} catch (error) {
  console.warn('Could not load markdown files:', error);
}

export const getMarkdownPosts = () => {
  // First try to get posts from Supabase
  return getSupabasePosts();
};

// Get posts from Supabase
export const getSupabasePosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.created_at ? post.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      publish_date: post.publish_date,
      read_time: post.read_time || '5 min read',
      readTime: post.read_time || '5 min read', // Add both for compatibility
      author: post.author,
      author_profession: post.author_profession,
      tags: post.tags || [],
      featured: post.featured,
      comments_enabled: post.comments_enabled,
      image: post.image,
      content: post.content,
    }));
  } catch (error) {
    console.error('Error fetching posts from Supabase:', error);
    return getStaticPosts();
  }
};

// Fallback to static posts
export const getStaticPosts = () => {
  const posts = [];

  // Try to process markdown files first
  if (Object.keys(postModules).length > 0) {
    Object.entries(postModules).forEach(([path, content]) => {
      try {
        // Parse frontmatter & content
        const { data: frontmatter, content: markdownContent } = matter(content);

        // Extract filename for slug
        const filename = path.split('/').pop().replace('.md', '');

        const post = {
          id: posts.length + 1,
          title: frontmatter.title || 'Untitled',
          slug: frontmatter.slug || filename,
          excerpt: frontmatter.excerpt || '',
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          readTime: frontmatter.readTime || '5 min read',
          author: frontmatter.author || 'Suhas Martha',
          tags: frontmatter.tags || [],
          featured: frontmatter.featured || false,
          image: frontmatter.image || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          content: markdownContent,
          frontmatter
        };

        posts.push(post);
      } catch (error) {
        console.error(`Error processing ${path}:`, error.message);
      }
    });
  }

  // If no markdown files were processed, use static posts as fallback
  if (posts.length === 0) {
    console.log('Using static posts as fallback');
    posts.push(...staticPosts);
  }

  // Sort newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get single post
export const getPostBySlug = (slug) => {
  return getSupabasePostBySlug(slug);
};

// Get single post from Supabase
export const getSupabasePostBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;

    console.log('Post loaded from Supabase:', { slug, hasContent: !!data.content, contentLength: data.content?.length });

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      date: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      publish_date: data.publish_date,
      read_time: data.read_time || '5 min read',
      readTime: data.read_time || '5 min read', // Add both for compatibility
      author: data.author,
      author_profession: data.author_profession,
      tags: data.tags || [],
      featured: data.featured,
      comments_enabled: data.comments_enabled,
      image: data.image,
      content: data.content || '', // Content from database
    };
  } catch (error) {
    console.error('Error fetching post from Supabase:', error);
    // Fallback to static posts
    const posts = getStaticPosts();
    const fallbackPost = posts.find(post => post.slug === slug);
    console.log('Using fallback post:', fallbackPost ? fallbackPost.slug : 'not found');
    return fallbackPost;
  }
};

// Featured posts
export const getFeaturedPosts = () => {
  return getSupabaseFeaturedPosts();
};

// Get featured posts from Supabase
export const getSupabaseFeaturedPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.created_at ? post.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      publish_date: post.publish_date,
      read_time: post.read_time || '5 min read',
      readTime: post.read_time || '5 min read', // Add both for compatibility
      author: post.author,
      author_profession: post.author_profession,
      tags: post.tags || [],
      featured: post.featured,
      comments_enabled: post.comments_enabled,
      image: post.image,
      content: post.content,
    }));
  } catch (error) {
    console.error('Error fetching featured posts from Supabase:', error);
    const posts = getStaticPosts();
    return posts.filter(post => post.featured);
  }
};

// Recent posts
export const getRecentPosts = (limit = 5) => {
  return getSupabaseRecentPosts(limit);
};

// Get recent posts from Supabase
export const getSupabaseRecentPosts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.created_at ? post.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      publish_date: post.publish_date,
      read_time: post.read_time || '5 min read',
      readTime: post.read_time || '5 min read', // Add both for compatibility
      author: post.author,
      author_profession: post.author_profession,
      tags: post.tags || [],
      featured: post.featured,
      comments_enabled: post.comments_enabled,
      image: post.image,
      content: post.content,
    }));
  } catch (error) {
    console.error('Error fetching recent posts from Supabase:', error);
    const posts = getStaticPosts();
    return posts.slice(0, limit);
  }
};
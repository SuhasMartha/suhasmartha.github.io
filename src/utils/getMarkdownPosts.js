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
    title: "Building a Modern Blog: The Tech Stack Behind This Site",
    slug: "building-modern-blog-tech-stack",
    date: "2025-01-07",
    tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP", "Web Development"],
    author: "Suhas Martha",
    readTime: "8 min read",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "A deep dive into the technologies and techniques used to create this modern, responsive blog using React, Tailwind CSS, Framer Motion, and GSAP.",
    featured: true,
    content: `# Building a Modern Blog: The Tech Stack Behind This Site

Welcome to my blog! Today, I want to share the journey of building this very website you're reading on. As a developer, I believe in using modern tools and techniques to create engaging, performant, and beautiful web experiences.

## 🚀 The Foundation: React & Vite

At the core of this blog lies **React 19**, the latest version of Facebook's popular JavaScript library. React provides the component-based architecture that makes this site maintainable and scalable.

### Why React 19?

- **Improved Performance**: Better rendering optimizations
- **Enhanced Developer Experience**: Better error boundaries and debugging
- **Modern Hooks**: Latest React features for state management
- **Future-Ready**: Built for the modern web

I chose **Vite** as the build tool because of its lightning-fast development server and optimized production builds.

\`\`\`javascript
// Example of a React component used in this blog
const BlogPost = ({ title, content, date }) => {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <header>
        <h1>{title}</h1>
        <time>{date}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};
\`\`\`

## 🎨 Styling with Tailwind CSS 4

The visual appeal of this blog comes from **Tailwind CSS 4**, the latest version of the utility-first CSS framework.

### Key Features:
- **Custom Color Palette**: Carefully chosen colors that work in both light and dark modes
- **Responsive Design**: Mobile-first approach ensuring great experience on all devices
- **Dark Mode Support**: Seamless theme switching with the interactive light bulb
- **Custom Utilities**: Extended Tailwind with project-specific utility classes

## ✨ Animations with Framer Motion

To bring life to the interface, I integrated **Framer Motion** for smooth transitions and engaging animations.

### Animation Features:
- **Page Transitions**: Smooth entry animations for all components
- **Scroll Animations**: Elements animate as they come into view
- **Hover Effects**: Interactive feedback on cards and buttons
- **Stagger Animations**: Sequential animations for lists and grids

## 🎭 Advanced Interactions with GSAP

For complex animations like the interactive light bulb theme toggle, I used **GSAP** (GreenSock Animation Platform).

### GSAP Powers:
- **SVG Morphing**: The light bulb cord animation
- **Draggable Interactions**: Pull the cord to toggle themes
- **Timeline Control**: Precise animation sequencing
- **Performance**: Hardware-accelerated animations

## 🌓 Theme System

The interactive light bulb isn't just decorative—it's a fully functional theme toggle that demonstrates advanced animation techniques!

### Theme Features:
- **System Preference Detection**: Respects user's OS theme preference
- **Local Storage**: Remembers your theme choice
- **Smooth Transitions**: CSS custom properties for seamless switching
- **Interactive Animation**: Pull the cord or click to toggle

## 📱 Responsive Design

Built with a mobile-first approach, this blog looks great on all devices:

- **Flexible Grid System**: CSS Grid and Flexbox for complex layouts
- **Responsive Typography**: Fluid text scaling across screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## 🔒 Security & Performance

Security and performance are built into the foundation:

### Security Features:
- **Content Security Policy**: Protection against XSS attacks
- **Secure Headers**: HTTPS enforcement and security headers
- **Input Sanitization**: Safe handling of user content
- **Production Hardening**: Security measures for production deployment

### Performance Optimizations:
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Optimized bundle sizes
- **Caching Strategy**: Efficient browser caching

## 🎯 SEO Optimization

Every blog post is optimized for search engines:

- **Meta Tags**: Dynamic title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Schema markup for rich snippets
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🛠 Development Experience

The development setup prioritizes developer experience:

- **Hot Module Replacement**: Instant updates during development
- **TypeScript Support**: Type safety and better IDE support
- **ESLint & Prettier**: Code quality and consistent formatting
- **Git Hooks**: Pre-commit checks for code quality

## 🚀 Deployment & CI/CD

Modern deployment pipeline:

- **GitHub Actions**: Automated testing and deployment
- **Netlify**: Fast global CDN and edge functions
- **Environment Variables**: Secure configuration management
- **Performance Monitoring**: Real-time performance insights

---

*Thanks for reading! This blog post itself demonstrates many of the features discussed. Stay tuned for more posts about web development, React patterns, and modern CSS techniques.*`
  },
  {
    id: 2,
    title: "Creating a Blog: From Idea to Launch",
    slug: "creating-a-blog-2025-guide",
    date: "2025-08-12",
    tags: ["Blogging", "Web Development", "WordPress", "Wix", "Tech Stack"],
    author: "Suhas Martha",
    readTime: "9 min read",
    image: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "A practical guide to creating your own blog in 2025, including choosing the right platform, building your tech stack, creating engaging content, and launching to the world.",
    featured: false,
    content: `# Creating a Blog: From Idea to Launch

Welcome! In this post, I'll walk you through the journey of **creating a blog** in 2025. Whether you're a hobbyist writer, a business owner, or just curious about digital publishing, you'll learn the modern steps and technologies needed to launch a blog that gets noticed.

## 🚀 Step 1: Choosing Your Platform

The first decision is picking the **blogging platform** that fits your needs. There are two main categories:

- **Hosted platforms**: WordPress.com, Medium, Wix, Blogger. Great for beginners.
- **Self-hosted platforms**: WordPress.org, Jekyll, Ghost, Next.js with MDX. Ideal for developers who want full control.

**Popular options in 2025:**
- **WordPress**: Highly customizable, thousands of plugins, strong SEO.
- **Wix**: Beginner-friendly interface, built-in AI tools, excellent for monetization and design flexibility.
- **Medium**: Minimalist, easy-to-use, built-in audience.
- **Jekyll**: Static-site generator for those comfortable with Markdown and Git.

## 🏗 Step 2: Planning Your Tech Stack

Your **tech stack** determines your blog's speed, security, and future growth.

- **Frontend**: React, Next.js, Gatsby, or vanilla HTML/CSS/JS.
- **Backend**: Node.js, Express.js, PHP (for WordPress), or serverless (Netlify, Vercel).
- **Styling**: Tailwind CSS, Sass, or Bootstrap.
- **Animations**: Framer Motion, GSAP.
- **Content Format**: Markdown, MDX (Markdown + JSX for React), or WYSIWYG editors.

## 🎨 Step 3: Design and User Experience

Great blogs prioritize user experience:

- **Clean Layout**: Readable typography, proper spacing
- **Mobile-First**: Responsive design for all devices
- **Fast Loading**: Optimized images and minimal JavaScript
- **Navigation**: Clear menu structure and search functionality

## 📝 Step 4: Content Strategy

Content is king, but strategy is queen:

- **Define Your Niche**: What unique perspective do you offer?
- **Content Calendar**: Plan posts in advance
- **SEO Optimization**: Research keywords and optimize meta tags
- **Engagement**: Encourage comments and social sharing

## 🚀 Step 5: Launch and Promotion

Getting your blog noticed:

- **Social Media**: Share on relevant platforms
- **Email Newsletter**: Build a subscriber list
- **Guest Posting**: Write for other blogs in your niche
- **Analytics**: Track performance and optimize

---

*Ready to start your blogging journey? The tools and techniques are more accessible than ever in 2025!*`
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
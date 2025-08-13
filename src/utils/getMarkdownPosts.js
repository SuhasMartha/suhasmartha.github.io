import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Import all markdown files from src/data/posts folder
// Use relative path from THIS file (src/utils/getMarkdownPosts.js)
const postModules = import.meta.glob('../data/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

export const getMarkdownPosts = () => {
  const posts = [];

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

  // Sort newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get single post
export const getPostBySlug = (slug) => {
  const posts = getMarkdownPosts();
  return posts.find(post => post.slug === slug);
};

// Featured posts
export const getFeaturedPosts = () => {
  const posts = getMarkdownPosts();
  return posts.filter(post => post.featured);
};

// Recent posts
export const getRecentPosts = (limit = 5) => {
  const posts = getMarkdownPosts();
  return posts.slice(0, limit);
};

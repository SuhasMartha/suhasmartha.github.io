import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { supabase } from "../../lib/supabase";

const BlogEditor = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    author: 'Suhas Martha',
    author_profession: 'Full Stack Developer',
    read_time: '5 min read',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
    published: false,
    publish_date: new Date().toISOString().split('T')[0],
    comments_enabled: true
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [isPreviewMode, setIsPreviewMode] = useState(false);


  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        tags: post.tags || [],
        author: post.author || 'Suhas Martha',
        author_profession: post.author_profession || 'Full Stack Developer',
        read_time: post.read_time || '5 min read',
        image: post.image || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
        featured: post.featured || false,
        published: post.published || false,
        publish_date: post.publish_date ? post.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
        comments_enabled: post.comments_enabled !== undefined ? post.comments_enabled : true
      });
    }
  }, [post]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      let result;
      if (post && post.id) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert([postData]);
      }

      if (result.error) throw result.error;

      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
          >
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
          >
            Cancel
          </motion.button>
        </div>
      </div>

      {/* Preview Mode */}
      {isPreviewMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <div className="max-w-4xl mx-auto">
            {/* Preview Header */}
            <div className="mb-8">
              {formData.image && (
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                  {formData.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-semibold rounded-full bg-lhilit-1/10 text-lhilit-1 dark:bg-dhilit-1/10 dark:text-dhilit-1 border border-lhilit-1/20 dark:border-dhilit-1/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 bg-clip-text text-transparent">
                {formData.title || 'Untitled Post'}
              </h1>

              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 flex items-center justify-center text-white font-semibold">
                    {formData.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formData.author}</p>
                    <p className="text-sm">{formData.author_profession}</p>
                  </div>
                </div>
                <span>•</span>
                <time className="font-medium">{formatDate(formData.publish_date)}</time>
                <span>•</span>
                <span className="font-medium">{formData.read_time}</span>
              </div>

              {formData.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {formData.excerpt}
                </p>
              )}
            </div>

            {/* Preview Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-lhilit-1 dark:prose-code:text-dhilit-1 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-a:text-lhilit-1 dark:prose-a:text-dhilit-1 prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkFootnotes]}
                rehypePlugins={[rehypeHighlight]}
                skipHtml={false}
                components={{
                  h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-6 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-gray-100">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">{children}</h5>,
                  h6: ({ children }) => <h6 className="text-base font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h6>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-lhilit-1 dark:border-dhilit-1 pl-4 py-2 my-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ inline, children }) =>
                    inline ?
                      <code className="text-lhilit-1 dark:text-dhilit-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code> :
                      <code className="text-gray-100">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-200 dark:border-gray-700">{children}</pre>,
                  ul: ({ children }) => <ul className="mb-4 space-y-2 pl-6 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 space-y-2 pl-6 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  strong: ({ children }) => <strong className="text-gray-900 dark:text-gray-100 font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                  del: ({ children }) => <del className="line-through text-gray-500 dark:text-gray-400">{children}</del>,
                  hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,
                  br: () => <br />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-gray-300 dark:border-gray-600">
                      <table className="w-full border-collapse bg-white dark:bg-gray-800">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                      {children}
                    </td>
                  ),
                  img: ({ src, alt, ...props }) => (
                    <img
                      src={src}
                      alt={alt || 'Blog image'}
                      loading="lazy"
                      decoding="async"
                      className="max-w-full h-auto rounded-lg my-6 shadow-md hover:shadow-lg transition-shadow"
                      onError={(e) => {
                        console.error('Image failed to load:', src);
                        e.target.style.display = 'none';
                      }}
                      {...props}
                    />
                  ),
                  html: ({ value }) => {
                    if (value.includes('<img')) {
                      const srcMatch = value.match(/src=["']([^"']+)["']/);
                      const altMatch = value.match(/alt=["']([^"']+)["']/);
                      const src = srcMatch?.[1];
                      const alt = altMatch?.[1] || 'Blog image';

                      if (src) {
                        return (
                          <img
                            src={src}
                            alt={alt}
                            loading="lazy"
                            decoding="async"
                            className="max-w-full h-auto rounded-lg my-6 shadow-md hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              console.error('Image failed to load:', src);
                              e.target.style.display = 'none';
                            }}
                          />
                        );
                      }
                    }
                    return <div dangerouslySetInnerHTML={{ __html: value }} className="my-4" />;
                  },
                  sup: ({ children }) => <sup className="text-lhilit-1 dark:text-dhilit-1 font-medium">{children}</sup>,
                  a: ({ href, children, ...props }) => {
                    if (href?.startsWith('#')) {
                      return (
                        <a
                          href={href}
                          className="text-lhilit-1 dark:text-dhilit-1 hover:underline font-medium"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lhilit-1 dark:text-dhilit-1 hover:underline font-medium"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  section: ({ children, ...props }) => {
                    if (props.className?.includes('footnotes')) {
                      return (
                        <section {...props} className="mt-12 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            {children}
                          </div>
                        </section>
                      );
                    }
                    return <section {...props}>{children}</section>;
                  },
                }}
              >
                {formData.content || '*No content yet...*'}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="post-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Content Editor with Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content * (Markdown Supported)
              </label>
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'write'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'preview'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="20"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300 font-mono text-sm"
                placeholder="Write your post content in Markdown format..."
              />
            ) : (
              <div className="min-h-[500px] p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-lhilit-1 dark:prose-code:text-dhilit-1 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-a:text-lhilit-1 dark:prose-a:text-dhilit-1 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkFootnotes]}
                  rehypePlugins={[rehypeHighlight]}
                  skipHtml={false}
                  components={{
                    h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-6 first:mt-0 text-gray-900 dark:text-gray-100">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-gray-100">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-gray-100">{children}</h4>,
                    h5: ({ children }) => <h5 className="text-lg font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">{children}</h5>,
                    h6: ({ children }) => <h6 className="text-base font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h6>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-lhilit-1 dark:border-dhilit-1 pl-4 py-2 my-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    code: ({ inline, children }) =>
                      inline ?
                        <code className="text-lhilit-1 dark:text-dhilit-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code> :
                        <code className="text-gray-100">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-200 dark:border-gray-700">{children}</pre>,
                    ul: ({ children }) => <ul className="mb-4 space-y-2 pl-6 list-disc">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-4 space-y-2 pl-6 list-decimal">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                    strong: ({ children }) => <strong className="text-gray-900 dark:text-gray-100 font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                    del: ({ children }) => <del className="line-through text-gray-500 dark:text-gray-400">{children}</del>,
                    hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,
                    br: () => <br />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-gray-300 dark:border-gray-600">
                        <table className="w-full border-collapse bg-white dark:bg-gray-800">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                        {children}
                      </td>
                    ),
                    img: ({ src, alt, ...props }) => (
                      <img
                        src={src}
                        alt={alt || 'Blog image'}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full h-auto rounded-lg my-6 shadow-md hover:shadow-lg transition-shadow"
                        onError={(e) => {
                          console.error('Image failed to load:', src);
                          e.target.style.display = 'none';
                        }}
                        {...props}
                      />
                    ),
                    html: ({ value }) => {
                      if (value.includes('<img')) {
                        const srcMatch = value.match(/src=["']([^"']+)["']/);
                        const altMatch = value.match(/alt=["']([^"']+)["']/);
                        const src = srcMatch?.[1];
                        const alt = altMatch?.[1] || 'Blog image';

                        if (src) {
                          return (
                            <img
                              src={src}
                              alt={alt}
                              loading="lazy"
                              decoding="async"
                              className="max-w-full h-auto rounded-lg my-6 shadow-md hover:shadow-lg transition-shadow"
                              onError={(e) => {
                                console.error('Image failed to load:', src);
                                e.target.style.display = 'none';
                              }}
                            />
                          );
                        }
                      }
                      return <div dangerouslySetInnerHTML={{ __html: value }} className="my-4" />;
                    },
                    sup: ({ children }) => <sup className="text-lhilit-1 dark:text-dhilit-1 font-medium">{children}</sup>,
                    a: ({ href, children, ...props }) => {
                      if (href?.startsWith('#')) {
                        return (
                          <a
                            href={href}
                            className="text-lhilit-1 dark:text-dhilit-1 hover:underline font-medium"
                            {...props}
                          >
                            {children}
                          </a>
                        );
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lhilit-1 dark:text-dhilit-1 hover:underline font-medium"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                    section: ({ children, ...props }) => {
                      if (props.className?.includes('footnotes')) {
                        return (
                          <section {...props} className="mt-12 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                              {children}
                            </div>
                          </section>
                        );
                      }
                      return <section {...props}>{children}</section>;
                    },
                  }}
                >
                  {formData.content || '*No content yet...*'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="Add a tag and press Enter"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTag}
                type="button"
                className="px-4 py-2 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-lg hover:bg-lhilit-2 dark:hover:bg-dhilit-2 transition-colors duration-300"
              >
                Add
              </motion.button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-lhilit-1/10 text-lhilit-1 dark:bg-dhilit-1/10 dark:text-dhilit-1 border border-lhilit-1/20 dark:border-dhilit-1/20"
                  >
                    {tag}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-lhilit-1 dark:text-dhilit-1 hover:text-lhilit-2 dark:hover:text-dhilit-2"
                    >
                      ×
                    </motion.button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Author and Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="author_profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author Profession
              </label>
              <input
                type="text"
                id="author_profession"
                name="author_profession"
                value={formData.author_profession}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="Full Stack Developer"
              />
            </div>

            <div>
              <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Read Time
              </label>
              <input
                type="text"
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="5 min read"
              />
            </div>

            <div>
              <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                id="publish_date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>

            {/* Upload or URL Option */}
            <div className="space-y-3">
              {/* Upload Button */}


              {/* URL Input */}
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
                />
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="flex flex-wrap gap-6">
            <div
              className="flex items-center cursor-pointer select-none"
              onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-lhilit-1 border-lhilit-1 dark:bg-dhilit-1 dark:border-dhilit-1' : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                {formData.featured && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Post
              </span>
            </div>

            <div
              className="flex items-center cursor-pointer select-none"
              onClick={() => setFormData(p => ({ ...p, comments_enabled: !p.comments_enabled }))}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.comments_enabled ? 'bg-lhilit-1 border-lhilit-1 dark:bg-dhilit-1 dark:border-dhilit-1' : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                {formData.comments_enabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Comments
              </span>
            </div>

            <div
              className="flex items-center cursor-pointer select-none"
              onClick={() => setFormData(p => ({ ...p, published: !p.published }))}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.published ? 'bg-lhilit-1 border-lhilit-1 dark:bg-dhilit-1 dark:border-dhilit-1' : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}>
                {formData.published && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Publish Post
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-900/20 dark:border-red-800"
            >
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </span>
              </div>
            </motion.div>
          )}

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </motion.div>
              ) : (
                post ? 'Update Post' : 'Create Post'
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default BlogEditor;
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be smaller than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Create unique filename
      const timestamp = Date.now();
      const filename = `blog-images/${timestamp}-${file.name.replace(/\s+/g, '-')}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      // Update form with image URL
      setFormData(prev => ({
        ...prev,
        image: urlData.publicUrl
      }));

      setUploadProgress(0);
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
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
      if (post) {
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
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
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
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'write'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'preview'
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
              <div className="min-h-[500px] p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkFootnotes]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {formData.content || '*No content yet...*'}
                  </ReactMarkdown>
                </div>
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
              <div className="flex items-center gap-3">
                <label className="flex-1 relative cursor-pointer">
                  <div className="px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-lhilit-1 dark:hover:border-dhilit-1 transition-colors text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {uploadingImage ? 'Uploading...' : '📁 Click to upload image'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Progress bar */}
              {uploadingImage && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-lhilit-1 dark:bg-dhilit-1 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-3 text-xs text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

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
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-lhilit-1 dark:text-dhilit-1 bg-gray-100 border-gray-300 rounded focus:ring-lhilit-1 dark:focus:ring-dhilit-1 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Post
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="comments_enabled"
                checked={formData.comments_enabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-lhilit-1 dark:text-dhilit-1 bg-gray-100 border-gray-300 rounded focus:ring-lhilit-1 dark:focus:ring-dhilit-1 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Comments
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 text-lhilit-1 dark:text-dhilit-1 bg-gray-100 border-gray-300 rounded focus:ring-lhilit-1 dark:focus:ring-dhilit-1 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Publish Post
              </span>
            </label>
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
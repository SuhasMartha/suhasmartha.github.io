import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AuthorProfile = ({ posts }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorStats, setAuthorStats] = useState({});

  useEffect(() => {
    calculateAuthorStats();
  }, [posts]);

  const calculateAuthorStats = () => {
    const stats = {};
    
    posts.forEach(post => {
      const author = post.author || 'Unknown';
      if (!stats[author]) {
        stats[author] = {
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          featuredPosts: 0,
          posts: [],
          firstPost: null,
          lastPost: null
        };
      }
      
      stats[author].totalPosts++;
      stats[author].posts.push(post);
      
      if (post.published) {
        stats[author].publishedPosts++;
      } else {
        stats[author].draftPosts++;
      }
      
      if (post.featured) {
        stats[author].featuredPosts++;
      }
      
      // Track first and last posts
      const postDate = new Date(post.created_at);
      if (!stats[author].firstPost || postDate < new Date(stats[author].firstPost.created_at)) {
        stats[author].firstPost = post;
      }
      if (!stats[author].lastPost || postDate > new Date(stats[author].lastPost.created_at)) {
        stats[author].lastPost = post;
      }
    });
    
    setAuthorStats(stats);
    
    // Set default selected author to the one with most posts
    const topAuthor = Object.keys(stats).reduce((a, b) => 
      stats[a].totalPosts > stats[b].totalPosts ? a : b
    );
    if (topAuthor && !selectedAuthor) {
      setSelectedAuthor(topAuthor);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600', 
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const authors = Object.keys(authorStats);
  const currentAuthorStats = selectedAuthor ? authorStats[selectedAuthor] : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Author Profiles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view author statistics and contributions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Authors List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Authors ({authors.length})
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {authors.map((author, index) => (
                <motion.button
                  key={author}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedAuthor(author)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    selectedAuthor === author
                      ? "bg-lhilit-1/10 dark:bg-dhilit-1/10 border-2 border-lhilit-1 dark:border-dhilit-1"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(author)} flex items-center justify-center text-white font-semibold shadow-lg`}>
                      {getInitials(author)}
                    </div>
                    
                    {/* Author info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {author}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{authorStats[author].totalPosts} posts</span>
                        <span>•</span>
                        <span>{authorStats[author].publishedPosts} published</span>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <svg className={`h-5 w-5 transition-transform duration-300 ${
                      selectedAuthor === author ? "text-lhilit-1 dark:text-dhilit-1 rotate-90" : "text-gray-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Author Details */}
        <div className="lg:col-span-2">
          {currentAuthorStats ? (
            <motion.div
              key={selectedAuthor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Author Header */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-8">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(selectedAuthor)} flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                      {getInitials(selectedAuthor)}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedAuthor}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Content Author & Contributor
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            Joined {currentAuthorStats.firstPost ? formatDate(currentAuthorStats.firstPost.created_at) : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Last active {currentAuthorStats.lastPost ? formatDate(currentAuthorStats.lastPost.created_at) : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {currentAuthorStats.totalPosts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {currentAuthorStats.publishedPosts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {currentAuthorStats.draftPosts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currentAuthorStats.featuredPosts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author's Posts */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Posts by {selectedAuthor}
                  </h4>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {currentAuthorStats.posts
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {post.title}
                            </h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{formatDate(post.created_at)}</span>
                              <span>•</span>
                              <span>{post.read_time}</span>
                              {post.tags && post.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{post.tags.length} tags</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {post.featured && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                Featured
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              post.published 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Select an Author
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose an author from the list to view their profile and posts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
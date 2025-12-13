import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

const CommentModeration = ({ comments, onApprove, onReject, onToggleApproval, onBulkApprove }) => {
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved

  const handleApproveComment = async (commentId) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .eq('id', commentId);

      if (error) throw error;
      onApprove(commentId);
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Failed to approve comment');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      onReject(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (commentId, currentStatus) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: !currentStatus })
        .eq('id', commentId);

      if (error) throw error;
      onToggleApproval(commentId);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    const pendingComments = comments.filter(comment => !comment.approved);
    if (pendingComments.length === 0) {
      alert('No pending comments to approve');
      return;
    }

    setBulkLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .in('id', pendingComments.map(c => c.id));
      
      if (error) throw error;
      onBulkApprove();
    } catch (error) {
      console.error('Error bulk approving comments:', error);
      alert('Error bulk approving comments: ' + error.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
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
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredComments = comments.filter(comment => {
    if (filter === "pending") return !comment.approved;
    if (filter === "approved") return comment.approved;
    return true;
  });

  const pendingCount = comments.filter(c => !c.approved).length;
  const approvedCount = comments.filter(c => c.approved).length;

  return (
    <div>
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Comment Moderation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and moderate blog comments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkApprove}
              disabled={bulkLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Approving...</span>
                </div>
              ) : (
                `Approve All Pending (${pendingCount})`
              )}
            </motion.button>
          )}
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              filter === "all"
                ? "bg-lhilit-1 dark:bg-dhilit-1 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
              filter === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* Comments list */}
      {filteredComments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No {filter === "all" ? "" : filter} comments
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === "pending" 
              ? "All comments have been moderated."
              : filter === "approved"
              ? "No approved comments yet."
              : "No comments have been submitted yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border p-6 ${
                comment.approved 
                  ? "border-green-200 dark:border-green-800" 
                  : "border-yellow-200 dark:border-yellow-800"
              }`}
            >
              {/* Comment header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(comment.name)}`}>
                    {getInitials(comment.name)}
                  </div>
                  
                  {/* Comment info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {comment.name}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.email}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        comment.approved 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {comment.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(comment.created_at)}</span>
                      {comment.blog_posts && (
                        <>
                          <span>•</span>
                          <span>On: {comment.blog_posts.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center space-x-2">
                  {!comment.approved && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Needs Review
                    </span>
                  )}
                </div>
              </div>

              {/* Comment content */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comment.comment}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {!comment.approved ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApproveComment(comment.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectComment(comment.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </div>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleApproval(comment.id, comment.approved)}
                      disabled={loading}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                        Unapprove
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectComment(comment.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </div>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentModeration;
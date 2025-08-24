import React, { useState } from "react";
import { motion } from "framer-motion";

const ShareButtons = ({ post, onShare }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/blog/${post.slug}`;
  const shareTitle = post.title;
  const shareText = post.excerpt;

  const shareButtons = [
    {
      name: "Twitter",
      icon: "𝕏",
      color: "hover:bg-black hover:text-white",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "hover:bg-blue-600 hover:text-white",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "hover:bg-blue-500 hover:text-white",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: "Reddit",
      icon: "🔴",
      color: "hover:bg-orange-500 hover:text-white",
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`
    },
    {
      name: "WhatsApp",
      icon: "💬",
      color: "hover:bg-green-500 hover:text-white",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
    }
  ];

  const handleShare = async (platform, url) => {
    if (platform === "Copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onShare("copy");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      window.open(url, '_blank', 'width=600,height=400');
      onShare(platform.toLowerCase());
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onShare("native");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
        {shareButtons.map((button, index) => (
          <motion.button
            key={button.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare(button.name, button.url)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 ${button.color}`}
            title={`Share on ${button.name}`}
          >
            <span className="text-lg">{button.icon}</span>
          </motion.button>
        ))}

        {/* Copy Link Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: shareButtons.length * 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare("Copy")}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            copied
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
          title="Copy link"
        >
          {copied ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </motion.button>

        {/* Native Share Button (mobile) */}
        {navigator.share && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (shareButtons.length + 1) * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNativeShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:bg-lhilit-1 hover:text-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-dhilit-1"
            title="Share"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </motion.button>
        )}
      </div>
  );
};

export default ShareButtons;
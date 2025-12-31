import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import Navbar from "../Navbar";
import Footer from "../components/Footer";

const Games = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Game data
  const games = [
    {
      id: 1,
      title: "Tic Tac Toe",
      category: "Strategy",
      status: "available",
      icon: "⭕",
      color: "from-blue-400 to-blue-600",
      gameUrl: "https://suhasmartha.github.io/games/tic-tac-toe.html"
    },
    {
      id: 2,
      title: "Snake Game",
      category: "Arcade",
      status: "available",
      icon: "🐍",
      color: "from-green-400 to-green-600",
      gameUrl: "https://suhasmartha.github.io/games/snake.html"
    },
    {
      id: 3,
      title: "Ping Pong",
      category: "Sports",
      status: "coming-soon",
      icon: "🏓",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: 4,
      title: "Breakout",
      category: "Arcade",
      status: "coming-soon",
      icon: "🧱",
      color: "from-red-400 to-red-600"
    },
    {
      id: 5,
      title: "Tetris",
      category: "Puzzle",
      status: "coming-soon",
      icon: "🟦",
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 6,
      title: "Minesweeper",
      category: "Puzzle",
      status: "coming-soon",
      icon: "💣",
      color: "from-gray-400 to-gray-600"
    },
    {
      id: 7,
      title: "Chrome Dino",
      category: "Arcade",
      status: "comming-soon",
      icon: "🦕",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      id: 8,
      title: "Flappy Bird",
      category: "Arcade",
      status: "coming-soon",
      icon: "🐦",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      id: 9,
      title: "2048",
      category: "Puzzle",
      status: "coming-soon",
      icon: "🔢",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      id: 10,
      title: "Sudoku",
      category: "Puzzle",
      status: "coming-soon",
      icon: "🔢",
      color: "from-pink-400 to-pink-600"
    },
    {
      id: 11,
      title: "Typing Speed",
      category: "Educational",
      status: "coming-soon",
      icon: "⌨️",
      color: "from-teal-400 to-teal-600"
    },
    {
      id: 12,
      title: "Chess",
      category: "Strategy",
      status: "coming-soon",
      icon: "♟️",
      color: "from-amber-400 to-amber-600"
    }
  ];

  const categories = ["All", "Arcade", "Puzzle", "Strategy", "Sports", "Educational"];

  const filteredGames = selectedCategory === "All"
    ? games
    : games.filter(game => game.category === selectedCategory);

  // Handle feedback form input changes
  const handleFeedbackInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const { error } = await supabase
        .from('game_feedback')
        .insert([
          {
            name: feedbackData.name,
            email: feedbackData.email,
            message: feedbackData.message,
            status: 'new'
          }
        ]);

      if (!error) {
        setSubmitStatus('success');
        setFeedbackData({ name: '', email: '', message: '' });
      } else {
        console.error('Supabase error:', error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayGame = (game) => {
    if (game.status === "available" && game.gameUrl) {
      // If gameUrl is absolute (starts with http), open directly
      if (game.gameUrl.startsWith("http")) {
        window.open(game.gameUrl, "_blank");
      } else {
        // For local relative paths
        const baseUrl = import.meta.env.PROD
          ? 'https://suhasmartha.github.io'
          : '';
        const fullUrl = baseUrl + game.gameUrl;
        window.open(fullUrl, "_blank");
      }
    }
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-[-2] bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <Navbar />

      <div className="min-h-screen pt-20">
        <div className="mycontainer">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="head1 mb-6">
              <span className="texthilit1">Fun Zone</span>
            </h1>
            <h2 className="head2 text-gray-700 dark:text-gray-300 mb-4">
              Your portal to endless gaming adventures — from quick bursts of fun to epic high-score battles, play, compete, and smile every time.
            </h2>
          </motion.section>

          {/* Category Filter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category
                    ? "bg-lhilit-1 dark:bg-dhilit-1 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-lhilit-1/10 dark:hover:bg-dhilit-1/10 hover:text-lhilit-1 dark:hover:text-dhilit-1 hover:scale-105"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Games Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
                >
                  {/* Game Icon */}
                  <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {game.icon}
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-lhilit-1 dark:group-hover:text-dhilit-1 transition-colors duration-300">
                      {game.title}
                    </h3>

                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayGame(game)}
                      disabled={game.status === "coming-soon"}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${game.status === "available"
                        ? "bg-lhilit-1 dark:bg-dhilit-1 text-white hover:bg-lhilit-2 dark:hover:bg-dhilit-2 hover:shadow-lg transform hover:scale-105 cursor-pointer"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {game.status === "available" ? "Play Game" : "Coming Soon"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Game Ideas / Bug Report Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 mb-16"
          >
            <div className="bg-gradient-to-r from-lhilit-1/10 to-lhilit-2/10 dark:from-dhilit-1/10 dark:to-dhilit-2/10 rounded-2xl p-8 md:p-12 text-center border border-lhilit-1/20 dark:border-dhilit-1/20">
              <h3 className="head4 mb-4">Got a Game Idea or Found a Bug?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Share your cool new game ideas or report any bugs you've found so we can make the games even better!
              </p>
              <form
                onSubmit={handleFeedbackSubmit}
                className="flex flex-col gap-4 max-w-md mx-auto"
              >
                <input
                  type="text"
                  name="name"
                  value={feedbackData.name}
                  onChange={handleFeedbackInputChange}
                  placeholder="Name"
                  disabled={isSubmitting}
                  className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent disabled:opacity-50"
                />
                <input
                  type="email"
                  name="email"
                  value={feedbackData.email}
                  onChange={handleFeedbackInputChange}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                  className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent disabled:opacity-50"
                />
                <textarea
                  name="message"
                  value={feedbackData.message}
                  onChange={handleFeedbackInputChange}
                  placeholder="Describe your game idea or the bug you found..."
                  required
                  rows="4"
                  disabled={isSubmitting}
                  className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-lhilit-1 dark:bg-dhilit-1 text-white rounded-full font-semibold hover:bg-lhilit-2 dark:hover:bg-dhilit-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Thanks for your feedback! We'll review it soon.
                    </span>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-900/20 dark:border-red-800 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 dark:text-red-300 font-medium">
                      Failed to submit feedback. Please try again later.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>

          <hr />
          <div className="py-8"></div>
          <Footer />
          <div className="pb-12"></div>
        </div>
      </div>
    </>
  );
};

export default Games;

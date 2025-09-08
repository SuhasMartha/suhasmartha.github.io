import React, { useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

const RECAPTCHA_SITE_KEY = "6Lf_1MErAAAAAJnF2kZ9Dd_4wqH12GTT3LysZKFr";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!executeRecaptcha) {
      setError("reCAPTCHA not ready");
      setLoading(false);
      return;
    }

    try {
      const token = await executeRecaptcha("login");
      // Optionally send token to backend for verification

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setLoggedIn(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="head1 mb-4">
            Admin <span className="texthilit1">Login</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access the blog management dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-lhilit-1 dark:focus:ring-dhilit-1 focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

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

          {/* reCAPTCHA badge above submit button */}
          {!loggedIn && (
            <div className="flex flex-col items-center mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                This site is protected by reCAPTCHA
              </span>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center justify-center shadow">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="h-6 w-6 mr-2"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  reCAPTCHA v3
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-lhilit-1 to-lhilit-2 dark:from-dhilit-1 dark:to-dhilit-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-lhilit-2 to-lhilit-1 dark:from-dhilit-2 dark:to-dhilit-1 opacity-0 transition-opacity duration-300"
              whileHover={{ opacity: loading ? 0 : 1 }}
            />
            <div className="relative z-10">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </motion.div>
            ) : (
              'Sign In'
            )}
            </div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Secure admin access only
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AdminLogin = () => (
  <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
    <LoginForm />
  </GoogleReCaptchaProvider>
);

export default AdminLogin;
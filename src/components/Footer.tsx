
import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`py-12 px-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              {isDark ? (
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</span>
              ) : (
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</span>
              )}
            </div>
            <p className={isDark ? "text-gray-500 mt-2" : "text-gray-600 mt-2"}>Reclaim Your Voice. Own Your Identity.</p>
          </motion.div>
          
          <div className={isDark ? "text-gray-500 text-sm text-center md:text-right" : "text-gray-600 text-sm text-center md:text-right"}>
            <div className="mb-2">
              &copy; 2025 VoiceMate ID &middot; <a href="mailto:rick@voicemate.id" className="text-voicemate-red hover:text-voicemate-purple transition-colors">rick@voicemate.id</a>
            </div>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link to="/privacy" className={isDark ? "text-gray-500 hover:text-white transition-colors" : "text-gray-600 hover:text-gray-900 transition-colors"}>Privacy</Link>
              <Link to="/terms" className={isDark ? "text-gray-500 hover:text-white transition-colors" : "text-gray-600 hover:text-gray-900 transition-colors"}>Terms</Link>
              <Link to="/contact" className={isDark ? "text-gray-500 hover:text-white transition-colors" : "text-gray-600 hover:text-gray-900 transition-colors"}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

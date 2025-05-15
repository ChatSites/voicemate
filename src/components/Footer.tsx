import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, PhoneCall, Twitter } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`py-12 ${isDark ? 'bg-black' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</span>
            </div>
            <p className={isDark ? "text-gray-500 mt-2" : "text-gray-600 mt-2"}>Reclaim Your Voice. Own Your Identity.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href="mailto:support@voicemate.id" className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>support@voicemate.id</a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <a href="/contact" className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Contact Form</a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg">Follow Us</h4>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center space-x-2">
                <Twitter className="h-4 w-4 text-gray-500" />
                <a href="https://twitter.com/voicemate_id" target="_blank" rel="noopener noreferrer" className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>@voicemate_id</a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="font-semibold text-lg">Legal</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/terms" className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Terms of Service</a>
              </li>
              <li>
                <a href="/privacy" className={isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}>Privacy Policy</a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className={isDark ? "text-gray-500" : "text-gray-600"}>
            © {new Date().getFullYear()} VoiceMate ID. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

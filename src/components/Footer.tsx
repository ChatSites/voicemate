
import * as React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</span>
            </div>
            <p className="text-gray-500 mt-2">Reclaim Your Voice. Own Your Identity.</p>
          </motion.div>
          
          <div className="text-gray-500 text-sm text-center md:text-right">
            <div className="mb-2">
              &copy; 2025 VoiceMate ID &middot; <a href="mailto:rick@voicemate.id" className="text-voicemate-red hover:text-voicemate-purple transition-colors">rick@voicemate.id</a>
            </div>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="#privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="text-gray-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


import * as React from "react";
import { motion } from "framer-motion";

export default function WhyItMatters() {
  return (
    <section className="py-24 px-4 relative bg-black">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-x -z-10 opacity-10" />
      
      <div className="container mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-4">
            <span role="img" aria-label="lock" className="text-voicemate-red">🔐</span>
            <span className="text-gradient">Why It Matters</span>
          </h2>
          
          <motion.p 
            className="text-xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            PulseID is your new voice identity — a sovereign inbox that protects your time, 
            filters the noise, and gives you control.
          </motion.p>
        </motion.div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-purple">Privacy First</h3>
            <p className="text-gray-300">Keep your personal contact information private while still being accessible. No more sharing your phone number with everyone.</p>
          </motion.div>
          
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-red">Time Control</h3>
            <p className="text-gray-300">Respond when you want, not when others demand. Process voice messages on your own schedule without the pressure of a ringing phone.</p>
          </motion.div>
          
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-red">AI Assistance</h3>
            <p className="text-gray-300">Our AI helps you extract meaning, filter noise, and prioritize messages that matter most to you. No more sifting through useless calls.</p>
          </motion.div>
          
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-purple">Digital Identity</h3>
            <p className="text-gray-300">Own your voice identity in the digital age. Your PulseID becomes part of your modern digital presence, separate from legacy phone systems.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

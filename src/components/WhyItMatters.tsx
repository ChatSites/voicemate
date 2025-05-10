
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
            <span role="img" aria-label="world" className="text-voicemate-red">🌍</span>
            <span className="text-gradient">Why It Matters</span>
          </h2>
          
          <motion.p 
            className="text-xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            We're done with:
          </motion.p>
          
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 my-8"
          >
            {["Spam calls", "Missed voicemails", "Buried texts", "Cluttered inboxes", "Constant interruptions"].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="bg-voicemate-card px-4 py-2 rounded-full text-gray-300"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-purple">Phone Numbers Are a Relic</h3>
            <p className="text-gray-300">Phone numbers were never designed for the digital age. They're from an era of operators and switchboards.</p>
          </motion.div>
          
          <motion.div
            className="p-8 bg-gradient-to-br from-black to-voicemate-card rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-voicemate-red">Stay Reachable Without Sacrifice</h3>
            <p className="text-gray-300">VoiceMate lets you stay reachable — without giving up your peace. Be available on your own terms.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

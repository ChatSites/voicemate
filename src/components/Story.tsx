
import * as React from "react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Story() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <Separator className="bg-gray-800 mb-16" />
      
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <span role="img" aria-label="book" className="block mb-4">📖</span>
            The True Story Behind VoiceMate™
          </h2>
          
          <div className="space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <p className="text-xl font-medium text-center mb-2">
                <span className="text-voicemate-purple">It started with a question:</span>
              </p>
              <p className="text-xl italic text-center mb-8">
                "Why am I still being interrupted by things I didn't ask for?"
              </p>
              
              <p className="text-gray-300 mb-4">
                We tolerated it for years: spam calls, robocalls, voicemail fatigue, email chaos. 
                Our phone numbers became liabilities. Our attention? Hijacked.
              </p>
              
              <p className="text-gray-300 mb-4">
                Then one day, a real message got lost in the noise. That was the breaking point.
              </p>
              
              <p className="text-xl font-bold text-center mt-8 text-voicemate-red">
                This system is broken.
              </p>
              <p className="text-center text-gray-300">
                Phones weren't built for boundaries — they were built for access.
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <span role="img" aria-label="lightbulb" className="block mb-4">💡</span>
            The Turning Point
          </h2>
          
          <div className="space-y-6">
            <p className="text-gray-300">
              We stopped building around phone numbers and started building around <strong>people</strong>.
            </p>
            
            <p className="text-gray-300">
              VoiceMate lets others reach you — <em>without invading your space</em>. 
              It's async, intelligent, respectful communication.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

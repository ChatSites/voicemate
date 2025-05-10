
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function CallToAction() {
  const benefits = [
    "No more spam calls",
    "No more inbox chaos",
    "No more interruptions",
    "No more missing what matters"
  ];
  
  const privacyFeatures = [
    "No number required",
    "No tracking",
    "No spam",
    "Your messages, encrypted and secure"
  ];
  
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-20"></div>
      
      <div className="container mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
            <span role="img" aria-label="sunny" className="block mb-4">🌤</span>
            Life After the Phone Number
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-12">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-voicemate-red/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-voicemate-red" />
                </div>
                <span className="text-gray-200">{benefit}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            className="text-xl mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Let people reach you — <strong className="text-white">without letting them in.</strong>
            <br />Welcome to life on your terms.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              size="lg"
              asChild
              className="bg-voicemate-red hover:bg-red-600 text-white rounded-full px-8 py-6 text-lg button-glow transition-all hover:scale-105"
            >
              <Link to="/reserve">
                🎤 Reserve Your PulseID
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Try It Section */}
        <Separator className="bg-gray-800 my-16" />
        
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
            <span role="img" aria-label="mailbox" className="block mb-4">📬</span>
            Try It
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-br from-black to-voicemate-card p-6 rounded-xl border border-gray-800"
            >
              <p className="text-lg mb-4">Try a real VoiceMate Pulse:</p>
              <a 
                href="https://voicemate.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-voicemate-purple hover:text-voicemate-red transition-colors"
              >
                <span role="img" aria-label="globe">🌐</span>
                voicemate.id
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gradient-to-br from-black to-voicemate-card p-6 rounded-xl border border-gray-800"
            >
              <p className="text-lg mb-4">Or leave Rick a message:</p>
              <a 
                href="https://voicemate.id/pulse/rickj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-voicemate-purple hover:text-voicemate-red transition-colors"
              >
                <span role="img" aria-label="headphones">🎧</span>
                voicemate.id/pulse/rickj
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
          
          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
              <span role="img" aria-label="shield">🛡️</span>
              Privacy First
            </h3>
            <p className="text-lg mb-6">Your voice. Your inbox. Your rules.</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
              {privacyFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-voicemate-purple/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-voicemate-purple" />
                  </div>
                  <span className="text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Join the Movement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
              <span role="img" aria-label="hands">🙌</span>
              Join the Movement
            </h3>
            <p className="text-gray-300 mb-6">
              Star ⭐ the repo. Fork 🍴 the project. Build 🔧 your own Pulse.<br />
              Or just share the idea with someone who's ready to unplug — but still stay connected.
            </p>
            
            <div className="bg-voicemate-card p-4 rounded-lg inline-block">
              <p className="italic text-lg">
                "I don't take calls. I have a VoiceMate™."
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

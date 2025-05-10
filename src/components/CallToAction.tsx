
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function CallToAction() {
  const openModal = () => {
    alert("🚧 Waitlist form coming soon. You'll be able to reserve your PulseID.");
  };
  
  const benefits = [
    "No more spam calls",
    "No more inbox chaos",
    "No more interruptions",
    "No more missing what matters"
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
              onClick={openModal}
              className="bg-voicemate-red hover:bg-red-600 text-white rounded-full px-8 py-6 text-lg button-glow transition-all hover:scale-105"
            >
              🎤 Reserve Your PulseID
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

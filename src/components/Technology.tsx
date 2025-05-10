
import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const techVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
    }
  })
};

export default function Technology() {
  const technologies = [
    {
      icon: "⚡",
      title: "Real-Time AI",
      description: "Powered by GPT-4o for instant transcription, summarization, and response handling."
    },
    {
      icon: "📦",
      title: "Smart Packets™",
      description: "Each voice message includes audio, a transcript, inferred intent, and customizable call-to-action buttons."
    },
    {
      icon: "🧠",
      title: "Intent Detection",
      description: "VoiceMate understands what people are asking — and only surfaces what matters to you."
    },
    {
      icon: "🔐",
      title: "Built on Supabase",
      description: "Private, scalable, and secure data storage — giving you full control of your voice inbox."
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-voicemate-dark to-black relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-voicemate-purple/5 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <span role="img" aria-label="wrench" className="mr-2">🔧</span>
            The Technology Behind It
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {technologies.map((tech, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={techVariants}
            >
              <Card className="h-full bg-gradient-to-br from-voicemate-card to-black border border-gray-800 hover:border-voicemate-purple/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{tech.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{tech.title}</h3>
                  <p className="text-gray-300">{tech.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Tech visualization */}
        <motion.div
          className="mt-16 p-8 rounded-2xl bg-black/50 backdrop-blur-sm border border-gray-800 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold mb-3 text-voicemate-purple">How It Works</h4>
              <p className="text-gray-300 mb-4">
                Our AI processes incoming voice messages in real-time, extracting key information 
                and creating actionable insights.
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="inline-block w-2 h-2 bg-voicemate-red rounded-full"></span>
                <span>Voice Input</span>
                <span className="mx-2">→</span>
                <span className="inline-block w-2 h-2 bg-voicemate-purple rounded-full"></span>
                <span>AI Processing</span>
                <span className="mx-2">→</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Smart Output</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="relative h-24">
                {/* Audio waves visualization */}
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <motion.path
                      d="M0,25 Q10,20 20,25 T40,25 T60,25 T80,25 T100,25"
                      fill="none"
                      stroke="#9b5de5"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                    />
                    <motion.path
                      d="M0,25 Q10,30 20,25 T40,25 T60,25 T80,25 T100,25"
                      fill="none"
                      stroke="#fa4b53"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "loop" }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

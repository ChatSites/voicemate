
import * as React from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Volume, Check } from "lucide-react";

const steps = [
  {
    icon: <MessageCircle className="h-8 w-8 text-voicemate-purple" />,
    title: "Share Your PulseID Link",
    description: "Instead of giving out your phone number, share your personal VoiceMate link."
  },
  {
    icon: <Volume className="h-8 w-8 text-voicemate-red" />,
    title: "They Leave You a Voice Message",
    description: "Visitors can leave you a voice message anytime — no interruptions, no phone calls."
  },
  {
    icon: <Mail className="h-8 w-8 text-voicemate-purple" />,
    title: "Our AI Handles Everything",
    description: "VoiceMate transcribes the message, understands the intent, and suggests smart replies."
  },
  {
    icon: <Check className="h-8 w-8 text-voicemate-red" />,
    title: "You Respond When Ready",
    description: "Review when you're ready. No pressure, no interruptions."
  }
];

const features = [
  "✅ Transcribes the message",
  "✅ Understands the intent",
  "✅ Suggests smart replies and CTAs",
  "✅ Stores everything securely",
  "✅ Notifies you when something actually matters"
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-black relative" id="how-it-works">
      <div className="absolute inset-0 bg-mesh-gradient rotate-180 animate-gradient-y -z-10 opacity-10" />
      
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <span role="img" aria-label="lightbulb" className="block mb-4">💡</span>
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            VoiceMate™ gives every person a <strong>PulseID</strong> — your own voice-based inbox.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex"
            >
              <div className="flex-shrink-0 mr-4 h-12 w-12 rounded-full bg-voicemate-card flex items-center justify-center">
                <div className="text-2xl">{index + 1}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-3">
                  <span>{step.icon}</span>
                  <span>{step.title}</span>
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-br from-black to-voicemate-card p-8 rounded-2xl border border-gray-800"
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">
            <span role="img" aria-label="package" className="mr-2">📦</span>
            Each message becomes a <span className="text-voicemate-purple">Smart Packet™</span>
          </h3>
          
          <p className="text-gray-300 mb-8 text-center">
            Containing voice, transcript, intent, and dynamic action options.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                className="text-lg"
              >
                {feature}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 text-xl font-medium text-voicemate-red">
            No interruptions. No clutter. Just clarity.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

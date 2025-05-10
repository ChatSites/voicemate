
import * as React from "react";
import { motion } from "framer-motion";
import { Server, Database, Workflow, Lock, Shield, Layout } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Technology() {
  const techStack = [
    {
      icon: <Server className="h-6 w-6" />,
      name: "OpenAI GPT-4o",
      description: "Real-time transcription + intent analysis"
    },
    {
      icon: <Database className="h-6 w-6" />,
      name: "Supabase",
      description: "Secure data storage and user auth"
    },
    {
      icon: <Layout className="h-6 w-6" />,
      name: "WebSocket + JavaScript",
      description: "Instant responsiveness architecture"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      name: "Custom Pulse Inbox",
      description: "Smart Packet Viewer"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      name: "Zero-Install Design",
      description: "Mobile-first approach"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      name: "Cross-Browser Support",
      description: "No app to download"
    }
  ];

  return (
    <section className="py-24 px-4" id="technology">
      <div className="container mx-auto">
        <Separator className="bg-gray-800 mb-16" />

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            <span role="img" aria-label="brain" className="block mb-4">🧠</span>
            Built With
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {techStack.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-start"
            >
              <div className="flex-shrink-0 mt-1 mr-4 w-10 h-10 flex items-center justify-center rounded-md bg-voicemate-purple/20 text-voicemate-purple">
                {tech.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center max-w-3xl mx-auto"
        >
          <p className="text-xl text-voicemate-red">
            <span className="text-gradient">The Future of Communication</span>
          </p>
          <p className="text-lg mt-4 italic text-gray-300">
            "We believe communication should be human, respectful, and async —<br /> 
            not addictive, spammy, or overwhelming."
          </p>
          <p className="mt-6 text-lg">
            VoiceMate is the start of a new kind of digital identity:<br />
            <span className="font-semibold">Intentional. Context-rich. Voice-powered.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

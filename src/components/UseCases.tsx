
import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const useVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    }
  })
};

export default function UseCases() {
  const useCases = [
    {
      icon: "👤",
      title: "Individuals",
      description: "Reclaim your time without disappearing. Receive real messages from real people — on your schedule."
    },
    {
      icon: "👨‍🎓",
      title: "Students",
      description: "Block distractions during class and study sessions. Share a voice inbox for group projects, updates, or tutoring."
    },
    {
      icon: "👪",
      title: "Families",
      description: "Stay connected across time zones and busy days. Leave heartfelt updates or important reminders — async."
    },
    {
      icon: "🧑‍💼",
      title: "Professionals",
      description: "Replace voicemail chaos with organized voice summaries. Handle client requests or questions with smart replies and CTAs."
    },
    {
      icon: "🎙️",
      title: "Creators",
      description: "Let fans leave you voice messages without giving out your number. Capture testimonials, feedback, and stories in their own voice."
    },
    {
      icon: "💼",
      title: "Sales Agents",
      description: "Turn missed calls into structured AI-handled voice leads. Let prospects ask questions without pressure — then follow up."
    }
  ];
  
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black to-voicemate-dark" id="use-cases">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span role="img" aria-label="tools" className="block mb-4">🛠️</span>
            Who Is VoiceMate For?
          </motion.h2>
          <motion.p
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            VoiceMate is for everyone with a phone who's tired of being interrupted.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={useVariants}
            >
              <Card className="h-full bg-voicemate-card border-0 shadow-lg hover:shadow-voicemate-purple/10 transition-all duration-500 feature-card-hover gradient-border">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-6">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-voicemate-card p-6 rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center gap-2">
              <span role="img" aria-label="phone">📱</span>
              Anyone with a phone
            </h3>
            <p className="text-gray-300">
              Ditch the robocalls. Mute the chaos. Keep your humanity.<br />
              You don't need a new app — just a new link.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

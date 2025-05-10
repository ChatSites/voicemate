
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
            Who It's For
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "👤",
              title: "Creators",
              description: "Capture inbound voice messages from your fans or leads without giving away your number."
            },
            {
              icon: "💼",
              title: "Sales Agents",
              description: "Turn missed calls into structured, AI-handled voice leads with built-in CTAs."
            },
            {
              icon: "📱",
              title: "Anyone",
              description: "Redirect unwanted calls and create space — on your own time, with your voice."
            }
          ].map((item, i) => (
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
      </div>
    </section>
  );
}

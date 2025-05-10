
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InfoCircle, Mic, Play, Headphones } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    }
  })
};

const flowSteps = [
  {
    id: "record",
    title: "Record Your Message",
    description: "Your caller leaves a voice message that's instantly processed by our AI.",
    icon: Mic,
    color: "bg-voicemate-red",
  },
  {
    id: "process",
    title: "AI Analysis",
    description: "VoiceMate transcribes, summarizes, and identifies the intent behind each message.",
    icon: InfoCircle,
    color: "bg-voicemate-purple",
  },
  {
    id: "deliver",
    title: "Smart Delivery",
    description: "Messages are packaged with transcripts, intents, and actions, then delivered to you.",
    icon: Headphones,
    color: "bg-green-500",
  }
];

const useCaseExamples = {
  creator: {
    title: "For Creators",
    steps: [
      "Fan sends voice message to your VoiceMate inbox",
      "AI transcribes, summarizes, and detects sentiment",
      "You receive the message with fan details and engagement options",
      "Respond when convenient, or set up automated responses"
    ]
  },
  sales: {
    title: "For Sales Teams",
    steps: [
      "Lead leaves a voice inquiry about your product",
      "AI categorizes the lead and identifies key questions",
      "Message is routed to the right sales agent with context",
      "Track conversation history and follow up automatically"
    ]
  },
  support: {
    title: "For Support Teams",
    steps: [
      "Customer leaves a voice message describing an issue",
      "AI detects urgency, categorizes the problem type",
      "Support agents receive organized tickets with priority levels",
      "Resolution tracking and satisfaction follow-ups"
    ]
  }
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-voicemate-dark to-black relative" id="how-it-works">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            How VoiceMate Works
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Our AI-powered voice messaging system turns voice into actionable data in seconds
          </p>
        </motion.div>
        
        {/* Flow diagram */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
            {flowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={itemVariants}
                  className="w-full md:w-1/3"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`${step.color} p-4 rounded-full mb-4 text-white`}>
                      <step.icon size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                </motion.div>
                
                {index < flowSteps.length - 1 && (
                  <motion.div 
                    className="hidden md:block" 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <svg width="40" height="24" viewBox="0 0 40 24">
                      <path 
                        d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Use case demos */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="creator" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8 bg-black/50 border border-gray-800">
              <TabsTrigger value="creator">Creators</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            
            {Object.keys(useCaseExamples).map((key) => {
              const useCase = useCaseExamples[key as keyof typeof useCaseExamples];
              
              return (
                <TabsContent key={key} value={key} className="mt-0">
                  <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-6 text-voicemate-purple">{useCase.title}</h3>
                      
                      <div className="space-y-6">
                        {useCase.steps.map((step, i) => (
                          <motion.div 
                            key={i}
                            custom={i} 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className="flex items-start gap-4"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-voicemate-purple to-voicemate-red flex items-center justify-center text-white font-semibold">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-gray-200">{step}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-8">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button className="bg-voicemate-purple hover:bg-voicemate-purple/90">
                              <Play size={16} className="mr-2" />
                              See Example
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent className="bg-black border-t border-gray-800">
                            <DrawerHeader>
                              <DrawerTitle className="text-white">VoiceMate in Action</DrawerTitle>
                              <DrawerDescription>
                                See how VoiceMate handles voice messages for {useCase.title.toLowerCase()}
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                              <div className="border border-gray-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="bg-voicemate-red h-3 w-3 rounded-full"></div>
                                  <span className="text-sm text-gray-400">Incoming voice message</span>
                                </div>
                                <div className="waveform-container mb-3">
                                  {[...Array(24)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className="waveform-bar" 
                                      style={{
                                        height: `${Math.sin(i / 2) * 20 + 25}px`,
                                        opacity: 0.4 + Math.sin(i / 5) * 0.6
                                      }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="border border-gray-800 rounded-lg p-4">
                                <h4 className="text-sm text-gray-400 mb-2">AI-Generated Transcript</h4>
                                <p className="text-white text-sm">
                                  "Hi there! I recently discovered your content and I'm really interested in your latest project. 
                                  I was wondering if you could provide more details about how to get involved? Thanks!"
                                </p>
                              </div>
                              
                              <div className="border border-gray-800 rounded-lg p-4">
                                <h4 className="text-sm text-gray-400 mb-2">VoiceMate Analysis</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">Intent:</span>
                                    <span className="text-sm text-gray-300">Information Request</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">Sentiment:</span>
                                    <span className="text-sm text-gray-300">Positive (0.87)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">Priority:</span>
                                    <span className="text-sm text-gray-300">Medium</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border border-gray-800 rounded-lg p-4">
                                <h4 className="text-sm text-gray-400 mb-2">Quick Response</h4>
                                <Textarea 
                                  className="bg-black border-gray-700 text-white" 
                                  placeholder="Thanks for your interest! Here's a link to more info..."
                                />
                                <div className="flex justify-end mt-2">
                                  <Button className="bg-voicemate-purple hover:bg-voicemate-purple/90 text-sm" size="sm">
                                    Send Response
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
        
        {/* Integration visualization */}
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-black to-voicemate-dark/30 rounded-xl border border-gray-800 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Seamlessly Integrates With Your Workflow</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Messaging Apps", icon: "💬" },
              { name: "CRM Systems", icon: "📊" },
              { name: "Email Clients", icon: "📧" },
              { name: "Custom APIs", icon: "🔌" }
            ].map((integration, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className="p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-voicemate-purple/50 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{integration.icon}</div>
                <h4 className="text-sm font-medium">{integration.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

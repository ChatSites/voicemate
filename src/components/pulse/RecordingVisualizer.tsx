
import React from 'react';
import { motion } from 'framer-motion';

const RecordingVisualizer = () => {
  return (
    <div className="flex justify-center">
      <div className="waveform-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="waveform-bar"
            animate={{
              height: Math.random() * 40 + 10,
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordingVisualizer;

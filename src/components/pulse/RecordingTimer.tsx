
import React from 'react';

interface RecordingTimerProps {
  seconds: number;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ seconds }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="text-xl font-bold text-voicemate-red">
      {formatTime(seconds)}
    </div>
  );
};

export default RecordingTimer;

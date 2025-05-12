
// SpeechRecognition types
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly confidence: number;
  readonly transcript: string;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message?: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: any;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
}

// Define the CTAVariant interface
export interface CTAVariant {
  label: string;
  action: string;
  url?: string;
}

// Core recording types
export interface UseRecordingResult {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  transcription: string;
  suggestedCTAs: CTAVariant[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

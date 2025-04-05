"use client";

import { useRef, useState } from "react";

// import { useEffect, useRef, useState } from "react";

// export const useSpeechSynthesis = () => {
//   const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const synthRef = useRef<SpeechSynthesis | null>(null);

//   useEffect(() => {
//     // Initialize speechSynthesis only on client side
//     synthRef.current = window.speechSynthesis;
//   }, []);

//   const playSummaryAudio = (text: string, title: string) => {
//     const synth = synthRef.current;
//     if (!synth) return;

//     // If paused, resume
//     if (synth.paused) {
//       synth.resume();
//       setIsPlaying(true);
//       return;
//     }

//     // If already speaking and not paused, pause it
//     if (synth.speaking && !synth.paused) {
//       synth.pause();
//       setIsPlaying(false);
//       return;
//     }

//     // If nothing is speaking, create a new utterance
//     const intro = `You're listening to a summary of "${title}". Let's get started. `;
//     const contentToRead = intro + text;

//     const utterance = new SpeechSynthesisUtterance(contentToRead);
//     utterance.lang = "en-US";
//     utterance.onend = () => {
//       setIsPlaying(false);
//       utteranceRef.current = null;
//     };

//     utteranceRef.current = utterance;
//     synth.speak(utterance);
//     setIsPlaying(true);
//   };

//   const stopSummaryAudio = () => {
//     const synth = synthRef.current;
//     if (!synth) return;

//     synth.cancel();
//     setIsPlaying(false);
//     utteranceRef.current = null;
//   };

//   return { playSummaryAudio, stopSummaryAudio, isPlaying };
// };import { useRef, useState } from "react";

export const useSpeechSynthesis = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSummaryAudio = (text: string, title: string) => {
    if (!text) return;

    const synth = window.speechSynthesis;

    // If speaking and not paused -> Pause
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPlaying(false);
      return;
    }

    // If paused -> Resume
    if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
      return;
    }
    const intro = `You're listening to a summary of "${title}". Let's get started. `;
    const contentToRead = intro + text;
    // Else -> Start new utterance
    const utterance = new SpeechSynthesisUtterance(contentToRead);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
  };

  const stopSummaryAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return { playSummaryAudio, stopSummaryAudio, isPlaying };
};

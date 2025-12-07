"use client";

import { useRef, useEffect } from "react";
import correctSfx from "@/assets/sfx/correct_answer.mp3";
import wrongSfx from "@/assets/sfx/wrong_answer.mp3";
// import finishSfx from '@/assets/sfx/quiz_finish.mp3';

export const useSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !soundPath) {
      return;
    }
    audioRef.current = new Audio(soundPath);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [soundPath]);

  return {
    play: () => {
      if (!audioRef.current) {
        return;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    },
    pause: () => {
      if (!audioRef.current) {
        return;
      }
      audioRef.current.pause();
    },
    stop: () => {
      if (!audioRef.current) {
        return;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    },
  };
};

export const useQuizSound = () => {
  const correctSound = useSound(correctSfx);
  const wrongSound = useSound(wrongSfx);
  // const finishSound = useSound("/sounds/finish.mp3");

  return {
    correctSound,
    wrongSound,
    // finishSound,
  };
};

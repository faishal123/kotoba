import { useRef } from "react";
import correctSfx from "@/assets/sfx/correct_answer.mp3";
import wrongSfx from "@/assets/sfx/wrong_answer.mp3";
// import finishSfx from '@/assets/sfx/quiz_finish.mp3';

export const useSound = (soundPath: string) => {
  const audioRef = useRef(new Audio(soundPath));

  return {
    play: () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    },
    pause: () => {
      audioRef.current.pause();
    },
    stop: () => {
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

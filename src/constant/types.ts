import { ReactNode } from "react";

export type AnswerType = {
  answer: string;
  isCorrect: boolean;
};

type KanjiQuestionType = ReactNode;

export type QuestionType = {
  question: string | KanjiQuestionType;
  answers: AnswerType[];
};

export type LevelChoiceType = {
  characterKatakana: string;
  characterHiragana: string;
  name: string;
  charactersHiragana: string[];
  charactersKatakana: string[];
  href: string;
};

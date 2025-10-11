export type AnswerType = {
  answer: string;
  isCorrect: boolean;
};

export type QuestionType = {
  question: string;
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

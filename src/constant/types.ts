export type QuestionType = {
  question: string;
  answers: {
    answer: string;
    isCorrect: boolean;
  }[];
};

export type LevelChoiceType = {
  characterKatakana: string;
  characterHiragana: string;
  name: string;
  charactersHiragana: string[];
  charactersKatakana: string[];
  href: string;
};

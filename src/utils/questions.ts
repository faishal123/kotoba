import { LevelChoiceType } from "@/constant/types";
import { randomizeArray } from "./serverUtils";

export const generateShuffledQuestions = ({
  currentLevel,
  charactersKey,
  charactersToRomaji,
  questionsCount,
}: {
  currentLevel?: LevelChoiceType;
  charactersKey: "charactersHiragana" | "charactersKatakana";
  charactersToRomaji: Record<string, string>;
  questionsCount: number;
}) => {
  const currentLevelCharacters = currentLevel?.[charactersKey] || [];
  const currentLevelCharactersLength = currentLevelCharacters.length;
  const possibleAnswers = currentLevelCharacters.map((char) => {
    return charactersToRomaji[char];
  });

  const multiplyFactor = Math.ceil(
    questionsCount / currentLevelCharactersLength
  );

  const questions = Array.from(Array(multiplyFactor).keys()).flatMap(() => {
    return currentLevelCharacters;
  });

  const questionsShuffled = randomizeArray(
    questions.map((value) => ({ value }))
  ).map(({ value }) => {
    const correctAnswer = charactersToRomaji[value];
    const wrongAnswers = possibleAnswers
      .filter((answer) => answer !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const answers = [
      {
        answer: correctAnswer,
        isCorrect: true,
      },
      ...wrongAnswers.map((answer) => {
        return {
          answer: answer,
          isCorrect: false,
        };
      }),
    ]
      .map((value) => value)
      .sort(() => 0.5 - Math.random());
    return {
      question: value,
      answers: answers,
    };
  });

  questionsShuffled.length = questionsCount;

  return questionsShuffled;
};

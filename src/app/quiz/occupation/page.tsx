import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { occupations } from "@/constant/minna-no-nihongo";
import { QuestionType } from "@/constant/types";
import {
  generateRandomNumber,
  randomizeArray,
  removeDuplicates,
} from "@/utils/serverUtils";

export default function Page() {
  const possibleAnswers = removeDuplicates(
    occupations.flatMap((occ) => occ.indonesian_translation_options)
  );
  const questions = randomizeArray(occupations).reduce<QuestionType[]>(
    (a, c) => {
      const question = c.kanji ? (
        <ruby>
          {c.kanji}
          <rt>{c.furigana}</rt>
        </ruby>
      ) : (
        c.furigana
      );

      const correctAnswerArray = c.indonesian_translation_options;
      const correctAnswer = randomizeArray(correctAnswerArray)[0];

      const possibleWrongAnswers = possibleAnswers.filter(
        (a) => !correctAnswerArray.includes(a)
      );
      const firstWrongAnswerIndex = generateRandomNumber(
        0,
        possibleWrongAnswers.length - 1
      );
      let secondWrongAnswerIndex = firstWrongAnswerIndex + 1;
      if (secondWrongAnswerIndex >= possibleWrongAnswers.length) {
        secondWrongAnswerIndex = 0;
      }

      const answers = randomizeArray([
        {
          answer: correctAnswer,
          isCorrect: true,
        },
        {
          answer: possibleWrongAnswers[firstWrongAnswerIndex],
          isCorrect: false,
        },
        {
          answer: possibleWrongAnswers[secondWrongAnswerIndex],
          isCorrect: false,
        },
      ]);

      return [
        ...a,
        {
          question,
          answers,
        },
      ];
    },
    []
  );

  return (
    <QuizScreen
      questionClassName="text-5xl xs:text-8xl"
      answerClassName="text-xl xs:text-3xl"
      answersContainerClassName="flex-col xs:flex-row"
      containerClassName="pt-[168px] pb-[140px] xs:pt-0 xs:pb-0"
      homeUrl="/"
      levelName="Occupations"
      questions={questions}
    />
  );
}

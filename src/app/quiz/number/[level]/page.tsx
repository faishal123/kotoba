import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { numbers } from "@/constant/numbers";
import { AnswerType, QuestionType } from "@/constant/types";
import { generateRandomNumber, randomizeArray } from "@/utils/serverUtils";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { level } = await params;
  const searchParamsResult = await searchParams;
  const questionsCount = Number(searchParamsResult?.questions || "10");
  const multiplyFactor = Math.ceil(questionsCount / numbers.length);
  const possibleNumberAnswers = numbers.map((num) => num.romaji);

  const possibleQuestions = randomizeArray(
    Array.from(Array(multiplyFactor).keys()).flatMap(() => {
      return numbers;
    })
  );

  const questions = possibleQuestions
    .splice(0, questionsCount)
    .reduce<QuestionType[]>((a, c) => {
      let question: string;
      const correctAnswer = c.romaji;
      const possibleWrongAnswers = possibleNumberAnswers.filter(
        (a) => a !== correctAnswer
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

      if (level === "easy") {
        question = randomizeArray(c.kana)?.[0]?.text;
      } else {
        question = c?.kanji?.[0]?.text;
      }

      return [...a, { question, answers }];
    }, []);

  return (
    <QuizScreen
      homeUrl="/levels/number"
      levelName={`Numbers ${level}`}
      questions={questions}
    />
  );
}

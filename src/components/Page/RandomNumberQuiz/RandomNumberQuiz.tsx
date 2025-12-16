"use client";
import { ChooseQuestionCountPage } from "@/components/Molecules/ChooseQuestionCountPage/ChooseQuestionCountPage";
import { HeaderBackButton } from "@/components/Molecules/Header/BackButton";
import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { AnswerType, QuestionType } from "@/constant/types";
import { generateRandomNumber, randomizeArray } from "@/utils/serverUtils";
import { translateNumberToJapanese } from "japanese-number-translator";
import { useSearchParams } from "next/navigation";

export default function RandomNumberQuiz() {
  const searchParams = useSearchParams();
  const questionCountParam = searchParams.get("questionCount");
  const questionCount = Number(questionCountParam || 0);

  if (!questionCountParam) {
    return (
      <div className="w-[100svw] h-[100svh] flex flex-col p-10">
        <HeaderBackButton />
        <ChooseQuestionCountPage />
      </div>
    );
  }

  const questions: QuestionType[] = Array.from(Array(questionCount)).reduce<
    QuestionType[]
  >((a) => {
    const correctAnswer = generateRandomNumber(1, 100000);
    const wrongAnswers: number[] = [];
    while (wrongAnswers.filter((a) => a !== correctAnswer).length < 2) {
      wrongAnswers.push(generateRandomNumber(1, 100000));
    }

    const answers: AnswerType[] = randomizeArray([
      {
        answer: `${correctAnswer}`,
        isCorrect: true,
      },
      {
        answer: `${wrongAnswers?.[0]}`,
        isCorrect: false,
      },
      {
        answer: `${wrongAnswers?.[1]}`,
        isCorrect: false,
      },
    ]);

    const correctAnswerTranslated = translateNumberToJapanese(
      `${correctAnswer}`
    );
    return [
      ...a,
      {
        question: correctAnswerTranslated?.kana,
        answers,
      },
    ];
  }, []);

  return (
    <QuizScreen
      questionClassName="text-5xl xs:text-8xl text-center"
      answerClassName="text-xl xs:text-3xl"
      answersContainerClassName="flex-col xs:flex-row"
      containerClassName="pt-[168px] pb-[140px] px-10 xs:pt-0 xs:pb-0"
      homeUrl="/"
      levelName={"Random Numbers"}
      questions={questions}
      answerMethod="input"
    />
  );
}

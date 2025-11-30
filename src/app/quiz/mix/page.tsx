import { ChooseQuestionCountPage } from "@/components/Molecules/ChooseQuestionCountPage/ChooseQuestionCountPage";
import { HeaderBackButton } from "@/components/Molecules/Header/BackButton";
import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { QuestionType } from "@/constant/types";
import {
  generateRandomNumber,
  randomizeArray,
  removeDuplicates,
} from "@/utils/serverUtils";
import {
  getAllData,
  SupabaseAvailableQuizViewType,
  SupabaseQuestionType,
} from "@/utils/supabase";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const urlSearchParams = await searchParams;
  const questionCountParam = urlSearchParams.questionCount as
    | string
    | undefined;
  const questionCount = Number(questionCountParam || 0);

  const quizzesParam = urlSearchParams.quizzes as string | undefined;
  const quizzes = quizzesParam ? quizzesParam.split(",") : [];
  const allQuizzes = (await getAllData("kotoba_quiz_available_list")) as
    | SupabaseAvailableQuizViewType[]
    | null;
  const selectedQuizzes = allQuizzes?.filter(
    (quiz) => quizzes.includes(quiz.quiz_name) && quiz.question_count > 0
  );

  const questionsPromise = selectedQuizzes?.map(async (quiz) => {
    const currenntQuizQuestions = await getAllData<SupabaseQuestionType>(
      "kotoba-questions",
      undefined,
      undefined,
      {
        by: "quiz_id",
        value: quiz.id,
      }
    );
    return {
      quizName: quiz.quiz_name,
      questions: currenntQuizQuestions,
    };
  });

  const questionsFromSupabase = await Promise.all(questionsPromise || []);

  const possibleAnswers = questionsFromSupabase.reduce<
    Record<string, string[]>
  >((a, c) => {
    const answers = removeDuplicates(
      c?.questions?.flatMap((q) => q.meaning) || []
    );
    return {
      ...a,
      [c.quizName]: answers,
    };
  }, {});

  const questions = randomizeArray(
    questionsFromSupabase.reduce<QuestionType[]>((a, c) => {
      const currentQuizQuestions = randomizeArray(c.questions || []).reduce<
        QuestionType[]
      >((a2, c2) => {
        const question = c2.kanji ? (
          <ruby>
            {c2.kanji}
            <rt>{c2.furigana}</rt>
          </ruby>
        ) : (
          c2.furigana
        );

        const correctAnswerArray = c2.meaning;
        const correctAnswer = randomizeArray(correctAnswerArray)[0];

        const possibleWrongAnswers = randomizeArray(
          possibleAnswers?.[c.quizName].filter(
            (a) => !correctAnswerArray.includes(a)
          )
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
          ...a2,
          {
            question,
            answers,
          },
        ];
      }, []);

      return [...a, ...currentQuizQuestions];
    }, [])
  );

  if (!questionCountParam) {
    return (
      <div className="w-[100svw] h-[100svh] flex flex-col p-10">
        <HeaderBackButton />
        <ChooseQuestionCountPage />
      </div>
    );
  }

  const multiplyFactor = Math.ceil(questionCount / questions.length);
  const extendedQuestions = Array.from(Array(multiplyFactor).keys()).flatMap(
    () => {
      return questions;
    }
  );
  extendedQuestions.length = questionCount;

  return (
    <QuizScreen
      questionClassName="text-5xl xs:text-8xl"
      answerClassName="text-xl xs:text-3xl"
      answersContainerClassName="flex-col xs:flex-row"
      containerClassName="pt-[168px] pb-[140px] xs:pt-0 xs:pb-0"
      homeUrl="/"
      levelName={quizzes.join(" + ")}
      questions={randomizeArray(extendedQuestions)}
    />
  );
}

import { getAllData, SupabaseAvailableQuizViewType } from "@/utils/supabase";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const quizzesParam = (await searchParams).quizzes as string | undefined;
  const quizzes = quizzesParam ? quizzesParam.split(",") : [];
  const allQuizzes = (await getAllData("kotoba_quiz_available_list")) as
    | SupabaseAvailableQuizViewType[]
    | null;
  const selectedQuizzes = allQuizzes?.filter(
    (quiz) => quizzes.includes(quiz.quiz_name) && quiz.question_count > 0
  );

  const questions = selectedQuizzes?.map(async (quiz) => {
    const currenntQuizQuestions = await getAllData(
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
      questionCount: quiz.question_count,
      questions: currenntQuizQuestions,
    };
  });

  const questionsResolved = await Promise.all(questions || []);

  console.log(questionsResolved);

  return <div>test</div>;
}

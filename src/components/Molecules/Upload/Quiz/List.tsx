import { SingleQuizDisplay } from "./Single";
import { SupabaseQuizType, SupabaseQuestionType } from "@/utils/supabase";
import { FetchDataType } from "@/app/upload/clientPage";

export const QuizList = ({
  fetchData,
  allData,
}: {
  fetchData: FetchDataType;
  allData: {
    quizzes: SupabaseQuizType[] | undefined | null;
    questions: SupabaseQuestionType[] | undefined | null;
  };
}) => {
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold mb-2">Existing Quiz</h1>
      <div className="flex flex-wrap gap-4">
        {(allData?.quizzes || [])?.length
          ? (allData?.quizzes || [])?.map((quiz) => {
              return (
                <SingleQuizDisplay
                  key={quiz.id}
                  type="edit"
                  quiz={quiz}
                  refetchData={fetchData}
                />
              );
            })
          : "No Quiz Registered"}
        <SingleQuizDisplay refetchData={fetchData} type="create" />
      </div>
    </div>
  );
};

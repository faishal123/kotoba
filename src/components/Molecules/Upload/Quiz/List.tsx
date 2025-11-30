import { SingleQuizDisplay } from "./Single";
import { EditDataFunctionType } from "@/utils/supabase";
import { InsertNewDataFunctionType } from "@/utils/supabase";
import { DeleteDataFunctionType } from "@/utils/supabase";
import { SupabaseQuizType, SupabaseQuestionType } from "@/utils/supabase";
import { FetchDataType } from "@/app/upload/clientPage";

export const QuizList = ({
  insertNewData,
  editData,
  deleteData,
  fetchData,
  allData,
}: {
  insertNewData: InsertNewDataFunctionType;
  editData: EditDataFunctionType;
  deleteData: DeleteDataFunctionType;
  fetchData: FetchDataType;
  allData: {
    quizzes: SupabaseQuizType[];
    questions: SupabaseQuestionType[];
  };
}) => {
  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold mb-2">Existing Quiz</h1>
      <div className="flex flex-wrap gap-4">
        {allData.quizzes.length
          ? allData.quizzes.map((quiz) => {
              return (
                <SingleQuizDisplay
                  onDelete={deleteData}
                  onSubmit={editData}
                  key={quiz.id}
                  type="edit"
                  quiz={quiz}
                  refetchData={fetchData}
                />
              );
            })
          : "No Quiz Registered"}
        <SingleQuizDisplay
          refetchData={fetchData}
          type="create"
          onSubmit={insertNewData}
        />
      </div>
    </div>
  );
};

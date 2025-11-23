import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  SupabaseQuizType,
  SupabaseQuestionType,
  InsertNewDataFunctionType,
  EditDataFunctionType,
  DeleteDataFunctionType,
} from "@/utils/supabase";
import { FetchDataType } from "@/app/upload/clientPage";
import { SingleQuestionDialog, SingleQuestionRow } from "./Single";
import { SelectComponent } from "@/components/Atoms/Select/Select";
import { useState } from "react";
import { UploadMultipleQuestionsDialog } from "./UploadMultipleQuestions";

export const QuestionsList = ({
  allData,
  insertNewData,
  editData,
  deleteData,
  fetchData,
}: {
  allData: {
    quizzes: SupabaseQuizType[];
    questions: SupabaseQuestionType[];
  };
  insertNewData: InsertNewDataFunctionType;
  editData: EditDataFunctionType;
  deleteData: DeleteDataFunctionType;
  fetchData: FetchDataType;
}) => {
  const [quizFilter, setQuizFilter] = useState("");

  const questionsToDisplay = quizFilter
    ? allData.questions.filter((question) => question.quiz_id === quizFilter)
    : allData.questions;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Existing Questions</h1>
      <div className="mb-2 flex gap-2">
        <SelectComponent
          placeholder="All Quizzes"
          triggerClassName="max-w-[300px]"
          onChange={(e) => {
            const selectedQuiz = allData.quizzes.find(
              (quiz) => quiz.quiz_name === e
            );
            if (selectedQuiz) {
              setQuizFilter(selectedQuiz.id);
            } else {
              setQuizFilter("");
            }
          }}
          options={[
            { label: "All Quizzes", value: "All Quizzes" },
            ...allData.quizzes.map((quiz) => ({
              label: quiz.quiz_name,
              value: quiz.quiz_name,
            })),
          ]}
        />
        <SingleQuestionDialog
          allQuizzes={allData?.quizzes}
          onSubmit={insertNewData}
          trigger={<Button>Create a Question</Button>}
          type="create"
          refetchData={fetchData}
        />
        <UploadMultipleQuestionsDialog
          insertNewData={insertNewData}
          trigger={<Button>Upload Multiple Questions</Button>}
          allQuizzes={allData?.quizzes}
          fetchData={fetchData}
        />
      </div>
      <table className="border border-primary">
        <tr>
          <th className="border border-primary bg-gray-100 p-2">Kanji</th>
          <th className="border border-primary bg-gray-100 p-2">Furigana</th>
          <th className="border border-primary bg-gray-100 p-2">Romaji</th>
          <th className="border border-primary bg-gray-100 p-2">Meaning</th>
          <th className="border border-primary bg-gray-100 p-2">Quiz Name</th>
          <th className="border border-primary bg-gray-100 p-2">Actions</th>
        </tr>
        {questionsToDisplay?.map((question) => (
          <SingleQuestionRow
            allData={allData}
            question={question}
            key={question.id}
            editData={editData}
            fetchData={fetchData}
            deleteData={deleteData}
          />
        ))}
      </table>
    </div>
  );
};

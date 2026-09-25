import { Button } from "@/components/ui/button";
import { SupabaseQuizType, SupabaseQuestionType } from "@/utils/supabase";
import { FetchFunctionType } from "@/app/upload/clientPage";
import { SingleQuestionDialog, SingleQuestionRow } from "./Single";
import { SelectComponent } from "@/components/Atoms/Select/Select";
import { useState } from "react";
import { UploadMultipleQuestionsDialog } from "./UploadMultipleQuestions";
import { TableHeader } from "@/components/Atoms/Table/Table";

export const QuestionsList = ({
  allData,
  fetchData,
}: {
  allData: {
    quizzes: SupabaseQuizType[] | undefined | null;
    questions: SupabaseQuestionType[] | undefined | null;
  };
  fetchData: FetchFunctionType;
}) => {
  const [quizFilter, setQuizFilter] = useState("");
  const questionsToDisplay = quizFilter
    ? (allData?.questions || [])?.filter(
        (question) => question.quiz_id === quizFilter,
      )
    : allData.questions;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Existing Questions</h1>
      <div className="mb-2 flex gap-2">
        <SelectComponent
          placeholder="All Quizzes"
          triggerClassName="max-w-[300px]"
          onChange={(e) => {
            const selectedQuiz = (allData?.quizzes || [])?.find(
              (quiz) => quiz.quiz_name === e,
            );
            if (selectedQuiz) {
              setQuizFilter(selectedQuiz.id);
            } else {
              setQuizFilter("");
            }
          }}
          options={[
            { label: "All Quizzes", value: "All Quizzes" },
            ...(allData?.quizzes || [])?.map((quiz) => ({
              label: quiz.quiz_name,
              value: quiz.quiz_name,
            })),
          ]}
        />
        <SingleQuestionDialog
          allQuizzes={allData?.quizzes || []}
          trigger={<Button>Create a Question</Button>}
          type="create"
          refetchData={fetchData}
        />
        <UploadMultipleQuestionsDialog
          trigger={<Button>Upload Multiple Questions</Button>}
          allQuizzes={allData?.quizzes || []}
          fetchData={fetchData}
        />
      </div>
      <table>
        <tbody>
          <tr>
            <TableHeader>Kanji</TableHeader>
            <TableHeader>Furigana</TableHeader>
            <TableHeader>Romaji</TableHeader>
            <TableHeader>Meaning</TableHeader>
            <TableHeader>Quiz Name</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
          {questionsToDisplay?.map((question) => (
            <SingleQuestionRow
              allData={allData}
              question={question}
              key={question.id}
              fetchData={fetchData}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

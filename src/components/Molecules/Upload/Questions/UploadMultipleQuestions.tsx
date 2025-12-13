import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { ReactNode } from "react";
import { SelectComponent } from "@/components/Atoms/Select/Select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BaseQuestionType, SupabaseQuizType } from "@/utils/supabase";
import { FetchDataType } from "@/app/upload/clientPage";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { useCreateQuestions } from "@/services/create-questions/useCreateQuestions";

export const UploadMultipleQuestionsDialog = ({
  trigger,
  allQuizzes,
  fetchData,
}: {
  trigger: ReactNode;
  allQuizzes: SupabaseQuizType[];
  fetchData: FetchDataType;
}) => {
  const [value, setValue] = useState({
    quiz: "",
    questionsData: "",
  });

  const questionsParsed: {
    parsed: BaseQuestionType[] | null;
    error: string | null;
  } = (() => {
    try {
      const parsed = JSON.parse(value.questionsData);
      return {
        parsed,
        error: null,
      };
    } catch (e) {
      return {
        parsed: null,
        error: `Invalid JSON format (${e})`,
      };
    }
  })();

  const { mutate: createQuestions } = useCreateQuestions();

  return (
    <DialogComponent title="Upload Multiple Questions" trigger={trigger}>
      {value.quiz && questionsParsed?.parsed?.length ? (
        <div>
          <table className="border border-primary max-h-[80vh] overflow-y-auto block">
            <tr>
              <th className="border border-primary bg-gray-100 p-2">Kanji</th>
              <th className="border border-primary bg-gray-100 p-2">
                Furigana
              </th>
              <th className="border border-primary bg-gray-100 p-2">Romaji</th>
              <th className="border border-primary bg-gray-100 p-2">Meaning</th>
            </tr>
            {questionsParsed?.parsed?.map((question) => (
              <tr key={JSON.stringify(question)}>
                <td className="p-2 border border-primary">{question.kanji}</td>
                <td className="p-2 border border-primary">
                  {question.furigana}
                </td>
                <td className="p-2 border border-primary">{question.romaji}</td>
                <td className="p-2 border border-primary">
                  {question.meaning.join(", ")}
                </td>
              </tr>
            ))}
          </table>
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={() => {
                setValue((prev) => ({ ...prev, quiz: "", questionsData: "" }));
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const quizSelected = allQuizzes.find(
                  (q) => q.quiz_name === value.quiz
                );
                if (!quizSelected) {
                  return;
                }

                const questionsToInsert = questionsParsed.parsed!.map(
                  (question) => ({
                    ...question,
                    quiz_id: quizSelected.id,
                  })
                );

                createQuestions(questionsToInsert);

                setValue((prev) => ({ ...prev, quiz: "", questionsData: "" }));

                await fetchData();
                closeOpenedDialog();
              }}
            >
              Upload
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div>
            Choose Quiz
            <SelectComponent
              placeholder="Select Quiz"
              onChange={(e) => {
                setValue((prev) => ({ ...prev, quiz: e }));
              }}
              options={allQuizzes?.map((quiz) => ({
                label: quiz.quiz_name,
                value: quiz.quiz_name,
              }))}
            />
          </div>
          <div>
            Enter Questions JSON
            <Textarea
              className="w-full h-48"
              value={value.questionsData}
              onChange={(e) =>
                setValue((prev) => ({ ...prev, questionsData: e.target.value }))
              }
            />
            {questionsParsed.error && value.questionsData && (
              <div className="text-red-500 mt-2">{questionsParsed.error}</div>
            )}
          </div>
        </>
      )}
    </DialogComponent>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  GetAllDataFunctionType,
  InsertNewDataFunctionType,
  EditDataFunctionType,
  DeleteDataFunctionType,
  SupabaseQuizType,
  SupabaseQuestionType,
} from "@/utils/supabase";
import { useEffect, useState } from "react";
import { QuizList } from "@/components/Molecules/Upload/Quiz/List";
import { QuestionsList } from "@/components/Molecules/Upload/Questions/List";

export type FetchDataType = () => Promise<void>;

export const ClientPage = ({
  getAllData,
  insertNewData,
  editData,
  deleteData,
}: {
  getAllData: GetAllDataFunctionType;
  insertNewData: InsertNewDataFunctionType;
  editData: EditDataFunctionType;
  deleteData: DeleteDataFunctionType;
}) => {
  const getAllDataFunction = async () => {
    const data = {
      quizzes: await getAllData<SupabaseQuizType>(
        "kotoba-quiz-list",
        undefined,
        { by: "quiz_name", ascending: true }
      ),
      questions: await getAllData<SupabaseQuestionType>(
        "kotoba-questions",
        "id, romaji, furigana, kanji, meaning, quiz_id, kotoba-quiz-list(quiz_name)",
        {
          by: "quiz_id",
          ascending: true,
        }
      ),
    };
    return data;
  };

  const [activePage, setActivePage] = useState<"quizzes" | "questions">(
    "questions"
  );

  const [allData, setAllData] = useState<{
    quizzes: SupabaseQuizType[];
    questions: SupabaseQuestionType[];
  }>({
    quizzes: [],
    questions: [],
  });

  const fetchData: FetchDataType = async () => {
    const { quizzes = [], questions = [] } = await getAllDataFunction();
    if (quizzes && questions) {
      setAllData({ questions, quizzes });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-5">
      <div className="flex gap-5 mb-5">
        <Button
          onClick={() => {
            setActivePage("questions");
          }}
          variant={activePage === "questions" ? "default" : "outline"}
        >
          Questions
        </Button>
        <Button
          onClick={() => {
            setActivePage("quizzes");
          }}
          variant={activePage === "quizzes" ? "default" : "outline"}
        >
          Quizzes
        </Button>
      </div>
      {activePage === "questions" && (
        <div>
          <QuestionsList
            editData={editData}
            deleteData={deleteData}
            fetchData={fetchData}
            allData={allData}
          />
        </div>
      )}
      {activePage === "quizzes" && (
        <QuizList
          insertNewData={insertNewData}
          editData={editData}
          deleteData={deleteData}
          fetchData={fetchData}
          allData={allData}
        />
      )}
    </div>
  );
};

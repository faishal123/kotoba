"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { QuizList } from "@/components/Molecules/Upload/Quiz/List";
import { QuestionsList } from "@/components/Molecules/Upload/Questions/List";
import { useGetQuestions } from "@/services/get-questions/useGetQuestions";
import { useGetQuizzes } from "@/services/get-quizzes/useGetQuizzes";
import { Spinner } from "@/components/ui/spinner";

export type FetchDataType = () => Promise<void>;

export const ClientPage = () => {
  const [activePage, setActivePage] = useState<"quizzes" | "questions">(
    "questions"
  );

  const {
    data: questions,
    refetch: refetchQuestions,
    isPending: fetchQuestionsPending,
  } = useGetQuestions();
  const {
    data: quizzes,
    refetch: refetchQuizzes,
    isPending: fetchQuizzesPending,
  } = useGetQuizzes();

  const fetchData: FetchDataType = async () => {
    refetchQuestions();
    refetchQuizzes();
  };

  const allData = { questions, quizzes };

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
      {fetchQuestionsPending || fetchQuizzesPending ? (
        <div className="w-full flex justify-center">
          <Spinner className="text-primary size-10" />
        </div>
      ) : (
        <>
          {activePage === "questions" && (
            <div>
              <QuestionsList fetchData={fetchData} allData={allData} />
            </div>
          )}
          {activePage === "quizzes" && (
            <QuizList fetchData={fetchData} allData={allData} />
          )}
        </>
      )}
    </div>
  );
};

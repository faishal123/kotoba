"use client";
import { useState } from "react";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { cn } from "@/lib/utils";
import { QuizFooter } from "@/components/Molecules/QuizFooter/QuizFooter";
import { QuestionType } from "@/constant/types";
import { ScoreScreen } from "@/components/Molecules/ScoreScreen/ScoreScreen";
import { QuizProgressBar } from "@/components/Molecules/QuizProgressBar/QuizProgressBar";

export const QuizScreen = ({
  questions,
  levelName,
  homeUrl,
}: {
  questions: QuestionType[];
  levelName: string;
  homeUrl: string;
}) => {
  const [state, setState] = useState<{
    correct: number;
    wrong: number;
    currentQuestionIndex: number;
    currentQuestionAnswered: boolean;
    chosenAnswerIndex: number;
  }>({
    correct: 0,
    wrong: 0,
    currentQuestionIndex: 0,
    currentQuestionAnswered: false,
    chosenAnswerIndex: -1,
  });

  const {
    correct,
    currentQuestionIndex,
    currentQuestionAnswered,
    chosenAnswerIndex,
  } = state;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={cn(["relative transition-all flex flex-col h-screen"])}>
      <QuizProgressBar
        totalQuestions={questions.length}
        currentQuestionIndex={currentQuestionIndex}
      />
      <ScoreScreen
        homeUrl={homeUrl}
        levelName={levelName}
        correct={correct}
        totalQuestions={questions.length}
        show={!currentQuestion}
      />
      {currentQuestion && (
        <div className="flex-1 flex flex-col gap-10 items-center justify-center">
          <div className="w-[195px] h-[230px] flex items-center justify-center bg-white border border-primary rounded-2xl text-8xl font-bold">
            {currentQuestion?.question}
          </div>
          <div className="flex gap-5">
            {currentQuestion?.answers.map((answer, i) => {
              return (
                <CardButton
                  variant={
                    currentQuestionAnswered && i === chosenAnswerIndex
                      ? answer.isCorrect
                        ? "correct"
                        : "wrong"
                      : "default"
                  }
                  onClick={
                    currentQuestionAnswered
                      ? undefined
                      : () => {
                          setState((prev) => ({
                            ...prev,
                            currentQuestionAnswered: true,
                            chosenAnswerIndex: i,
                            ...(answer.isCorrect
                              ? { correct: prev.correct + 1 }
                              : { wrong: prev.wrong + 1 }),
                          }));
                        }
                  }
                  key={`${currentQuestionIndex} ${answer.answer}`}
                >
                  {answer.answer?.toUpperCase()}
                </CardButton>
              );
            })}
          </div>
        </div>
      )}
      <QuizFooter
        show={currentQuestionAnswered}
        isAnswerCorrect={
          currentQuestion?.answers?.[chosenAnswerIndex]?.isCorrect
        }
        currentQuestion={currentQuestion}
        onClick={() => {
          setState((prev) => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
            currentQuestionAnswered: false,
            currentQuestionAnswerIsCorrect: false,
            chosenAnswerIndex: -1,
          }));
        }}
      />
    </div>
  );

  return null;
};

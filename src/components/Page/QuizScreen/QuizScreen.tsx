"use client";
import { useState } from "react";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { cn } from "@/lib/utils";
import { QuizFooter } from "@/components/Molecules/QuizFooter/QuizFooter";
import { AnswerType, QuestionType } from "@/constant/types";
import { ScoreScreen } from "@/components/Molecules/ScoreScreen/ScoreScreen";
import { QuizProgressBar } from "@/components/Molecules/QuizProgressBar/QuizProgressBar";
import { Card } from "@/components/Atoms/Card/Card";

export const QuizScreen = ({
  questions,
  levelName,
  homeUrl,
  questionClassName,
  answersContainerClassName,
  answerClassName,
  containerClassName,
}: {
  questions: QuestionType[];
  levelName: string;
  homeUrl: string;
  questionClassName?: string;
  answersContainerClassName?: string;
  answerClassName?: string;
  containerClassName?: string;
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

  const onClickAnswer = (answer: AnswerType, i: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionAnswered: true,
      chosenAnswerIndex: i,
      ...(answer.isCorrect
        ? { correct: prev.correct + 1 }
        : { wrong: prev.wrong + 1 }),
    }));
  };

  return (
    <div className={cn(["relative transition-all flex flex-col h-[100svh]"])}>
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
        <div
          className={cn([
            "flex-1 flex flex-col gap-10 items-center justify-center",
            containerClassName,
          ])}
        >
          <Card
            className={cn([
              "min-w-[195px] min-h-[230px] p-5 flex items-center justify-center text-8xl font-bold text-foreground",
              questionClassName,
            ])}
          >
            {currentQuestion?.question}
          </Card>
          <div className={cn(["flex gap-5", answersContainerClassName])}>
            {currentQuestion?.answers.map((answer, i) => {
              return (
                <CardButton
                  className={cn(["px-2 text-center", answerClassName])}
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
                          onClickAnswer(answer, i);
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

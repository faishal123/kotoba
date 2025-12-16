"use client";
import { useEffect, useState } from "react";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { cn } from "@/lib/utils";
import { QuizFooter } from "@/components/Molecules/QuizFooter/QuizFooter";
import { AnswerType, QuestionType } from "@/constant/types";
import { ScoreScreen } from "@/components/Molecules/ScoreScreen/ScoreScreen";
import { QuizProgressBar } from "@/components/Molecules/QuizProgressBar/QuizProgressBar";
import { Card } from "@/components/Atoms/Card/Card";
import { useQuizSound } from "@/utils/sound";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const QuizScreen = ({
  questions,
  levelName,
  homeUrl,
  questionClassName,
  answersContainerClassName,
  answerClassName,
  containerClassName,
  answerMethod = "multiple-choice",
  answerInputProps = {},
}: {
  questions: QuestionType[];
  levelName: string;
  homeUrl: string;
  questionClassName?: string;
  answersContainerClassName?: string;
  answerClassName?: string;
  containerClassName?: string;
  answerMethod?: "multiple-choice" | "input";
  answerInputProps?: React.ComponentProps<"input">;
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

  const { correctSound, wrongSound } = useQuizSound();

  const onClickAnswer = (answer: AnswerType, i: number) => {
    if (answer.isCorrect) {
      correctSound.play();
    } else {
      wrongSound.play();
    }
    setState((prev) => ({
      ...prev,
      currentQuestionAnswered: true,
      chosenAnswerIndex: i,
      ...(answer.isCorrect
        ? { correct: prev.correct + 1 }
        : { wrong: prev.wrong + 1 }),
    }));
  };

  const findAnswerInputElement = () => {
    return document.getElementById("answerInput") as
      | HTMLInputElement
      | null
      | undefined;
  };
  const findContinueButtonElement = () => {
    return document.getElementById("continueButton") as
      | HTMLDivElement
      | null
      | undefined;
  };

  const onInputAnswer = () => {
    const answerInputElement = findAnswerInputElement();
    if (answerInputElement) {
      const correctAnswerIndex = currentQuestion.answers.findIndex(
        (a) => a.isCorrect
      );
      const correctAnswerObject = currentQuestion.answers.find(
        (a) => a.isCorrect
      );
      const correctAnswer = correctAnswerObject?.answer;
      const answerValue = answerInputElement.value.trim();
      const isAnswerCorrect = answerValue === correctAnswer;
      onClickAnswer(
        { answer: answerValue, isCorrect: isAnswerCorrect },
        isAnswerCorrect ? correctAnswerIndex : correctAnswerIndex + 1
      );
    }
  };

  const onClickContinue = () => {
    correctSound.stop();
    wrongSound.stop();

    const answerInputElement = findAnswerInputElement();

    if (answerInputElement) {
      answerInputElement.value = "";
    }

    setState((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      currentQuestionAnswered: false,
      currentQuestionAnswerIsCorrect: false,
      chosenAnswerIndex: -1,
    }));
  };

  useEffect(() => {
    if (answerMethod === "input") {
      if (!state.currentQuestionAnswered) {
        const answerInputElement = findAnswerInputElement();
        if (answerInputElement) {
          answerInputElement.focus();
        }
      } else {
        const continueButtonElement = findContinueButtonElement();
        console.log("run", continueButtonElement);
        if (continueButtonElement) {
          continueButtonElement.focus();
        }
      }
    }
  }, [state.currentQuestionAnswered, answerMethod]);

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
            {answerMethod === "multiple-choice" &&
              currentQuestion?.answers.map((answer, i) => {
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
            {answerMethod === "input" && (
              <div className="flex gap-2">
                <Input
                  disabled={currentQuestionAnswered}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onInputAnswer();
                    }
                  }}
                  autoFocus
                  id="answerInput"
                  {...answerInputProps}
                />
                <Button
                  disabled={currentQuestionAnswered}
                  onClick={onInputAnswer}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <QuizFooter
        show={currentQuestionAnswered}
        isAnswerCorrect={
          currentQuestion?.answers?.[chosenAnswerIndex]?.isCorrect
        }
        currentQuestion={currentQuestion}
        onClickContinue={onClickContinue}
      />
    </div>
  );

  return null;
};

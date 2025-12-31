"use client";

import { SupabaseAvailableQuizViewType } from "@/utils/supabase";
import { Card } from "@/components/Atoms/Card/Card";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Atoms/Button/Button";
import { useRouter } from "next/navigation";

export const MixQuizSelector = ({
  quizList,
}: {
  quizList: SupabaseAvailableQuizViewType[];
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState<string[]>([]);
  const router = useRouter();
  return (
    <>
      {quizList?.map((quiz) => {
        const isSelected = selectedQuiz.includes(quiz.quiz_name);
        return (
          <Card
            key={quiz.id}
            onClick={() => {
              if (isSelected) {
                setSelectedQuiz((prev) =>
                  prev.filter((p) => p !== quiz.quiz_name)
                );
              } else {
                setSelectedQuiz((prev) => [...prev, quiz.quiz_name]);
              }
            }}
            className={cn([
              isSelected && "bg-primary/10 border-primary",
              "relative w-full h-full p-5 flex gap-5 items-center cursor-pointer transition-all",
            ])}
          >
            {isSelected && (
              <div className="absolute left-[-14px] bg-primary p-1 rounded-md">
                <CheckIcon color="white" size={20} />
              </div>
            )}
            <div>
              <div className="text-foreground text-lg font-bold">{quiz.quiz_name}</div>
              <div className="text-foreground text-lg">
                {quiz.description} ({quiz.question_count} Unique Questions)
              </div>
            </div>
          </Card>
        );
      })}
      {!!selectedQuiz.length && (
        <div className="fixed right-5 bottom-5">
          <Button
            onClick={() => {
              const urlSearchParams = new URLSearchParams();
              urlSearchParams.append("quizzes", selectedQuiz.join(","));
              router.push("/quiz/mix" + "?" + urlSearchParams.toString());
            }}
            label="Continue"
          ></Button>
        </div>
      )}
    </>
  );
};

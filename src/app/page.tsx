"use client";

import { useState } from "react";
import { Card } from "@/components/Atoms/Card/Card";
import { Header } from "@/components/Molecules/Header/Header";
import { characterChoices } from "@/constant/characterChoices";
import Link from "next/link";
import { MixQuizSelector } from "@/components/Molecules/MixQuizSelector/MixQuizSelector";
import { useAvailableQuizList } from "@/services/available-quiz-list/useAvailableQuizList";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const { data, isPending } = useAvailableQuizList();

  const quizWithQuestions = data?.filter(
    (quiz) =>
      quiz.question_count > 0 &&
      (quiz.quiz_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const trimmedSearchValue = searchValue.trim().toLowerCase();

  return (
    <>
      <Header
        showBackButton={false}
        customTitle="KOTOBA"
        customCharacter="言葉"
      />
      <div className="px-10 pt-5 pb-0">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
          <Input
            className="pl-10 bg-white"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            placeholder="Search Quiz"
          />
        </div>
      </div>
      <div className="p-10 pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {characterChoices
          .filter(
            (choice) =>
              choice.label.toLowerCase().includes(trimmedSearchValue) ||
              choice.description.toLowerCase().includes(trimmedSearchValue)
          )
          .map((choice) => (
            <Link key={choice.href} href={choice.href}>
              <Card className="w-full h-full p-5 flex gap-5 items-center">
                {/* <div className="text-4xl font-bold">{choice.character}</div> */}
                <div>
                  <div className="text-foreground text-lg font-bold">
                    {choice.label}
                  </div>
                  <div className="text-foreground text-lg">
                    {choice.description}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        {quizWithQuestions && <MixQuizSelector quizList={quizWithQuestions} />}
        {isPending && (
          <Card className="w-full h-full p-5 flex gap-5 items-center justify-center">
            <Spinner className="size-15 text-primary" />
          </Card>
        )}
      </div>
    </>
  );
}

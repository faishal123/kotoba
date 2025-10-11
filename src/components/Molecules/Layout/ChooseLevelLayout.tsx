"use client";

import { Button } from "@/components/Atoms/Button/Button";
import { CharacterChoices } from "../CharacterChoices/CharacterChoices";
import { Card } from "@/components/Atoms/Card/Card";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import Link from "next/link";
import { questionCountOptions } from "@/constant/common";
import { ReactNode, useEffect, useState } from "react";
import { useIsBreaking } from "@/utils/common";
import { cn } from "@/lib/utils";
import { CharacterChoicesMobile } from "../CharacterChoicesMobile/CharacterChoicesMobile";

type LevelType = {
  character: string;
  name: string;
  characters?: string[];
  href: string;
  description?: string;
};

export const LevelChoice = ({
  level,
  customTrigger,
}: {
  level: LevelType;
  customTrigger?: ReactNode;
}) => {
  const characters = level.characters || [];
  const { isBreakingXs } = useIsBreaking();
  return (
    <DialogComponent
      title="How many question ?"
      trigger={
        customTrigger ||
        (isBreakingXs ? (
          <Card className="flex gap-5 p-5 w-full text-foreground items-center">
            <div className="font-bold text-3xl min-w-[60px] text-center">
              {level.character}
            </div>
            <div className="flex-1 max-w-[calc(100vw-80px-40px-20px-60px)]">
              <div className="font-bold">{level.name}</div>
              <div>{characters?.join("") || level.description}</div>
            </div>
          </Card>
        ) : (
          <div className="flex items-center gap-5 cursor-pointer text-foreground hover:text-primary! transition-all sm:w-[395px]">
            <CardButton omitTextColor size={isBreakingXs ? "sm" : "lg"}>
              {level.character}
            </CardButton>
            <div className={cn(["w-[150px] xs:w-[245px] text-sm xs:text-lg"])}>
              <div className="font-bold">{level.name}</div>
              <div className="truncate w-full">
                {characters?.join("") || level.description}
              </div>
            </div>
          </div>
        ))
      }
    >
      <div className="flex gap-2 justify-around py-5">
        {questionCountOptions.map((option) => {
          return (
            <Link
              className="focus:outline-none"
              key={option}
              href={level.href + `?questions=${option}`}
            >
              <CardButton key={option}>{option}</CardButton>
            </Link>
          );
        })}
      </div>
    </DialogComponent>
  );
};

const AllCharactersLevelButton = ({
  className,
  allCharactersLevel,
}: Readonly<{
  className?: string;
  allCharactersLevel: LevelType;
}>) => {
  return (
    <LevelChoice
      level={allCharactersLevel}
      customTrigger={
        <Button
          className={className}
          label={`Take All ${
            allCharactersLevel.href.includes("katakana")
              ? "Katakana"
              : "Hiragana"
          } Characters Quiz`}
          variant="primary"
        />
      }
    />
  );
};

export const ChooseLevelLayout = ({
  choices,
  allCharactersLevel,
}: Readonly<{
  choices?: LevelType[];
  allCharactersLevel: LevelType;
}>) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);
  const { isBreakingXs, isBreakingSm } = useIsBreaking();

  if (!rendered) {
    return null;
  }

  return (
    <div className="relative flex pb-[calc(40px+126px)] sm:pb-10 p-10 gap-0 sm:gap-10 transition-all">
      <div className="flex flex-col gap-5 w-0 transition-all overflow-hidden sm:w-[250px]">
        <AllCharactersLevelButton
          allCharactersLevel={allCharactersLevel}
          className="w-[250px]"
        />
        <CharacterChoices />
      </div>
      <Card
        variant={isBreakingXs ? "plain" : "default"}
        className="p-0 xs:p-10 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center"
      >
        {(isBreakingSm || isBreakingXs) && (
          <AllCharactersLevelButton
            allCharactersLevel={allCharactersLevel}
            className="w-[230px] xs:w-[395px]"
          />
        )}
        {choices?.map((choice) => {
          return <LevelChoice level={choice} key={choice.name} />;
        })}
      </Card>
      <CharacterChoicesMobile />
    </div>
  );
};

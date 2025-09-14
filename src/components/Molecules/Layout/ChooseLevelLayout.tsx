"use client";

import { Button } from "@/components/Atoms/Button/Button";
import { CharacterChoices } from "../CharacterChoices/CharacterChoices";
import { Card } from "@/components/Atoms/Card/Card";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import Link from "next/link";
import { BREAKPOINTS, questionCountOptions } from "@/constant/common";
import { ReactNode, useEffect, useState } from "react";
import {
  remToPx,
  useBreakpointVars,
  useIsBreaking,
  useWindowSize,
} from "@/utils/common";
import { cn } from "@/lib/utils";
import { CharacterChoicesMobile } from "../CharacterChoicesMobile/CharacterChoicesMobile";

type LevelType = {
  character: string;
  name: string;
  characters?: string[];
  href: string;
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
        customTrigger || (
          <div className="flex items-center gap-5 cursor-pointer text-foreground hover:text-primary! transition-all sm:w-[395px]">
            <CardButton omitTextColor size={isBreakingXs ? "sm" : "lg"}>
              {level.character}
            </CardButton>
            <div className={cn(["w-[150px] xs:w-[245px] text-sm xs:text-lg"])}>
              <div className="font-bold">{level.name}</div>
              <div className="truncate w-full">{characters?.join("")}</div>
            </div>
          </div>
        )
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
  const { isBreakingXs } = useIsBreaking();

  if (!rendered) {
    return null;
  }

  return (
    <div className="relative flex p-10 gap-0 sm:gap-10 transition-all">
      <div className="flex flex-col gap-5 w-0 transition-all overflow-hidden sm:w-[250px]">
        <CharacterChoices />
        <LevelChoice
          level={allCharactersLevel}
          customTrigger={
            <Button
              className="w-[250px]"
              label={`Take All ${
                allCharactersLevel.href.includes("katakana")
                  ? "Katakana"
                  : "Hiragana"
              } Characters Quiz`}
              variant="primary"
            />
          }
        />
      </div>
      <Card
        variant={isBreakingXs ? "plain" : "default"}
        className="p-0 xs:p-10 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center"
      >
        {choices?.map((choice) => {
          return <LevelChoice level={choice} key={choice.name} />;
        })}
      </Card>
      <CharacterChoicesMobile />
    </div>
  );
};

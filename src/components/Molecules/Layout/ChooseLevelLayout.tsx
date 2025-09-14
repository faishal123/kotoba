import { Button } from "@/components/Atoms/Button/Button";
import { CharacterChoices } from "../CharacterChoices/CharacterChoices";
import { Card } from "@/components/Atoms/Card/Card";
import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import Link from "next/link";
import { questionCountOptions } from "@/constant/common";
import { ReactNode } from "react";

type LevelType = {
  character: string;
  name: string;
  characters?: string[];
  href: string;
};

export const LevelChoice = ({ level, customTrigger }: { level: LevelType; customTrigger?:ReactNode }) => {
  const characters = level.characters || [];
  return (
    <DialogComponent
      title="How many question ?"
      trigger={customTrigger ||
        <div className="flex items-center gap-5 cursor-pointer text-foreground hover:text-primary! transition-all">
          <CardButton omitTextColor size="lg">
            {level.character}
          </CardButton>
          <div className="text-lg max-w-[245px]">
            <div className="font-bold">{level.name}</div>
            <div className="truncate w-full">{characters?.join("")}</div>
          </div>
        </div>
      }
    >
      <div className="flex gap-2 justify-around py-5">
        {questionCountOptions.map((option) => {
          return (
            <Link className="focus:outline-none" key={option} href={level.href + `?questions=${option}`}>
              <CardButton key={option}>{option}</CardButton>
            </Link>
          );
        })}
      </div>
    </DialogComponent>
  );
};

export const LevelChoiceLayout = ({
  children,
  choices,
}: Readonly<{
  children?: React.ReactNode;
  choices?: LevelType[];
}>) => {
  return (
    <div className="flex p-10 gap-10">
      <div className="flex flex-col gap-5">
        <CharacterChoices />
        <LevelChoice />
        <Button label="Surprise Me" variant="secondary" />
      </div>
      <Card className="flex-1 p-10 grid grid-cols-2 gap-5">
        {choices?.map((choice) => {
          return <LevelChoice level={choice} key={choice.name} />;
        })}
        {children}
      </Card>
    </div>
  );
};

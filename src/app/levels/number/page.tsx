"use client";

import { Card } from "@/components/Atoms/Card/Card";
import { LevelChoice } from "@/components/Molecules/Layout/ChooseLevelLayout";
import { useIsBreaking } from "@/utils/common";

const numberLevelChoices = [
  {
    character: "よん",
    name: "Easy",
    href: "/quiz/number/easy",
    description: "Number in hiragana to romaji",
  },
  {
    character: "四",
    name: "Medium",
    href: "/quiz/number/medium",
    description: "Number in kanji to romaji",
  },
];

export default function Page() {
  const { isBreakingXs } = useIsBreaking();
  return (
    <Card
      variant={isBreakingXs ? "plain" : "default"}
      className="p-0 xs:p-10 flex-1 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center"
    >
      {numberLevelChoices.map((choice) => (
        <LevelChoice level={choice} key={choice.name} />
      ))}
    </Card>
  );
}

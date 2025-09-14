"use client";
import { Header } from "@/components/Molecules/Header/Header";
import { LevelChoiceLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";
import { hiraganaAndKatakanaLevelChoices } from "@/constant/common";

const hiraganaLevelChoices = hiraganaAndKatakanaLevelChoices.map((choice) => ({
  character: choice.characterHiragana,
  name: choice.name,
  characters: choice.charactersHiragana,
  href: `/hiragana/${choice.href}`,
}));

const HiraganaPage = () => {
  return (
    <>
      <Header />
      <LevelChoiceLayout choices={hiraganaLevelChoices} />
    </>
  );
};

export default HiraganaPage;

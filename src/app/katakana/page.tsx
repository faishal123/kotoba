"use client";
import { Header } from "@/components/Molecules/Header/Header";
import { LevelChoiceLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";
import { hiraganaAndKatakanaLevelChoices } from "@/constant/common";

const katakanaLevelChoices = hiraganaAndKatakanaLevelChoices.map((choice) => ({
  character: choice.characterKatakana,
  name: choice.name,
  characters: choice.charactersKatakana,
  href: `/katakana/${choice.href}`,
}));

const KatakanaPage = () => {
  return (
    <>
      <Header />
      <LevelChoiceLayout choices={katakanaLevelChoices} />
    </>
  );
};

export default KatakanaPage;

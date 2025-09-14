"use client";
import { Header } from "@/components/Molecules/Header/Header";
import { LevelChoiceLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";
import {
  allCharactersLevel,
  hiraganaAndKatakanaLevelChoices,
} from "@/constant/common";

const katakanaLevelChoices = hiraganaAndKatakanaLevelChoices.map((choice) => ({
  character: choice.characterKatakana,
  name: choice.name,
  characters: choice.charactersKatakana,
  href: `/katakana/${choice.href}`,
}));

const allLevel = {
  character: allCharactersLevel.characterKatakana,
  name: allCharactersLevel.name,
  characters: allCharactersLevel.charactersKatakana,
  href: `/katakana/${allCharactersLevel.href}`,
};

const KatakanaPage = () => {
  return (
    <>
      <Header />
      <LevelChoiceLayout
        allCharactersLevel={allLevel}
        choices={katakanaLevelChoices}
      />
    </>
  );
};

export default KatakanaPage;

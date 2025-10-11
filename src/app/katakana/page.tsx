"use client";
import { Header } from "@/components/Molecules/Header/Header";
import { ChooseLevelLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";
import { allCharactersLevel } from "@/constant/common";
import { hiraganaAndKatakanaLevelChoices } from "@/constant/hiraganaAndKatakanaLevelChoices";

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
      <ChooseLevelLayout
        allCharactersLevel={allLevel}
        choices={katakanaLevelChoices}
      />
    </>
  );
};

export default KatakanaPage;

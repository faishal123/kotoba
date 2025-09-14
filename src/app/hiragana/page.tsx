"use client";
import { Header } from "@/components/Molecules/Header/Header";
import { ChooseLevelLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";
import {
  allCharactersLevel,
  hiraganaAndKatakanaLevelChoices,
} from "@/constant/common";

const hiraganaLevelChoices = hiraganaAndKatakanaLevelChoices.map((choice) => ({
  character: choice.characterHiragana,
  name: choice.name,
  characters: choice.charactersHiragana,
  href: `/hiragana/${choice.href}`,
}));

const allLevel = {
  character: allCharactersLevel.characterHiragana,
  name: allCharactersLevel.name,
  characters: allCharactersLevel.charactersHiragana,
  href: `/hiragana/${allCharactersLevel.href}`,
};

const HiraganaPage = () => {
  return (
    <>
      <Header />
      <ChooseLevelLayout
        allCharactersLevel={allLevel}
        choices={hiraganaLevelChoices}
      />
    </>
  );
};

export default HiraganaPage;

import { hiraganaAndKatakanaLevelChoices } from "./hiraganaAndKatakanaLevelChoices";
import { hiraganaToRomaji } from "./hiraganaToRomaji";
import { katakanaToRomaji } from "./katakanaToRomaji";
import { LevelChoiceType } from "./types";

export enum BREAKPOINTS {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
}

export const questionCountOptions = [10, 30, 50];

export const hiraganaOnly = Object.keys(hiraganaToRomaji);

export const romajiToHiragana = Object.fromEntries(
  Object.entries(hiraganaToRomaji).map(([hiragana, romaji]) => [
    romaji,
    hiragana,
  ])
);

export const katakanaOnly = Object.keys(katakanaToRomaji);

export const romajiToKatakana = Object.fromEntries(
  Object.entries(katakanaToRomaji).map(([katakana, romaji]) => [
    romaji,
    katakana,
  ])
);

export const allCharactersLevel: LevelChoiceType =
  hiraganaAndKatakanaLevelChoices.reduce<LevelChoiceType>(
    (a, c) => {
      return {
        ...a,
        charactersHiragana: [...a.charactersHiragana, ...c?.charactersHiragana],
        charactersKatakana: [...a.charactersKatakana, ...c?.charactersKatakana],
      };
    },
    {
      characterKatakana: "あ",
      characterHiragana: "ア",
      name: `All Characters Set`,
      charactersHiragana: [],
      charactersKatakana: [],
      href: "all-set",
    }
  );

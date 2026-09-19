import {
  aGroup,
  haGroup,
  kaGroup,
  maGroup,
  naGroup,
  raGroup,
  saGroup,
  taGroup,
  waGroup,
  yaGroup,
} from "./hiraganaAndKatakanaGrouped";

export const hiraganaToRomaji: Record<string, string> = {
  ...aGroup.hiragana,
  ...kaGroup.hiragana,
  ...saGroup.hiragana,
  ...taGroup.hiragana,
  ...naGroup.hiragana,
  ...haGroup.hiragana,
  ...maGroup.hiragana,
  ...yaGroup.hiragana,
  ...raGroup.hiragana,
  ...waGroup.hiragana,
  ん: "n",
  ゃ: "small ya", // small ya
  ゅ: "small yu", // small yu
  ょ: "small yo", // small yo
  っ: "small tsu", // small tsu (used for double consonants)
  ー: "-", // long vowel mark
};

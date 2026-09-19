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
export const katakanaToRomaji: Record<string, string> = {
  ...aGroup.katakana,
  ...kaGroup.katakana,
  ...saGroup.katakana,
  ...taGroup.katakana,
  ...naGroup.katakana,
  ...haGroup.katakana,
  ...maGroup.katakana,
  ...yaGroup.katakana,
  ...raGroup.katakana,
  ...waGroup.katakana,
  ン: "n",
  ャ: "small ya", // small ya
  ュ: "small yu", // small yu
  ョ: "small yo", // small yo
  ッ: "small tsu", // small tsu (used for double consonants)
  ー: "-", // long vowel mark
};

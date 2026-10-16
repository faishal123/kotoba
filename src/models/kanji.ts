type Kana = {
  tags: string[];
  text: string;
  common: boolean;
  appliesToKanji: string[];
};

type KanjiObject = {
  tags: string[];
  text: string;
  common: boolean;
};

type Gloss = {
  lang: string;
  text: string;
  type: string | null;
  gender: string | null;
};

type Sense = {
  info: string[];
  misc: string[];
  field: string[];
  gloss: Gloss[];
  antonym: string[];
  dialect: string[];
  related: string[];
  examples: string[];
  partOfSpeech: string[];
  appliesToKana: string[];
  appliesToKanji: string[];
  languageSource: string[];
};

export type SupabaseKanjiType = {
  id: number;
  created_at: string;
  kana: Kana[];
  kanji: string;
  kanjiObject: KanjiObject;
  sense: Sense[];
};

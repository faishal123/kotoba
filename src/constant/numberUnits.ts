export type UnitType = {
  number: string;
  kanji: string;
  kana: string;
  isUnit?: boolean;
};

export const jyuuUnit: UnitType = {
  number: "10",
  kanji: "十",
  kana: "じゅう",
};

export const hyakuUnit: UnitType = {
  number: "100",
  kanji: "百",
  kana: "ひゃく",
};

export const senUnit: UnitType = {
  number: "1000",
  kanji: "千",
  kana: "せん",
};

export const manUnit: UnitType = {
  number: "10000",
  kanji: "万",
  kana: "まん",
  isUnit: true,
};

export const okuUnit: UnitType = {
  number: "100000000",
  kanji: "億",
  kana: "おく",
  isUnit: true,
};

export const chouUnit: UnitType = {
  number: "1000000000000",
  kanji: "兆",
  kana: "ちょう",
  isUnit: true,
};

export const keiUnit: UnitType = {
  number: "10000000000000000",
  kanji: "京",
  kana: "けい",
  isUnit: true,
};

export const basicNumberUnits: Record<string, UnitType> = {
  "1": {
    number: "1",
    kanji: "一",
    kana: "いち",
  },
  "2": {
    number: "2",
    kanji: "二",
    kana: "に",
  },
  "3": {
    number: "3",
    kanji: "三",
    kana: "さん",
  },
  "4": {
    number: "4",
    kanji: "四",
    kana: "よん",
  },
  "5": {
    number: "5",
    kanji: "五",
    kana: "ご",
  },
  "6": {
    number: "6",
    kanji: "六",
    kana: "ろく",
  },
  "7": {
    number: "7",
    kanji: "七",
    kana: "なな",
  },
  "8": {
    number: "8",
    kanji: "八",
    kana: "はち",
  },
  "9": {
    number: "9",
    kanji: "九",
    kana: "きゅう",
  },
};

export const numberUnits: UnitType[] = [
  ...Object.values(basicNumberUnits),
  jyuuUnit,
  hyakuUnit,
  {
    number: "300",
    kanji: "三百",
    kana: "さんびゃく",
  },
  {
    number: "600",
    kanji: "六百",
    kana: "ろっぴゃく",
  },
  {
    number: "800",
    kanji: "八百",
    kana: "はっぴゃく",
  },
  senUnit,
  {
    number: "3000",
    kanji: "三千",
    kana: "さんぜん",
  },
  {
    number: "8000",
    kanji: "八千",
    kana: "はっせん",
  },
  manUnit,
  {
    number: "10000000",
    kanji: "一千万",
    kana: "いっせんまん",
    isUnit: false,
  },
  okuUnit,
  chouUnit,
  {
    number: "1000000000000",
    kanji: "一兆",
    kana: "いっちょう",
  },
  {
    number: "8000000000000",
    kanji: "八兆",
    kana: "はっちょう",
  },
  {
    number: "10000000000000",
    kanji: "十兆",
    kana: "じゅっちょう",
  },
  {
    number: "1000000000000000",
    kanji: "一千兆",
    kana: "いっせんちょう",
  },
  keiUnit,
  {
    number: "10000000000000000",
    kanji: "一京",
    kana: "いっけい",
  },
  {
    number: "60000000000000000",
    kanji: "六京",
    kana: "ろっけい",
  },
  {
    number: "80000000000000000",
    kanji: "八京",
    kana: "はっけい",
  },
  {
    number: "100000000000000000",
    kanji: "十京",
    kana: "じゅっけい",
  },
  {
    number: "1000000000000000000",
    kanji: "百京",
    kana: "ひゃっけい",
  },
  {
    number: "10000000000000000000",
    kanji: "一千京",
    kana: "いっせんけい",
  },
];

export const biggestNumberAllowed = 99999999999999999999n;

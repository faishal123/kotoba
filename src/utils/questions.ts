import { LevelChoiceType } from "@/constant/types";
import { randomizeArray } from "./serverUtils";
import { hiraganaToRomaji } from "@/constant/hiraganaToRomaji";
import { katakanaToRomaji } from "@/constant/katakanaToRomaji";

export const generateShuffledQuestions = ({
  currentLevel,
  charactersKey,
  charactersToRomaji,
  questionsCount,
}: {
  currentLevel?: LevelChoiceType;
  charactersKey: "charactersHiragana" | "charactersKatakana";
  charactersToRomaji: Record<string, string>;
  questionsCount: number;
}) => {
  const currentLevelCharacters = currentLevel?.[charactersKey] || [];
  const currentLevelCharactersLength = currentLevelCharacters.length;
  const possibleAnswers = currentLevelCharacters.map((char) => {
    return charactersToRomaji[char];
  });

  const multiplyFactor = Math.ceil(
    questionsCount / currentLevelCharactersLength
  );

  const questions = Array.from(Array(multiplyFactor).keys()).flatMap(() => {
    return currentLevelCharacters;
  });

  const questionsShuffled = randomizeArray(
    questions.map((value) => ({ value }))
  ).map(({ value }) => {
    const correctAnswer = charactersToRomaji[value];
    const wrongAnswers = possibleAnswers
      .filter((answer) => answer !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const answers = [
      {
        answer: correctAnswer,
        isCorrect: true,
      },
      ...wrongAnswers.map((answer) => {
        return {
          answer: answer,
          isCorrect: false,
        };
      }),
    ]
      .map((value) => value)
      .sort(() => 0.5 - Math.random());
    return {
      question: value,
      answers: answers,
    };
  });

  questionsShuffled.length = questionsCount;

  return questionsShuffled;
};

export const breakDownKanji = ({
  originalText, kanaText
}: {
  originalText: string; kanaText: string;
}) => {
  const allHiraganaAndKatakana = [...Object.keys(hiraganaToRomaji), ...Object.keys(katakanaToRomaji)]

  let originalTextBrokenDown = originalText.split('').reduce<({
    text: string; isKanji: false;
  } | {
    text: string; isKanji: true; kana?: string;
  })[]>((a, c) => {
    const isNotKanji = allHiraganaAndKatakana.includes(c);
    const previousWords = a[a.length - 1 < 0 ? 0 : a.length - 1]

    const isTheSameType = isNotKanji === !previousWords?.isKanji;

    if (isTheSameType) {
      const removeLastItemFromAccumulator = a?.filter((w, i) => i !== a.length - 1)
      return [...removeLastItemFromAccumulator, { text: `${previousWords?.text || ""}${c}`, isKanji: !isNotKanji }]
    }
    return [...a, {
      text: c, isKanji: !isNotKanji
    }]
  }, [])

  let kanaTextOnlyBrokenDown = kanaText

  originalTextBrokenDown.forEach(item => {
    if (!item.isKanji) {
      kanaTextOnlyBrokenDown = kanaTextOnlyBrokenDown.replace(item.text, `|${item.text}|`)
    }
  })

  const kanaTextOnlyBrokenDownArray = kanaTextOnlyBrokenDown.split('|').filter(n => !!n)

  originalTextBrokenDown = originalTextBrokenDown.reduce<({
    text: string; isKanji: false;
  } | {
    text: string; isKanji: true; kana?: string;
  })[]>((a, c, i) => {
    if (c?.isKanji) {
      return [...a, { ...c, kana: kanaTextOnlyBrokenDownArray?.[i] }]
    }
    return [...a, c]
  }, [])

  return originalTextBrokenDown
}
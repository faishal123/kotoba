import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { allCharactersLevel, questionCountOptions } from "@/constant/common";
import { kaGroup } from "@/constant/hiraganaAndKatakanaGrouped";
import { hiraganaAndKatakanaLevelChoices } from "@/constant/hiraganaAndKatakanaLevelChoices";
import { hiraganaToRomaji } from "@/constant/hiraganaToRomaji";
import { katakanaToRomaji } from "@/constant/katakanaToRomaji";
import { QuestionType } from "@/constant/types";
import { generateShuffledQuestions } from "@/utils/questions";
import { generateRandomNumber, randomizeArray } from "@/utils/serverUtils";
import { getAllData, getCountOfATable } from "@/utils/supabase";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { level } = await params;
  const searchParamsResult = await searchParams;

  const allData = await getAllData<{
    kana: {
      text: string;
    }[];
    kanji: string;
  }>(`${level}-only-common-words`, "*", undefined, undefined);

  const allQuestionsRandomized = randomizeArray(allData || []);

  const possibleAnswers = allQuestionsRandomized?.map(
    (data) => data?.kana?.[0]?.text,
  );

  const questions = allQuestionsRandomized?.reduce<QuestionType[]>((a, c) => {
    const correctAnswer = c?.kana?.[0]?.text;
    const possibleWrongAnswers = possibleAnswers?.filter(
      (a) => a !== correctAnswer,
    );
    const firstWrongAnswerIndex = generateRandomNumber(
      0,
      possibleWrongAnswers?.length - 1,
    );
    let secondWrongAnswerIndex = firstWrongAnswerIndex + 1;
    if (secondWrongAnswerIndex >= possibleWrongAnswers.length) {
      secondWrongAnswerIndex = 0;
    }

    const answers = randomizeArray([
      {
        answer: correctAnswer,
        isCorrect: true,
      },
      {
        answer: possibleWrongAnswers[firstWrongAnswerIndex],
        isCorrect: false,
      },
      {
        answer: possibleWrongAnswers[secondWrongAnswerIndex],
        isCorrect: false,
      },
    ]);
    return [
      ...a,
      {
        question: c?.kanji,
        answers,
      },
    ];
  }, []);

  // const testString =
  //   "このインタビューのために時間を割いていただきありがとうございます";
  // const testStringKanaOnly =
  //   "このインタビューのためにじかんをさいていただきありがとうございます";

  const testString = "夕方お腹が空いたので、ちょっと間食をした";
  const testStringKanaOnly =
    "ゆうがたおなかがすいたので、ちょっとかんしょくをした";

  const allHiraganaAndKatakana = [
    ...Object.keys(hiraganaToRomaji),
    ...Object.keys(katakanaToRomaji),
    "、",
    "。",
  ];

  let testStringBrokenDown = testString.split("").reduce<
    (
      | {
          text: string;
          isKanji: false;
        }
      | {
          text: string;
          isKanji: true;
          kana?: string;
        }
    )[]
  >((a, c) => {
    const isNotKanji = allHiraganaAndKatakana.includes(c);
    const previousWords = a[a.length - 1 < 0 ? 0 : a.length - 1];

    const isTheSameType = isNotKanji === !previousWords?.isKanji;
    if (isTheSameType) {
      const removeLastItemFromAccumulator = a?.filter(
        (w, i) => i !== a.length - 1,
      );

      return [
        ...removeLastItemFromAccumulator,
        { text: `${previousWords?.text || ""}${c}`, isKanji: !isNotKanji },
      ];
    }
    return [
      ...a,
      {
        text: c,
        isKanji: !isNotKanji,
      },
    ];
  }, []);

  let testStringKanaOnlyBrokenDown = testStringKanaOnly;

  testStringBrokenDown.forEach((item) => {
    if (!item.isKanji) {
      console.log(item);
      // this "replace" will replace the first instance, we need to use index instead to somehow replace the correct character
      testStringKanaOnlyBrokenDown = testStringKanaOnlyBrokenDown.replace(
        item.text,
        `|${item.text}|`,
      );
    }
  });
  console.log(testStringKanaOnlyBrokenDown)
  const testStringKanaOnlyBrokenDownArray = testStringKanaOnlyBrokenDown
    .split("|")
    .filter((n) => !!n);

  testStringBrokenDown = testStringBrokenDown.reduce<
    (
      | {
          text: string;
          isKanji: false;
        }
      | {
          text: string;
          isKanji: true;
          kana?: string;
          index?: number;
        }
    )[]
  >((a, c, i) => {
    if (c?.isKanji) {
      return [
        ...a,
        { ...c, kana: testStringKanaOnlyBrokenDownArray?.[i], index: i },
      ];
    }
    return [...a, c];
  }, []);

  const kanjiOnly = testStringBrokenDown.filter((item) => item.isKanji);
  const kanjiOnlyCount = kanjiOnly?.length || 0;
  const randomKanjiIndex = generateRandomNumber(0, kanjiOnlyCount - 1);
  const randomKanji = kanjiOnly?.[randomKanjiIndex];
  const randomKanjiKanaLength = randomKanji?.kana?.length || 0;
  const randomCharacterIndex = generateRandomNumber(
    0,
    randomKanjiKanaLength - 1,
  );
  const randomCharacter = randomKanji?.kana?.[randomCharacterIndex];

  console.log({
    testString,
    testStringKanaOnly,
    testStringBrokenDown,
    kanjiOnly,
    randomKanji,
    randomCharacter,
  });

  // console.log(Object.keys(kaGroup.hiragana))

  return JSON.stringify({
    testStringBrokenDown,
    testString: testString.split(""),
  });

  return (
    <QuizScreen
      questionClassName="text-5xl xs:text-8xl"
      answerClassName="text-xl xs:text-3xl"
      answersContainerClassName="flex-col xs:flex-row"
      containerClassName="pt-[168px] pb-[140px] xs:pt-0 xs:pb-0"
      homeUrl="/kanji"
      levelName={`Kanji ${level.toUpperCase()}`}
      questions={questions}
    />
  );
}

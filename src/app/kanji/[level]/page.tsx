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

  const count = await getCountOfATable(`contain-${level}-common-words`);

  const randomStart = generateRandomNumber(0, count);
  const questionsCount = 10;

  const allData = await getAllData<{
    kana: {
      text: string;
    }[];
    kanji: string;
  }>(
    `randomized-contain-${level}-common-words`,
    "*",
    undefined,
    undefined,
    {
      limit: questionsCount,
      offset: randomStart,
    },
    true,
  );

  const allQuestionsRandomized = randomizeArray(allData || []);

  const possibleAnswers = allQuestionsRandomized?.reduce((a1, c1) => {
    return [
      ...a1,
      c1?.sense?.reduce((a, c) => {
        const applicableGloss = c?.gloss?.reduce((a2, c2) => {
          if (c2.lang === "eng") {
            return [...a2, c2.text];
          }
          return a2;
        }, []);
        return [...a, applicableGloss?.[0]];
      }, [])?.[0],
    ];
  }, []);

  console.log(possibleAnswers, allQuestionsRandomized);

  const questions = allQuestionsRandomized?.reduce<QuestionType[]>((a, c) => {
    const correctAnswer = c?.sense?.[0]?.gloss?.[0]?.text;
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
        question: (
          <ruby>
            {c?.kanji}
            <rt>{c?.kana?.[0]?.text}</rt>
          </ruby>
        ),
        answers,
      },
    ];
  }, []);

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

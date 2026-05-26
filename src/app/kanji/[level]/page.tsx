import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import { allCharactersLevel, questionCountOptions } from "@/constant/common";
import { hiraganaAndKatakanaLevelChoices } from "@/constant/hiraganaAndKatakanaLevelChoices";
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
            text: string
        }[];
        kanji: string
    }>(`${level}-only-common-words`, '*', undefined, undefined);

    const allQuestionsRandomized = randomizeArray(allData || []);

    const possibleAnswers = allQuestionsRandomized?.map(data => data?.kana?.[0]?.text);

    const questions = allQuestionsRandomized?.reduce<QuestionType[]>((a, c) => {
        const correctAnswer = c?.kana?.[0]?.text;
        const possibleWrongAnswers = possibleAnswers?.filter(a => a !== correctAnswer);
        const firstWrongAnswerIndex = generateRandomNumber(0, possibleWrongAnswers?.length - 1);
        let secondWrongAnswerIndex = firstWrongAnswerIndex + 1;
        if (secondWrongAnswerIndex >= possibleWrongAnswers.length) {
            secondWrongAnswerIndex = 0;
        }

        const answers = randomizeArray([
            {
                answer: correctAnswer,
                isCorrect: true
            },
            {
                answer: possibleWrongAnswers[firstWrongAnswerIndex],
                isCorrect: false
            }, {
                answer: possibleWrongAnswers[secondWrongAnswerIndex],
                isCorrect: false
            }
        ]);
        return [...a, {
            question: c?.kanji,
            answers
        }];
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

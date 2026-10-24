"use client";

import {
  hiraganaGrouped,
  hiraganaWithGroup,
} from "@/constant/hiraganaAndKatakanaGrouped";
import { AnswerType } from "@/constant/types";
import { SentenceWord } from "@/models/sentence";
import { useGetSentences } from "@/services/get-sentences/useGetSentences";
import { generateRandomNumber, randomizeArray } from "@/utils/serverUtils";
import { QuizScreen } from "../QuizScreen/QuizScreen";
import { Spinner } from "@/components/ui/spinner";

interface JSONsType extends SentenceWord {
  isKanji: boolean;
  indexInSentence: number;
}

export const SentenceQuizScreen = () => {
  const { data } = useGetSentences();
  const questions = data?.map((d) => {
    const { jsonsWithKanjiIndicator, kanjiOnly } = d?.sentence_json?.reduce<{
      jsonsWithKanjiIndicator: JSONsType[];
      kanjiOnly: JSONsType[];
    }>(
      (a, c, i) => {
        if (!!c.furigana && c?.furigana !== c?.japanese) {
          return {
            jsonsWithKanjiIndicator: [
              ...a?.jsonsWithKanjiIndicator,
              {
                ...c,
                isKanji: true,
                indexInSentence: i,
              },
            ],
            kanjiOnly: [
              ...a?.kanjiOnly,
              {
                ...c,
                isKanji: true,
                indexInSentence: i,
              },
            ],
          };
        }
        return {
          kanjiOnly: a?.kanjiOnly,
          jsonsWithKanjiIndicator: [
            ...a?.jsonsWithKanjiIndicator,
            {
              ...c,
              isKanji: false,
              indexInSentence: i,
            },
          ],
        };
      },
      { jsonsWithKanjiIndicator: [], kanjiOnly: [] },
    );

    const kanjiOnlyLength = kanjiOnly?.length;
    const randomKanjiIndex = generateRandomNumber(0, kanjiOnlyLength - 1);
    const randomKanji = kanjiOnly?.[randomKanjiIndex];
    const furigana = randomKanji?.furigana;
    const furiganaSplitted = furigana?.split("") || [];

    const allHiragana = Object.values(hiraganaGrouped).reduce<string[]>(
      (a, c) => {
        return [...a, ...Object.keys(c)];
      },
      [],
    );

    const chooseNewCharacter = () => {
      const index = generateRandomNumber(0, furiganaSplitted.length - 1);
      const randomCharacter = furiganaSplitted?.[index];
      const randomCharacterIsntHiragana =
        !allHiragana?.includes(randomCharacter);

      return {
        index,
        randomCharacter,
        isHiragana: !randomCharacterIsntHiragana,
      };
    };

    const randomCharacterArray = [chooseNewCharacter()];

    while (!randomCharacterArray?.[0].isHiragana) {
      randomCharacterArray[0] = chooseNewCharacter();
    }

    const randomCharacterObject = randomCharacterArray?.[0];
    const randomCharacter = randomCharacterObject?.randomCharacter;
    const randomCharacterGroup = hiraganaWithGroup?.[randomCharacter]?.group;
    const fullGroup = hiraganaGrouped?.[randomCharacterGroup];
    const otherGroupMembers = Object.keys(fullGroup)?.filter(
      (c) => c !== randomCharacter,
    );

    const findAlternative = (otherIndex?: number) => {
      let randomAlternativeIndex = generateRandomNumber(
        0,
        otherGroupMembers.length - 1,
      );

      while (randomAlternativeIndex === otherIndex) {
        randomAlternativeIndex = generateRandomNumber(
          0,
          otherGroupMembers.length - 1,
        );
      }

      const randomAlternative: {
        hiragana: string;
        index: number;
        romaji?: string;
      } = {
        hiragana: otherGroupMembers?.[randomAlternativeIndex],
        index: randomAlternativeIndex,
      };
      randomAlternative.romaji = fullGroup?.[randomAlternative?.hiragana];

      return randomAlternative;
    };

    const alternativeCharacters = [findAlternative()];
    if (otherGroupMembers.length > 1) {
      alternativeCharacters.push(
        findAlternative(alternativeCharacters?.[0]?.index),
      );
    }

    const wrongAnswers = alternativeCharacters?.reduce<AnswerType[]>((a, c) => {
      const wrongAnswer = [...furiganaSplitted];
      wrongAnswer[randomCharacterObject?.index] = c.hiragana;
      return [
        ...a,
        {
          answer: wrongAnswer.join(""),
          isCorrect: false,
        },
      ];
    }, []);

    const answers: AnswerType[] = randomizeArray([
      ...wrongAnswers,
      {
        answer: furigana || "",
        isCorrect: true,
      },
    ]);

    const question = {
      question: (
        <div>
          {jsonsWithKanjiIndicator.map((json, i) => {
            if (i === randomKanji?.indexInSentence) {
              return (
                <span
                  key={JSON.stringify(json)}
                  className="text-primary border-b-10 border-primary"
                >
                  {json.japanese}
                </span>
              );
            }
            return <span key={JSON.stringify(json)}>{json.japanese}</span>;
          })}
        </div>
      ),
      answers,
    };

    return question;
  });

  if (!questions) {
    return <Spinner />;
  }
  return (
    <QuizScreen
      questionClassName="text-5xl xs:text-8xl"
      answerClassName="text-xl xs:text-3xl"
      answersContainerClassName="flex-col xs:flex-row"
      containerClassName="pt-[168px] pb-[140px] xs:pt-0 xs:pb-0"
      homeUrl="/kanji"
      levelName={`Sentence`}
      questions={questions}
    />
  );
};

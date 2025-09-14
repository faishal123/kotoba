import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import {
  allCharactersLevel,
  hiraganaAndKatakanaLevelChoices,
  hiraganaToRomaji,
  questionCountOptions,
} from "@/constant/common";
import { generateShuffledQuestions } from "@/utils/common";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { level } = await params;
  const searchParamsResult = await searchParams;
  let questionsCount = Number(searchParamsResult?.questions || "10");

  let currentLevel = hiraganaAndKatakanaLevelChoices.find(
    (choice) => choice.href === level
  );

  if (level === "all-set") {
    currentLevel = allCharactersLevel;
  }

  const levelName = `Hiragana ${currentLevel?.name || ""}`;

  if (!questionCountOptions.includes(questionsCount)) {
    questionsCount = 10;
  }
  const charactersKey = "charactersHiragana";
  const charactersToRomaji = hiraganaToRomaji;

  const questionsShuffled = generateShuffledQuestions({
    currentLevel,
    charactersKey,
    charactersToRomaji,
    questionsCount,
  });

  console.log(
    "sini oi",
    currentLevel,
    charactersKey,
    charactersToRomaji,
    questionsCount,
    questionsShuffled
  );

  return (
    <QuizScreen
      homeUrl="/hiragana"
      levelName={levelName}
      questions={questionsShuffled}
    />
  );
}

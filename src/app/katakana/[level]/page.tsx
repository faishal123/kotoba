import { QuizScreen } from "@/components/Page/QuizScreen/QuizScreen";
import {
  allCharactersLevel,
  hiraganaAndKatakanaLevelChoices,
  katakanaToRomaji,
  questionCountOptions,
} from "@/constant/common";
import { generateShuffledQuestions } from "@/utils/questions";

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

  const levelName = `Katakana ${currentLevel?.name || ""}`;

  if (!questionCountOptions.includes(questionsCount)) {
    questionsCount = 10;
  }
  const charactersKey = "charactersKatakana";
  const charactersToRomaji = katakanaToRomaji;

  const questionsShuffled = generateShuffledQuestions({
    currentLevel,
    charactersKey,
    charactersToRomaji,
    questionsCount,
  });

  return (
    <QuizScreen
      homeUrl="/katakana"
      levelName={levelName}
      questions={questionsShuffled}
    />
  );
}

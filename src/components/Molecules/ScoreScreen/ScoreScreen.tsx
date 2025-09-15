import { Button } from "@/components/Atoms/Button/Button";
import { Card } from "@/components/Atoms/Card/Card";
import Image from "next/image";
import hiraganaScoreImage from "@/assets/hiragana-score.png";
import katakanaScoreImage from "@/assets/katakana-score.png";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const defineImage = (homeUrl: string) => {
  if (homeUrl.includes("katakana")) {
    return katakanaScoreImage;
  }
  if (homeUrl.includes("hiragana")) {
    return hiraganaScoreImage;
  }
};

export const ScoreScreen = ({
  show,
  correct,
  totalQuestions,
  levelName,
  homeUrl,
}: {
  show?: boolean;
  correct: number;
  totalQuestions: number;
  levelName: string;
  homeUrl: string;
}) => {
  const router = useRouter();

  const imageToShow = defineImage(homeUrl);
  return (
    <div
      className={cn([
        "absolute duration-[500ms] transition-all overflow-hidden h-[100svh] bg-primary right-0",
        show ? "w-screen" : "w-0",
        "flex justify-center flex-col gap-5 items-center",
      ])}
    >
      <Card className="p-5 relative flex flex-col gap-3 items-center justify-center min-w-[250px] min-h-[250px]">
        {imageToShow && (
          <Image
            className="absolute left-[-20px] top-[-135px]"
            src={imageToShow}
            alt="hiragana-score"
            width={350}
          />
        )}
        <Card className="shadow-none! p-3 text-foreground">{levelName}</Card>
        <div className="font-bold text-6xl xs:text-8xl text-foreground">
          {correct}/{totalQuestions}
        </div>
      </Card>
      <div className="flex gap-5 items-center">
        <Button
          onClick={() => window.location.reload()}
          variant="secondary"
          label="Try Again"
        />
        <Button
          onClick={() => router.push(homeUrl)}
          variant="secondary"
          label="Back to Home"
        />
      </div>
    </div>
  );
};

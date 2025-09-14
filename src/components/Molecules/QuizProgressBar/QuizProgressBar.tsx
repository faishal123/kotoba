import { Button } from "@/components/Atoms/Button/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const QuizProgressBar = ({
  totalQuestions,
  currentQuestionIndex,
}: {
  totalQuestions: number;
  currentQuestionIndex: number;
}) => {
  const router = useRouter();

  let currentQuestion = currentQuestionIndex;
  if (currentQuestion > totalQuestions) {
    currentQuestion = totalQuestions;
  }

  return (
    <div className="bg-primary gap-10 p-10 flex justify-between items-center absolute top-0 w-screen">
      <Button
        onClick={() => router.back()}
        label={<ArrowLeft width={30} height={30} />}
        className="p-0 size-12 rounded-full flex justify-center items-center"
        variant="secondary"
      />
      <div className="relative flex flex-1 items-center gap-2">
        <div className="text-white font-bold text-lg">
          {currentQuestion}/{totalQuestions}
        </div>
        <div className="right-0 p-5 bg-white size-5 rounded-full flex justify-center items-center absolute">⭐</div>
        <div className="flex-1 overflow-hidden h-4 rounded-full bg-white">
          <div
            style={{
              width: `${(currentQuestionIndex / totalQuestions) * 100}%`,
            }}
            className="transition-all h-full rounded-full bg-green-secondary"
          ></div>
        </div>
      </div>
    </div>
  );
};

import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { QuestionType } from "@/constant/types";
import { cn } from "@/lib/utils";
import { useIsBreaking } from "@/utils/common";
import { ArrowRight } from "lucide-react";

export const QuizFooter = ({
  show,
  isAnswerCorrect,
  onClickContinue,
  currentQuestion,
}: {
  show?: boolean;
  isAnswerCorrect?: boolean;
  onClickContinue?: () => void;
  currentQuestion?: QuestionType;
}) => {
  const { isBreakingXs, isBreakingSm } = useIsBreaking();
  return (
    <div
      className={cn([
        show
          ? "h-[100px] sm:h-[120px] overflow-hidden"
          : "h-0 overflow-hidden border-none",
        "fixed bottom-0 transition-all w-full flex justify-center items-center border-primary border bg-white",
      ])}
    >
      {show && (
        <CardButton
          onClick={onClickContinue}
          variant={isAnswerCorrect ? "correct" : "wrong"}
          className="px-5 gap-2"
          size={isBreakingXs ? "xs" : isBreakingSm ? "sm" : "sm"}
        >
          {isAnswerCorrect ? (
            <div>Continue</div>
          ) : (
            <div>
              Correct answer is &quot;
              {currentQuestion?.answers
                .find((answer) => answer.isCorrect)
                ?.answer.toUpperCase()}
              &quot;
            </div>
          )}
          <ArrowRight className="xs:size-8 md:size-10" />
        </CardButton>
      )}
    </div>
  );
};

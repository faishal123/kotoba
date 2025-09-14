import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { QuestionType } from "@/constant/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const QuizFooter = ({
  show,
  isAnswerCorrect,
  onClick,
  currentQuestion,
}: {
  show?: boolean;
  isAnswerCorrect?: boolean;
  onClick?: () => void;
  currentQuestion?: QuestionType;
}) => {
  return (
    <div
      className={cn([
        show ? "h-[160px] overflow-hidden" : "h-0 overflow-hidden",
        "absolute bottom-0 transition-all w-full flex justify-center items-center border-primary border bg-white rounded-2xl",
      ])}
    >
      {show && (
        <CardButton
          onClick={onClick}
          variant={isAnswerCorrect ? "correct" : "wrong"}
          className="px-5 gap-2"
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
          <ArrowRight height={40} width={40} />
        </CardButton>
      )}
    </div>
  );
};

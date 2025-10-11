import { HeaderBackButton } from "../Header/BackButton";

export const QuizProgressBar = ({
  totalQuestions,
  currentQuestionIndex,
}: {
  totalQuestions: number;
  currentQuestionIndex: number;
}) => {
  let currentQuestion = currentQuestionIndex;
  if (currentQuestion > totalQuestions) {
    currentQuestion = totalQuestions;
  }

  return (
    <div className="bg-primary gap-10 p-10 flex justify-between items-center absolute top-0 w-screen">
      <HeaderBackButton />
      <div className="relative flex flex-1 items-center gap-2">
        <div className="text-white font-bold text-lg">
          {currentQuestion}/{totalQuestions}
        </div>
        {/* <div className="right-0 p-5 bg-white size-5 rounded-full flex justify-center items-center absolute">⭐</div> */}
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

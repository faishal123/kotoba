import { QuestionToUploadType } from "@/utils/supabase";

export const createQuestions = async (questions: QuestionToUploadType[]) => {
  return fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questions }),
  });
};

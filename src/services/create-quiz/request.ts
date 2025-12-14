import { QuizToUploadType } from "@/utils/supabase";

export const createQuiz = async (quiz: QuizToUploadType) => {
  const res = await fetch("/api/quizzes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quiz }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`${e}`);
  }

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

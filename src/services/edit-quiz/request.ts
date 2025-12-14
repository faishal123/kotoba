import { QuizToEditType } from "@/utils/supabase";

export const editQuiz = async (quiz: QuizToEditType) => {
  const res = await fetch("/api/quizzes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/jsonn",
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

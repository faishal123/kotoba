import { QuestionToUploadType } from "@/utils/supabase";

export const createQuestions = async (questions: QuestionToUploadType[]) => {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ questions }),
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

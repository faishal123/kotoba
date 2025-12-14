import { QuestionToEditType } from "@/utils/supabase";

export const editQuestion = async (question: QuestionToEditType) => {
  const res = await fetch("/api/questions", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
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

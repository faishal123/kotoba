import { SentenceToUploadType } from "@/utils/supabase";

export const createSentence = async (sentence: SentenceToUploadType) => {
  const res = await fetch("/api/sentences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sentence }),
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

export const deleteQuiz = async (id: string) => {
  const res = await fetch(`/api/quizzes?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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

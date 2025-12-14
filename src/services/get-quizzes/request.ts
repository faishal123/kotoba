export const getQuizzes = async () => {
  const res = await fetch("/api/quizzes");
  const data = await res.json();
  return data.data;
};

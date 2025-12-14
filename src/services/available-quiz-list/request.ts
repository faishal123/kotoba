export const fetchAvailableQuizList = async () => {
  const res = await fetch("/api/available-quiz-list");
  const data = await res.json();
  return data.data;
};

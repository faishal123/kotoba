export const getQuestions = async () => {
  const res = await fetch("/api/questions");
  const data = await res.json();
  return data.data;
};

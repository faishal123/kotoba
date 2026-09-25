export const getSentences = async () => {
  const res = await fetch("/api/sentences");
  const data = await res.json();
  return data.data;
};

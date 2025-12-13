export const deleteQuestion = async (id: string) => {
  return fetch(`/api/questions?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

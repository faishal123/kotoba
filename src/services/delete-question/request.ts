export const deleteQuestion = async (id: string) => {
  const res = await fetch(`/api/questions?id=${id}`, {
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

import { useMutation } from "@tanstack/react-query";
import { deleteQuestion } from "./request";

export const useDeleteQuestion = () => {
  return useMutation({
    mutationFn: deleteQuestion,
  });
};

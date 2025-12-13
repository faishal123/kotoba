import { useMutation } from "@tanstack/react-query";
import { createQuestions } from "./request";

export const useCreateQuestions = () => {
  return useMutation({
    mutationFn: createQuestions,
  });
};

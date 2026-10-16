import { SupabaseQuestionType } from "@/models/question";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "./request";

export const useGetQuestions = () => {
  return useQuery<SupabaseQuestionType[]>({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
};

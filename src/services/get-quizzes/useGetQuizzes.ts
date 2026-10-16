import { SupabaseQuizType } from "@/models/quiz";
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "./request";

export const useGetQuizzes = () => {
  return useQuery<SupabaseQuizType[]>({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });
};

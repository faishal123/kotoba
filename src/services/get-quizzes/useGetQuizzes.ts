import { SupabaseQuizType } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "./request";

export const useGetQuizzes = () => {
  return useQuery<SupabaseQuizType[]>({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });
};

import { SupabaseQuestionType } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "./request";

export const useGetQuestions = () => {
  return useQuery<SupabaseQuestionType[]>({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
};

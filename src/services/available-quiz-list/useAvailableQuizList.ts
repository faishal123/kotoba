import { SupabaseAvailableQuizViewType } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailableQuizList } from "./request";

export const useAvailableQuizList = () => {
  return useQuery<SupabaseAvailableQuizViewType[]>({
    queryKey: ["available-quiz-list"],
    queryFn: fetchAvailableQuizList,
  });
};

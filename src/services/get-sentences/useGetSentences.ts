import { SupabaseSentenceType } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { getSentences } from "./request";

export const useGetSentences = () => {
  return useQuery<SupabaseSentenceType[]>({
    queryKey: ["sentences"],
    queryFn: getSentences,
  });
};

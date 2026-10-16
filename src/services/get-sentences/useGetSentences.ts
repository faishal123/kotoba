import { SupabaseSentenceType } from "@/models/sentence";
import { useQuery } from "@tanstack/react-query";
import { getSentences } from "./request";

export const useGetSentences = () => {
  return useQuery<SupabaseSentenceType[]>({
    queryKey: ["sentences"],
    queryFn: getSentences,
  });
};

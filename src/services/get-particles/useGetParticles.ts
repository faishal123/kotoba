import { SupabaseParticleType } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { getParticles } from "./request";

export const useGetParticles = () => {
  return useQuery<SupabaseParticleType[]>({
    queryKey: ["particles"],
    queryFn: getParticles,
  });
};

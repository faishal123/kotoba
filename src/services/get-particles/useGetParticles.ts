import { useQuery } from "@tanstack/react-query";
import { getParticles } from "./request";
import { SupabaseParticleType } from "@/models/particle";

export const useGetParticles = () => {
  return useQuery<SupabaseParticleType[]>({
    queryKey: ["particles"],
    queryFn: getParticles,
  });
};

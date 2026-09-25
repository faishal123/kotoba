import { SupabaseParticleType } from "@/utils/supabase";

export const editParticle = async (particle: SupabaseParticleType) => {
  const res = await fetch("/api/particles", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ particle }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`${e}`);
  }

  return data;
};

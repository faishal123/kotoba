import { ParticleToUploadType } from "@/utils/supabase";

export const createParticle = async (particle: ParticleToUploadType) => {
  const res = await fetch("/api/particles", {
    method: "POST",
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

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

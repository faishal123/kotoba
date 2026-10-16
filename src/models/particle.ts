export type SupabaseParticleType = {
  id: string;
  created_at?: string;
  japanese: string;
  romaji: string;
  english?: string;
};

export type ParticleToUploadType = Omit<
  SupabaseParticleType,
  "created_at" | "id"
>;

export type ParticleToEditType = Omit<SupabaseParticleType, "created_at">;

export const getParticles = async () => {
  const res = await fetch("/api/particles");
  const data = await res.json();
  return data.data;
};

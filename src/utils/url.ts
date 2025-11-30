import { useSearchParams } from "next/navigation";

export const useMutableSearchParams = () => {
  const searchParams = useSearchParams();
  const mutableSearchParams = new URLSearchParams(searchParams.toString());
  return mutableSearchParams;
};

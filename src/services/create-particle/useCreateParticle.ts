import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { createParticle } from "./request";
import { ParticleToUploadType } from "@/utils/supabase";

export const useCreateParticle = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: ParticleToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: ParticleToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: createParticle,
    onError,
    onSuccess,
  });
};

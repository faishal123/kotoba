import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { editParticle } from "./request";
import { ParticleToEditType } from "@/utils/supabase";

export const useEditParticle = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: ParticleToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: ParticleToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: editParticle,
    onSuccess,
    onError,
  });
};

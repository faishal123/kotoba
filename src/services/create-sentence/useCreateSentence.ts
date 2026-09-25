import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { createSentence } from "./request";
import { SentenceToUploadType } from "@/utils/supabase";

export const useCreateSentence = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: SentenceToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: SentenceToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: createSentence,
    onError,
    onSuccess,
  });
};

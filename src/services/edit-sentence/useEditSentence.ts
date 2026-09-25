import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { editSentence } from "./request";
import { SentenceToEditType } from "@/utils/supabase";

export const useEditSentence = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: SentenceToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: SentenceToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: editSentence,
    onSuccess,
    onError,
  });
};

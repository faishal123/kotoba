import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { createQuestions } from "./request";
import { QuestionToUploadType } from "@/utils/supabase";

export const useCreateQuestions = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: QuestionToUploadType[],
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: QuestionToUploadType[],
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: createQuestions,
    onError,
    onSuccess,
  });
};

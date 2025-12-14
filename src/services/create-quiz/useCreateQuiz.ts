import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { createQuiz } from "./request";
import { QuizToUploadType } from "@/utils/supabase";

export const useCreateQuiz = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: QuizToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: QuizToUploadType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: createQuiz,
    onSuccess,
    onError,
  });
};

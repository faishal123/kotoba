import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { editQuiz } from "./request";
import { QuizToEditType } from "@/utils/supabase";

export const useEditQuiz = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: QuizToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: QuizToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: editQuiz,
    onError,
    onSuccess,
  });
};

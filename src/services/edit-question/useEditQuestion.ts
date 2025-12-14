import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { editQuestion } from "./request";
import { QuestionToEditType } from "@/utils/supabase";

export const useEditQuestion = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: QuestionToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: QuestionToEditType,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: editQuestion,
    onSuccess,
    onError,
  });
};

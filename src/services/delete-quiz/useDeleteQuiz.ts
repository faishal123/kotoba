import { MutationFunctionContext, useMutation } from "@tanstack/react-query";
import { deleteQuiz } from "./request";

export const useDeleteQuiz = (params?: {
  onSuccess?:
    | ((
        data: Response,
        variables: string,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: string,
        onMutateResult: unknown,
        context: MutationFunctionContext
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const onSuccess = params?.onSuccess;
  const onError = params?.onError;
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess,
    onError,
  });
};

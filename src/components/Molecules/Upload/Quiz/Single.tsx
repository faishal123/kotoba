"use client";

import { Button } from "@/components/ui/button";
import { SupabaseQuizType } from "@/utils/supabase";
import { toast } from "react-toastify";
import { FetchDataType } from "@/app/upload/clientPage";
import { z } from "zod";
import { createStringZodSchema } from "@/utils/validation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/Atoms/Form/FormInput";
import { useCreateQuiz } from "@/services/create-quiz/useCreateQuiz";
import { useEditQuiz } from "@/services/edit-quiz/useEditQuiz";
import { useDeleteQuiz } from "@/services/delete-quiz/useDeleteQuiz";

const formSchema = z.object({
  quiz_name: createStringZodSchema({ required: true }),
  description: createStringZodSchema(),
});

type FormType = z.infer<typeof formSchema>;

export const SingleQuizDisplay = ({
  quiz,
  type,
  refetchData,
}:
  | {
      quiz: SupabaseQuizType;
      type: "edit";
      refetchData: FetchDataType;
    }
  | {
      quiz?: undefined;
      type: "create";
      refetchData: FetchDataType;
    }) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quiz_name: quiz?.quiz_name || "",
      description: quiz?.description || "",
    },
  });

  const isEdit = type === "edit";

  const { mutateAsync: createQuiz, isPending: createQuizPending } =
    useCreateQuiz({
      onError: (e) => toast(e.message, { type: "error" }),
    });
  const { mutateAsync: editQuiz, isPending: editQuizPending } = useEditQuiz({
    onError: (e) => toast(e.message, { type: "error" }),
  });
  const { mutateAsync: deleteQuiz, isPending: deleteQuizPending } =
    useDeleteQuiz({
      onError: (e) => toast(e.message, { type: "error" }),
    });

  const submitFunction = async (data: FormType) => {
    if (data?.quiz_name?.trim() === "") {
      toast("Quiz name cannot be empty", { type: "error" });
      return;
    }
    if (isEdit) {
      await editQuiz({
        quiz_id: quiz?.id,
        quiz_name: data?.quiz_name || "",
        description: data?.description || "",
      });
      toast("Quiz updated successfully", { type: "success" });
    } else {
      await createQuiz({
        quiz_name: data?.quiz_name || "",
        description: data?.description || "",
      });
      form.reset();
      toast("Quiz created successfully", { type: "success" });
    }
    await refetchData();
  };

  return (
    <div className="max-w-[300px] w-full p-4 flex flex-col gap-2 rounded-md border border-primary">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFunction)}
          className="space-y-4"
        >
          <FormInput
            disabled={editQuizPending || createQuizPending || deleteQuizPending}
            label="Quiz Name"
            control={form.control}
            name="quiz_name"
            placeholder="Quiz Name"
          />
          <FormInput
            disabled={editQuizPending || createQuizPending || deleteQuizPending}
            label="Description"
            control={form.control}
            name="description"
            placeholder="Quiz Description"
          />
          <div className="flex gap-2">
            <Button
              isLoading={createQuizPending || editQuizPending}
              disabled={deleteQuizPending}
              type="submit"
            >
              {isEdit ? "Edit" : "Create New Quiz"}
            </Button>
            {isEdit && (
              <Button
                disabled={createQuizPending || editQuizPending}
                isLoading={deleteQuizPending}
                type="button"
                onClick={async () => {
                  await deleteQuiz(quiz?.id);
                  toast("Quiz deleted successfully", { type: "success" });
                  await refetchData();
                }}
                variant="outline"
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

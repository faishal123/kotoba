"use client";

import { Button } from "@/components/ui/button";
import { SupabaseQuestionType, SupabaseQuizType } from "@/utils/supabase";
import { ReactNode } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { FetchDataType } from "@/app/upload/clientPage";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { toast } from "react-toastify";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { useCreateQuestions } from "@/services/create-questions/useCreateQuestions";
import { useDeleteQuestion } from "@/services/delete-question/useDeleteQuestion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/Atoms/Form/FormInput";
import { FormSelect } from "@/components/Atoms/Form/FormSelect";
import { useEditQuestion } from "@/services/edit-question/useEditQuestion";
import { createStringZodSchema } from "@/utils/validation";

const formSchema = z.object({
  kanji: createStringZodSchema(),
  furigana: createStringZodSchema({ required: true }),
  romaji: createStringZodSchema({ required: true }),
  meaning: createStringZodSchema({ required: true }),
  quiz_name: createStringZodSchema({ required: true }),
});

type FormType = z.infer<typeof formSchema>;

export const SingleQuestionDialog = ({
  question,
  allQuizzes,
  type,
  trigger,
  refetchData,
}:
  | {
      question: SupabaseQuestionType;
      allQuizzes?: SupabaseQuizType[];
      type: "edit";
      trigger?: ReactNode;
      refetchData: FetchDataType;
    }
  | {
      question?: undefined;
      allQuizzes?: SupabaseQuizType[];
      type: "create";
      trigger?: ReactNode;
      refetchData: FetchDataType;
    }) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kanji: question?.kanji,
      romaji: question?.romaji,
      furigana: question?.furigana,
      meaning: question?.meaning.join(", "),
      quiz_name: question?.["kotoba-quiz-list"]?.quiz_name || "",
    },
  });

  const { mutateAsync: createQuestions, isPending: createQuestionsPending } =
    useCreateQuestions({
      onError: (e) => toast(e.message, { type: "error" }),
    });
  const { mutateAsync: editQuestion, isPending: editQuestionPending } =
    useEditQuestion({
      onError: (e) => toast(e.message, { type: "error" }),
    });

  const isEdit = type === "edit";

  const submitFunction = async (data: FormType) => {
    if (!data.furigana || !data.romaji || !data.meaning || !data.quiz_name) {
      toast("All fields except Kanji are required", { type: "error" });
      return;
    }

    const quiz_id =
      allQuizzes?.find((quiz) => quiz.quiz_name === data.quiz_name)?.id || "";

    if (isEdit) {
      await editQuestion({
        kanji: data?.kanji || "",
        furigana: data.furigana,
        romaji: data.romaji,
        meaning: data.meaning.split(",").map((m) => m.trim()),
        quiz_id,
        question_id: question?.id,
      });
      toast("Question updated successfully", { type: "success" });
    } else {
      await createQuestions([
        {
          kanji: data.kanji || "",
          furigana: data.furigana,
          romaji: data.romaji,
          meaning: data.meaning.split(",").map((m) => m.trim()),
          quiz_id,
        },
      ]);
      toast("Question created successfully", { type: "success" });
    }
    form.reset();
    closeOpenedDialog();
    await refetchData();
  };

  return (
    <DialogComponent title="Edit Question" trigger={trigger}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitFunction)}
          className="space-y-4"
        >
          <FormInput
            label="Kanji"
            name="kanji"
            control={form.control}
            placeholder="Kanji"
            disabled={createQuestionsPending || editQuestionPending}
          />
          <FormInput
            label="Furigana"
            name="furigana"
            control={form.control}
            placeholder="Furigana"
            disabled={createQuestionsPending || editQuestionPending}
          />
          <FormInput
            label="Romaji"
            name="romaji"
            control={form.control}
            placeholder="Romaji"
            disabled={createQuestionsPending || editQuestionPending}
          />
          <FormInput
            label="Meaning"
            name="meaning"
            control={form.control}
            placeholder="Meaning"
            disabled={createQuestionsPending || editQuestionPending}
          />
          <FormSelect
            label="Quiz Name"
            name="quiz_name"
            control={form.control}
            placeholder="Quiz Name"
            options={
              allQuizzes?.map((quiz) => ({
                value: quiz.quiz_name,
                label: quiz.quiz_name,
              })) || []
            }
            disabled={createQuestionsPending || editQuestionPending}
          />
          <Button
            isLoading={createQuestionsPending || editQuestionPending}
            type="submit"
          >
            {isEdit ? "Edit" : "Create"}
          </Button>
        </form>
      </Form>
    </DialogComponent>
  );
};

export const SingleQuestionRow = ({
  question,
  allData,
  fetchData,
}: {
  question: SupabaseQuestionType;
  fetchData: FetchDataType;
  allData: {
    quizzes: SupabaseQuizType[] | undefined | null;
    questions: SupabaseQuestionType[] | undefined | null;
  };
}) => {
  const { mutateAsync: deleteQuestion, isPending: deleteQuestionPending } =
    useDeleteQuestion({
      onError: (e) => toast(e.message, { type: "error" }),
    });
  return (
    <tr>
      <td className="p-2 border border-primary">{question.kanji}</td>
      <td className="p-2 border border-primary">{question.furigana}</td>
      <td className="p-2 border border-primary">{question.romaji}</td>
      <td className="p-2 border border-primary">
        {question.meaning.join(", ")}
      </td>
      <td className="p-2 border border-primary">
        {question?.["kotoba-quiz-list"]?.quiz_name}
      </td>
      <td className="p-2 border border-primary">
        <div className="flex gap-2">
          <SingleQuestionDialog
            refetchData={fetchData}
            allQuizzes={allData?.quizzes || []}
            type="edit"
            question={question}
            trigger={
              <Button>
                <PencilIcon size={16} />
              </Button>
            }
          />
          <Button
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete this question "${question.kanji} (${question.romaji})" ?`
                )
              ) {
                await deleteQuestion(question.id);
                toast("Question deleted successfully", { type: "success" });
                await fetchData();
              }
            }}
            variant="destructive"
            isLoading={deleteQuestionPending}
          >
            <TrashIcon className="text-foreground" size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

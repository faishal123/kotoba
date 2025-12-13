"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EditDataFunctionType,
  SupabaseQuestionType,
  SupabaseQuizType,
} from "@/utils/supabase";
import { ReactNode, useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { FetchDataType } from "@/app/upload/clientPage";
import { DialogComponent } from "@/components/Atoms/Dialog/Dialog";
import { SelectComponent } from "@/components/Atoms/Select/Select";
import { toast } from "react-toastify";
import { closeOpenedDialog } from "@/components/ui/dialog";
import { useCreateQuestions } from "@/services/create-questions/useCreateQuestions";
import { useDeleteQuestion } from "@/services/delete-question/useDeleteQuestion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/Atoms/Form/FormInput";

const formSchema = z.object({
  kanji: z.string(),
  furigana: z.string(),
  romaji: z.string(),
  meaning: z.string(),
  quiz_id: z.string(),
});

type FormType = z.infer<typeof formSchema>;

export const SingleQuestionDialog = ({
  question,
  onSubmit,
  allQuizzes,
  type,
  trigger,
  refetchData,
}:
  | {
      question: SupabaseQuestionType;
      onSubmit: EditDataFunctionType;
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
      onSubmit: undefined;
    }) => {
  const [value, setValue] = useState({
    kanji: question?.kanji,
    furigana: question?.furigana,
    romaji: question?.romaji,
    meaning: question?.meaning.join(", "),
    quiz_name: question?.["kotoba-quiz-list"]?.quiz_name || "",
  });

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kanji: "",
      romaji: "",
      furigana: "",
      meaning: "",
      quiz_id: "",
    },
  });

  const onSubmit2 = (data: FormType) => {
    console.log("sini oi submit", data);
  };

  const { mutateAsync: createQuestions } = useCreateQuestions();

  const isEdit = type === "edit";

  const submitFunction = async () => {
    if (
      !value.kanji ||
      !value.furigana ||
      !value.romaji ||
      !value.meaning ||
      !value.quiz_name
    ) {
      toast("All fields are required", { type: "error" });
      return;
    }

    const quiz_id =
      allQuizzes?.find((quiz) => quiz.quiz_name === value.quiz_name)?.id || "";

    if (isEdit) {
      await onSubmit({
        table: "kotoba-questions",
        id: question?.id || "",
        data: {
          kanji: value.kanji,
          furigana: value.furigana,
          romaji: value.romaji,
          meaning: value.meaning.split(",").map((m) => m.trim()),
          quiz_id,
        },
      });
      toast("Question updated successfully", { type: "success" });
    } else {
      await createQuestions([
        {
          kanji: value.kanji,
          furigana: value.furigana,
          romaji: value.romaji,
          meaning: value.meaning.split(",").map((m) => m.trim()),
          quiz_id,
        },
      ]);
      setValue({
        kanji: "",
        furigana: "",
        romaji: "",
        meaning: "",
        quiz_name: "",
      });
      toast("Question created successfully", { type: "success" });
    }
    closeOpenedDialog();
    await refetchData();
  };

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitFunction();
    }
  };
  return (
    <DialogComponent title="Edit Question" trigger={trigger}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit2)}>
          <FormInput
            label="Kanji"
            name="kanji"
            control={form.control}
            placeholder="Kanji"
          />
          <FormInput
            label="Furigana"
            name="furigana"
            control={form.control}
            placeholder="Furigana"
          />
          <FormInput
            label="Romaji"
            name="romaji"
            control={form.control}
            placeholder="Romaji"
          />
          <FormInput
            label="Meaning"
            name="meaning"
            control={form.control}
            placeholder="Meaning"
          />
          <Button type="submit">Edit</Button>
        </form>
      </Form>
      <div>
        <div>Kanji</div>
        <Input
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, kanji: e.target.value }));
          }}
          value={value.kanji}
        />
      </div>
      <div>
        <div>Furigana</div>
        <Input
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, furigana: e.target.value }));
          }}
          value={value.furigana}
        />
      </div>
      <div>
        <div>Romaji</div>
        <Input
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, romaji: e.target.value }));
          }}
          value={value.romaji}
        />
      </div>
      <div>
        <div>Meaning</div>
        <Input
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue((prev) => ({ ...prev, meaning: e.target.value }));
          }}
          value={value.meaning}
        />
      </div>
      <div>
        <div>Quiz Name</div>
        <SelectComponent
          onChange={(e) => {
            setValue((prev) => ({ ...prev, quiz_name: e }));
          }}
          value={value?.quiz_name}
          options={
            allQuizzes?.map((quiz) => ({
              value: quiz.quiz_name,
              label: quiz.quiz_name,
            })) || []
          }
        />
      </div>
      <Button onClick={submitFunction}>{isEdit ? "Edit" : "Create"}</Button>
    </DialogComponent>
  );
};

export const SingleQuestionRow = ({
  question,
  allData,
  editData,
  fetchData,
}: {
  question: SupabaseQuestionType;
  editData: EditDataFunctionType;
  fetchData: FetchDataType;
  allData: {
    quizzes: SupabaseQuizType[];
    questions: SupabaseQuestionType[];
  };
}) => {
  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
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
      <td className="p-2 border border-primary flex gap-2">
        <SingleQuestionDialog
          refetchData={fetchData}
          onSubmit={editData}
          allQuizzes={allData?.quizzes}
          type="edit"
          question={question}
          trigger={
            <button className="p-2 rounded-sm bg-gray-100 transition-all hover:bg-gray-200 cursor-pointer">
              <PencilIcon size={16} />
            </button>
          }
        />
        <button
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
          className="p-2 rounded-sm bg-red-100 transition-all hover:bg-red-200 cursor-pointer"
        >
          <TrashIcon size={16} />
        </button>
      </td>
    </tr>
  );
};

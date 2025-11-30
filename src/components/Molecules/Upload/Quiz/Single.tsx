"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DeleteDataFunctionType,
  InsertNewDataFunctionType,
  EditDataFunctionType,
  SupabaseQuizType,
} from "@/utils/supabase";
import { toast } from "react-toastify";
import { useState } from "react";
import { FetchDataType } from "@/app/upload/clientPage";

export const SingleQuizDisplay = ({
  quiz,
  onSubmit,
  onDelete,
  type,
  refetchData,
}:
  | {
      quiz: SupabaseQuizType;
      onSubmit: EditDataFunctionType;
      type: "edit";
      onDelete: DeleteDataFunctionType;
      refetchData: FetchDataType;
    }
  | {
      quiz?: undefined;
      onSubmit: InsertNewDataFunctionType;
      type: "create";
      onDelete?: undefined;
      refetchData: FetchDataType;
    }) => {
  const [value, setValue] = useState({
    quiz_name: quiz?.quiz_name || "",
    description: quiz?.description || "",
  });
  const isEdit = type === "edit";

  const submitFunction = async () => {
    if (value.quiz_name.trim() === "") {
      toast("Quiz name cannot be empty", { type: "error" });
      return;
    }
    if (isEdit) {
      await onSubmit({
        table: "kotoba-quiz-list",
        id: quiz?.id || "",
        data: {
          quiz_name: value.quiz_name,
          description: value.description,
        },
      });
      toast("Quiz updated successfully", { type: "success" });
    } else {
      console.log(onSubmit);
      await onSubmit({
        table: "kotoba-quiz-list",
        data: [
          {
            quiz_name: value.quiz_name,
            description: value.description,
          },
        ],
      });
      toast("Quiz created successfully", { type: "success" });
      setValue({ quiz_name: "", description: "" });
    }
    await refetchData();
  };

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitFunction();
    }
  };

  return (
    <div className="max-w-[300px] w-full p-4 flex flex-col gap-2 rounded-md border border-primary">
      <div>
        {quiz?.id && <div className="text-sm text-gray-500">ID: {quiz.id}</div>}
        <div>Quiz Name</div>
        <Input
          className="font-bold"
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue({ ...value, quiz_name: e.target.value });
          }}
          value={value.quiz_name}
        />
      </div>
      <div>
        <div>Description</div>
        <Input
          onKeyDown={keyDown}
          onChange={(e) => {
            setValue({ ...value, description: e.target.value });
          }}
          value={value.description}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={submitFunction}
          disabled={
            value.quiz_name === quiz?.quiz_name &&
            value.description === quiz?.description
          }
        >
          {isEdit ? "Edit" : "Create New Quiz"}
        </Button>
        {isEdit && (
          <Button
            onClick={async () => {
              if (onDelete) {
                await onDelete({
                  table: "kotoba-quiz-list",
                  id: quiz?.id || "",
                });
                toast("Quiz deleted successfully", { type: "success" });
                await refetchData();
              }
            }}
            variant="outline"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

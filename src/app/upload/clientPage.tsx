"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DeleteDataFunctionType,
  EditDataFunctionType,
  GetAllDataFunctionType,
  InsertNewDataFunctionType,
  SupabaseQuestionType,
  SupabaseQuizType,
} from "./page";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const SingleQuizDisplay = ({
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
      refetchData: () => Promise<void>;
    }
  | {
      quiz?: undefined;
      onSubmit: InsertNewDataFunctionType;
      type: "create";
      onDelete?: undefined;
      refetchData: () => Promise<void>;
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
      await refetchData();
    } else {
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
      await refetchData();
    }
  };

  return (
    <div className="max-w-[300px] w-full p-4 flex flex-col gap-2 rounded-md border border-primary">
      <div>
        <div>Quiz Name</div>
        <Input
          className="font-bold"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitFunction();
            }
          }}
          onChange={(e) => {
            setValue({ ...value, quiz_name: e.target.value });
          }}
          value={value.quiz_name}
        />
      </div>
      <div>
        <div>Description</div>
        <Input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitFunction();
            }
          }}
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

export const ClientPage = ({
  //  uploadFunction,
  getAllData,
  insertNewData,
  editData,
  deleteData,
}: {
  getAllData: GetAllDataFunctionType;
  insertNewData: InsertNewDataFunctionType;
  editData: EditDataFunctionType;
  deleteData: DeleteDataFunctionType;
  // uploadFunction: () => Promise<void>;
}) => {
  const getAllDataFunction = async () => {
    const data = {
      quizzes: await getAllData("kotoba-quiz-list"),
      questions: await getAllData("kotoba-questions"),
    };
    return data;
  };

  const [allData, setAllData] = useState<{
    quizzes: SupabaseQuizType[];
    questions: SupabaseQuestionType[];
  }>({
    quizzes: [],
    questions: [],
  });

  const fetchData = async () => {
    const { quizzes = [], questions = [] } = await getAllDataFunction();
    if (quizzes && questions) {
      setAllData({ questions, quizzes });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl font-bold mb-2">Existing Questions</h1>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">Existing Quiz</h1>
        <div className="flex flex-wrap gap-4">
          {allData.quizzes.length
            ? allData.quizzes.map((quiz) => {
                return (
                  <SingleQuizDisplay
                    onDelete={deleteData}
                    onSubmit={editData}
                    key={quiz.id}
                    type="edit"
                    quiz={quiz}
                    refetchData={fetchData}
                  />
                );
              })
            : "No Quiz Registered"}
          <SingleQuizDisplay
            refetchData={fetchData}
            type="create"
            onSubmit={insertNewData}
          />
        </div>
      </div>
      {/* <Button
        onClick={() => {
          console.log("click");
          uploadFunction();
        }}
      >
        Upload Data
      </Button> */}
    </div>
  );
};

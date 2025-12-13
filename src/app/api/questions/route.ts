import {
  deleteData,
  getAllData,
  insertNewData,
  QuestionToUploadType,
  removeDuplicateQuestions,
  SupabaseQuestionType,
} from "@/utils/supabase";
import { NextRequest } from "next/server";

export async function GET() {
  const data = await getAllData("kotoba-questions");

  return Response.json({ data });
}

export async function POST(request: Request) {
  const reqBody = await request.json();
  const questionsToInsert: QuestionToUploadType[] = reqBody?.questions;

  if ((questionsToInsert || []).length <= 0) {
    return Response.json(
      { message: "Please insert valid data" },
      { status: 400 }
    );
  }

  try {
    const currentQuizId = questionsToInsert?.[0]?.quiz_id;
    const currentQuizQuestions = (await getAllData(
      "kotoba-questions",
      undefined,
      undefined,
      {
        by: "quiz_id",
        value: currentQuizId,
      }
    )) as SupabaseQuestionType[] | null;

    const removedDuplicate = removeDuplicateQuestions(
      currentQuizQuestions || [],
      questionsToInsert
    );

    if ((removedDuplicate || []).length <= 0) {
      return Response.json(
        { message: "The questions you inserted already exist" },
        { status: 400 }
      );
    }

    await insertNewData({
      table: "kotoba-questions",
      data: questionsToInsert,
    });
  } catch (error) {
    return Response.json(
      { message: "Error inserting data", error },
      { status: 500 }
    );
  }

  return Response.json({ message: "POST request received", body: reqBody });
}

export async function DELETE(request: NextRequest) {
  const nextUrl = request?.nextUrl;
  const idToDelete = nextUrl.searchParams.get("id");

  if (!idToDelete) {
    return Response.json(
      {
        message:
          "Pleave provide the id of the question that you want to delete",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await deleteData({ table: "kotoba-questions", id: idToDelete });
  } catch (e) {
    return Response.json(
      { message: "Error deleting data", e },
      {
        status: 400,
      }
    );
  }

  return Response.json({ message: "success" });
}

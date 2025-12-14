import {
  deleteData,
  editData,
  getAllData,
  insertNewData,
  QuizToEditType,
  QuizToUploadType,
  SupabaseQuizType,
} from "@/utils/supabase";
import { NextRequest } from "next/server";

export async function GET() {
  const data = await getAllData("kotoba-quiz-list", undefined, {
    by: "quiz_name",
    ascending: true,
  });
  return Response.json({ data });
}

export async function PUT(request: Request) {
  const reqBody = await request.json();
  const quizToEdit: QuizToEditType = reqBody?.quiz;
  if (!quizToEdit) {
    return Response.json(
      { message: "Please insert valid data" },
      {
        status: 400,
      }
    );
  }

  try {
    const quizWithTheSameName = (await getAllData(
      "kotoba-quiz-list",
      undefined,
      undefined,
      {
        by: "quiz_name",
        value: quizToEdit?.quiz_name,
      }
    )) as SupabaseQuizType[] | null;

    if (
      (quizWithTheSameName || []).length > 0 &&
      quizWithTheSameName?.[0]?.id !== quizToEdit?.quiz_id
    ) {
      return Response.json(
        { message: "That quiz name is already taken" },
        { status: 400 }
      );
    }
    await editData({
      table: "kotoba-quiz-list",
      id: quizToEdit?.quiz_id,
      data: {
        quiz_name: quizToEdit?.quiz_name,
        description: quizToEdit?.description,
      },
    });
  } catch (error) {
    return Response.json(
      {
        message: "Error edit data",
        error,
      },
      {
        status: 500,
      }
    );
  }

  return Response.json({ message: "Edit success" }, { status: 200 });
}

export async function POST(request: Request) {
  const reqBody = await request.json();
  const quizToInsert: QuizToUploadType = reqBody?.quiz;

  if (!quizToInsert) {
    return Response.json(
      {
        message: "Please insert valid data",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const quizWithTheSameName = (await getAllData(
      "kotoba-quiz-list",
      undefined,
      undefined,
      {
        by: "quiz_name",
        value: quizToInsert?.quiz_name,
      }
    )) as SupabaseQuizType[] | null;

    if ((quizWithTheSameName || []).length > 0) {
      return Response.json(
        { message: "The quiz you want to insert already exist" },
        { status: 400 }
      );
    }

    await insertNewData({
      table: "kotoba-quiz-list",
      data: [quizToInsert],
    });
  } catch (error) {
    return Response.json(
      { message: "Error inserting data", error },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    {
      message: "Success",
    },
    {
      status: 200,
    }
  );
}

export async function DELETE(request: NextRequest) {
  const nextUrl = request?.nextUrl;
  const idToDelete = nextUrl.searchParams.get("id");

  if (!idToDelete) {
    return Response.json(
      { message: "Please provide the id of the quiz that you want to delete" },
      {
        status: 400,
      }
    );
  }

  try {
    await deleteData({ table: "kotoba-quiz-list", id: idToDelete });
  } catch (error) {
    return Response.json(
      { message: "Error deleting data", error },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    { message: "Success" },
    {
      status: 200,
    }
  );
}

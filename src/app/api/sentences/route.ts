import { checkForDuplicate } from "@/utils/server";
import {
  deleteData,
  editData,
  getAllData,
  insertNewData,
  SentenceToEditType,
  SentenceToUploadType,
  SupabaseSentenceType,
} from "@/utils/supabase";
import { NextRequest } from "next/server";

const validateSentence = async (
  sentence: SentenceToEditType | SentenceToUploadType,
) => {
  if (!sentence) {
    return {
      isValid: false,
      response: Response.json(
        { message: "Please insert valid data" },
        {
          status: 400,
        },
      ),
    };
  }

  const allSentences =
    (await getAllData<SupabaseSentenceType>("sentences")) || [];

  const dataAlreadyExist = checkForDuplicate(allSentences, sentence, [
    "id",
    "created_at",
  ]);
  if (dataAlreadyExist) {
    return {
      isValid: false,
      response: Response.json(
        { message: "The data you inserted already exist" },
        { status: 400 },
      ),
    };
  }

  return {
    isValid: true,
  };
};

export async function GET() {
  const data = await getAllData("sentences");
  return Response.json({ data });
}

export async function PUT(request: Request) {
  const reqBody = await request.json();
  const sentenceToEdit: SentenceToEditType = reqBody?.sentence;

  try {
    const { isValid, response } = await validateSentence(sentenceToEdit);
    if (!isValid) {
      return response;
    }

    await editData({
      table: "sentences",
      id: sentenceToEdit?.id,
      data: {
        english: sentenceToEdit?.english,
        sentence_json: sentenceToEdit?.sentence_json,
        sentence: sentenceToEdit?.sentence,
      },
    });
  } catch (e) {
    return Response.json({ message: "Error Editing data", e }, { status: 500 });
  }
  return Response.json({ message: "Edit success", body: reqBody });
}

export async function POST(request: Request) {
  const reqBody = await request.json();
  const sentenceToInsert: SentenceToUploadType = reqBody?.sentence;
  try {
    const { isValid, response } = await validateSentence(sentenceToInsert);

    if (!isValid) {
      return response;
    }

    const newData = await insertNewData({
      table: "sentences",
      data: sentenceToInsert,
    });

    return Response.json({ message: "Create Sentence Success", body: newData });
  } catch (e) {
    return Response.json(
      { message: "Error Creating Data", e },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const nextUrl = request?.nextUrl;
  const idToDelete = nextUrl.searchParams.get("id");

  if (!idToDelete) {
    return Response.json(
      {
        message:
          "Pleave provide the id of the particle that you want to delete",
      },
      {
        status: 400,
      },
    );
  }
  try {
    await deleteData({ table: "sentences", id: idToDelete });
  } catch (error) {
    return Response.json(
      { message: "Error deleting data", error },
      {
        status: 500,
      },
    );
  }

  return Response.json({ message: "success" });
}

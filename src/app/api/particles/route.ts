import { checkForDuplicate } from "@/utils/server";
import {
  deleteData,
  editData,
  getAllData,
  insertNewData,
  ParticleToUploadType,
  SupabaseParticleType,
} from "@/utils/supabase";
import { NextRequest } from "next/server";

const validateParticle = async (particle: ParticleToUploadType) => {
  if (!particle) {
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

  const allParticles =
    (await getAllData<SupabaseParticleType>("particles")) || [];

  const dataAlreadyExist = checkForDuplicate(allParticles, particle, [
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
  const data = await getAllData("particles");
  return Response.json({ data });
}

export async function PUT(request: Request) {
  const reqBody = await request.json();
  const particleToEdit: ParticleToUploadType = reqBody?.particle;
  try {
    const { isValid, response } = await validateParticle(particleToEdit);

    if (!isValid) {
      return response;
    }

    await editData({
      table: "particles",
      id: particleToEdit?.id,
      data: {
        japanese: particleToEdit?.japanese,
        romaji: particleToEdit?.romaji,
        english: particleToEdit?.english,
      },
    });
  } catch (e) {
    return Response.json({ message: "Error Editing data", e }, { status: 500 });
  }
  return Response.json({ message: "Edit success", body: reqBody });
}

export async function POST(request: Request) {
  const reqBody = await request.json();
  const particleToInsert: ParticleToUploadType = reqBody?.particle;

  try {
    const { isValid, response } = await validateParticle(particleToInsert);

    if (!isValid) {
      return response;
    }

    const newData = await insertNewData({
      table: "particles",
      data: particleToInsert,
    });

    return Response.json({ message: "Create Particle Success", body: newData });
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
    await deleteData({ table: "particles", id: idToDelete });
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

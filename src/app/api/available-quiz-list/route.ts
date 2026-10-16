import { getAllData } from "@/utils/supabase";
import { SupabaseAvailableQuizViewType } from "@/models/availableQuiz";

export async function GET() {
  const data = await getAllData<SupabaseAvailableQuizViewType>(
    "kotoba_quiz_available_list",
  );

  return Response.json({ data });
}

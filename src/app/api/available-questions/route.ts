import { getAllData, SupabaseAvailableQuizViewType } from "@/utils/supabase";

export async function GET() {
  const data = await getAllData<SupabaseAvailableQuizViewType>(
    "kotoba_quiz_available_list"
  );

  return Response.json({ data });
}

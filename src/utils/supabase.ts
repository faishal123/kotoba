/* eslint-disable @typescript-eslint/no-explicit-any */

import { ParticleToUploadType } from "@/models/particle";
import { QuestionToUploadType, SupabaseQuestionType } from "@/models/question";
import { QuizToUploadType } from "@/models/quiz";
import { SentenceToUploadType } from "@/models/sentence";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export type GetAllDataFunctionType = <T>(
  table: string,
  select?: string,
  order?: {
    by: string;
    ascending: boolean;
  },
  eq?: {
    by: string;
    value: string;
  },
) => Promise<T[] | null>;

export type InsertNewDataFunctionType = ({
  table,
  data,
}:
  | {
      table: "kotoba-questions";
      data: QuestionToUploadType[];
    }
  | {
      table: "sentences";
      data: SentenceToUploadType;
    }
  | {
      table: "particles";
      data: ParticleToUploadType;
    }
  | {
      table: "kotoba-quiz-list";
      data: QuizToUploadType[];
    }) => Promise<any[] | null>;

export type EditDataFunctionType = ({
  table,
  id,
  data,
}:
  | {
      table: "kotoba-questions";
      id: string;
      data: Partial<QuestionToUploadType>;
    }
  | {
      table: "particles";
      id: string;
      data: Partial<ParticleToUploadType>;
    }
  | {
      table: "kotoba-quiz-list";
      id: string;
      data: Partial<QuizToUploadType>;
    }) => Promise<any[] | null>;

export type DeleteDataFunctionType = ({
  table,
  id,
}: {
  table: "kotoba-questions" | "kotoba-quiz-list" | "particles" | "sentences";
  id: string;
}) => Promise<any[] | null>;

export const getCountOfATable = async (table: string) => {
  "use server";
  const response = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .limit(1);

  return response?.count as number;
};

export const getAllData = async <T>(
  table: string,
  select?: string,
  order?: {
    by: string;
    ascending: boolean;
  },
  eq?: {
    by: string;
    value: string;
  },
  pagination?: {
    limit: number;
    offset: number;
  },
  randomized?: boolean,
) => {
  "use server";
  let supabaseFunction = supabase.from(table).select(select || "*");

  if (eq) {
    supabaseFunction = supabaseFunction.eq(eq.by, eq.value);
  }

  if (!randomized) {
    supabaseFunction = supabaseFunction
      .order(order?.by || "id", { ascending: !!order?.ascending })
      .order("id", { ascending: true });
  }

  if (pagination) {
    supabaseFunction = supabaseFunction.range(
      pagination.offset,
      pagination.offset + pagination.limit - 1,
    );
  }

  const response = await supabaseFunction;

  return response?.data as T[] | null;
};

export const insertNewData: InsertNewDataFunctionType = async ({
  table,
  data,
}) => {
  "use server";
  try {
    const { data: insertedData } = await supabase
      .from(table)
      .insert(data)
      .select();

    return insertedData;
  } catch (error) {
    throw error;
  }
};

export const editData = async ({
  table,
  id,
  data,
}:
  | {
      table: "kotoba-questions";
      id: string;
      data: Partial<QuestionToUploadType>;
    }
  | {
      table: "sentences";
      id: string;
      data: Partial<SentenceToUploadType>;
    }
  | {
      table: "kotoba-quiz-list";
      id: string;
      data: Partial<QuizToUploadType>;
    }
  | {
      table: "particles";
      id: string;
      data: Partial<ParticleToUploadType>;
    }) => {
  "use server";
  try {
    const { data: updatedData } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select();
    return updatedData;
  } catch (error) {
    throw error;
  }
};

export const deleteData: DeleteDataFunctionType = async ({ table, id }) => {
  "use server";
  try {
    const { data: deletedData } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .select();
    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const removeDuplicateQuestions = (
  existingData: SupabaseQuestionType[] | null,
  dataToUpload: QuestionToUploadType[],
) => {
  return dataToUpload.reduce<QuestionToUploadType[]>((a, c) => {
    const currentItemExist = (existingData || []).reduce<boolean>((a2, c2) => {
      const romajiMatch = c2.romaji === c.romaji;
      const furiganaMatch = c2.furigana === c.furigana;
      const kanjiMatch = c2.kanji === c.kanji;
      return a2 || (romajiMatch && furiganaMatch && kanjiMatch);
    }, false);

    if (currentItemExist) {
      return a;
    }
    return [...a, c];
  }, []);
};

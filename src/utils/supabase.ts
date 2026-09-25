/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export type SupabaseParticleType = {
  id: string;
  created_at?: string;
  japanese: string;
  romaji: string;
  english?: string;
};

export interface KanjiComponent {
  kanji: string;
  furigana?: string;
  romanji: string;
  english: string;
}

export interface JapaneseToken {
  japanese: string;
  furigana?: string;
  romanji: string;
  english: string;
  components?: KanjiComponent[];
}

export type SentenceJSON = JapaneseToken[];

export type SupabaseSentenceType = {
  id: string;
  created_at?: string;
  sentence_json: SentenceJSON;
  english: string;
  sentence: string;
};

export type SentenceToEditType = Omit<SupabaseSentenceType, "created_at">;
export type SentenceToUploadType = Omit<
  SupabaseSentenceType,
  "created_at" | "id"
>;

export type SupabaseQuestionType = {
  id: string;
  created_at: string;
  romaji: string;
  furigana: string;
  kanji: string;
  meaning: string[];
  quiz_id: string;
  "kotoba-quiz-list"?: {
    quiz_name: string;
  };
};

export type SupabaseQuizType = {
  id: string;
  created_at: string;
  description: string;
  quiz_name: string;
};

export type SupabaseAvailableQuizViewType = {
  id: string;
  created_at: string;
  description: string;
  quiz_name: string;
  question_count: number;
};

export type BaseQuestionType = {
  romaji: string;
  furigana: string;
  kanji: string;
  meaning: string[];
};

export interface QuestionToUploadType extends BaseQuestionType {
  quiz_id: string;
}

export interface QuestionToEditType extends QuestionToUploadType {
  question_id: string;
}

export type QuizToUploadType = {
  quiz_name: string;
  description: string;
};

export type ParticleToUploadType = Omit<
  SupabaseParticleType,
  "created_at" | "id"
>;

export type ParticleToEditType = Omit<SupabaseParticleType, "created_at">;

export interface QuizToEditType extends QuizToUploadType {
  quiz_id: string;
}

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

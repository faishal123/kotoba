/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

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

export type QuizToUploadType = {
  quiz_name: string;
  description: string;
};

export type GetAllDataFunctionType = (
  table: string,
  select?: string,
  order?: {
    by: string;
    ascending: boolean;
  }
) => Promise<any[] | null>;

export type InsertNewDataFunctionType = ({
  table,
  data,
}:
  | {
      table: "kotoba-questions";
      data: QuestionToUploadType[];
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
      table: "kotoba-quiz-list";
      id: string;
      data: Partial<QuizToUploadType>;
    }) => Promise<any[] | null>;

export type DeleteDataFunctionType = ({
  table,
  id,
}: {
  table: "kotoba-questions" | "kotoba-quiz-list";
  id: string;
}) => Promise<any[] | null>;

export const getAllData: GetAllDataFunctionType = async (
  table: string,
  select?: string,
  order?: {
    by: string;
    ascending: boolean;
  },
  eq?: {
    by: string;
    value: string;
  }
) => {
  "use server";
  const { data: existingData } = await supabase
    .from(table)
    .select(select || "*")
    .order(order?.by || "id", { ascending: !!order?.ascending })
    .order("id", { ascending: true });

  return existingData;
};

export const insertNewData: InsertNewDataFunctionType = async ({
  table,
  data,
}:
  | { table: "kotoba-questions"; data: QuestionToUploadType[] }
  | { table: "kotoba-quiz-list"; data: QuizToUploadType[] }) => {
  "use server";
  try {
    const { data: insertedData } = await supabase
      .from(table)
      .insert(data)
      .select();

    return insertedData;
  } catch (error) {
    return null;
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
      table: "kotoba-quiz-list";
      id: string;
      data: Partial<QuizToUploadType>;
    }) => {
  "use server";
  const { data: updatedData } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select();
  return updatedData;
};

export const deleteData: DeleteDataFunctionType = async ({
  table,
  id,
}: {
  table: "kotoba-questions" | "kotoba-quiz-list";
  id: string;
}) => {
  "use server";
  const { data: deletedData } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select();
  return deletedData;
};

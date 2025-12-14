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

export interface QuestionToEditType extends QuestionToUploadType {
  question_id: string;
}

export type QuizToUploadType = {
  quiz_name: string;
  description: string;
};

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
  }
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

export const getAllData: GetAllDataFunctionType = async <T>(
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
  const { data } = eq
    ? await supabase
        .from(table)
        .select(select || "*")
        .eq(eq.by, eq.value)
        .order(order?.by || "id", { ascending: !!order?.ascending })
        .order("id", { ascending: true })
    : await supabase
        .from(table)
        .select(select || "*")
        .order(order?.by || "id", { ascending: !!order?.ascending })
        .order("id", { ascending: true });

  return data as T[] | null;
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
      table: "kotoba-quiz-list";
      id: string;
      data: Partial<QuizToUploadType>;
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

export const deleteData: DeleteDataFunctionType = async ({
  table,
  id,
}: {
  table: "kotoba-questions" | "kotoba-quiz-list";
  id: string;
}) => {
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
  dataToUpload: QuestionToUploadType[]
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

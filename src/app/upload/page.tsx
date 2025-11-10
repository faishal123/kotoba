/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { ClientPage } from "./clientPage";
import { kataKerjaPart1 } from "@/constant/minna-no-nihongo";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export type SupabaseQuestionType = {
  id: string;
  created_at: string;
  romaji: string;
  furigana: string;
  kanji: string;
  meaning: string[];
  quiz: string;
};

export type SupabaseQuizType = {
  id: string;
  created_at: string;
  description: string;
  quiz_name: string;
};

export type QuestionToUploadType = {
  romaji: string;
  furigana: string;
  kanji: string;
  meaning: string[];
  quiz: string;
};

export type QuizToUploadType = {
  quiz_name: string;
  description: string;
};

export type GetAllDataFunctionType = (table: string) => Promise<any[] | null>;

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

const removeDuplicates = (
  existingData: SupabaseQuestionType[],
  dataToUpload: QuestionToUploadType[]
) => {
  return dataToUpload.reduce<QuestionToUploadType[]>((a, c) => {
    const currentItemExist = existingData.reduce<boolean>((a2, c2) => {
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

export default async function Page() {
  const getAllData: GetAllDataFunctionType = async (table: string) => {
    "use server";
    const { data: existingData } = await supabase.from(table).select("*");

    return existingData;
  };

  const insertNewData: InsertNewDataFunctionType = async ({
    table,
    data,
  }:
    | { table: "kotoba-questions"; data: QuestionToUploadType[] }
    | { table: "kotoba-quiz-list"; data: QuizToUploadType[] }) => {
    "use server";
    const { data: insertedData } = await supabase
      .from(table)
      .insert(data)
      .select();
    return insertedData;
  };

  const editData = async ({
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

  const deleteData: DeleteDataFunctionType = async ({
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

  const uploadFunction = async () => {
    "use server";

    const kataKerjaPart1Data = kataKerjaPart1.map((kk) => ({
      romaji: kk.romaji,
      furigana: kk.furigana,
      kanji: kk.kanji,
      meaning: kk.indonesian_translation_options,
      quiz: "Kata Kerja Part 1",
    }));

    const existingData = await getAllData("kotoba-questions");

    if (existingData) {
      const removedDuplicate = removeDuplicates(
        existingData,
        kataKerjaPart1Data
      );

      await supabase.from("kotoba-questions").insert(removedDuplicate).select();
    }
  };
  return (
    <div>
      {/* TODO: uncomment this to enable upload page */}
      {/* <ClientPage
        insertNewData={insertNewData}
        editData={editData}
        // uploadFunction={uploadFunction}
        getAllData={getAllData}
        deleteData={deleteData}
      /> */}
    </div>
  );
}

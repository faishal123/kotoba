/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { ClientPage } from "./clientPage";
import { kataKerjaPart1 } from "@/constant/minna-no-nihongo";
import {
  deleteData,
  editData,
  getAllData,
  insertNewData,
  QuestionToUploadType,
  SupabaseQuestionType,
} from "@/utils/supabase";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const removeDuplicates = (
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

export default async function Page() {
  const uploadFunction = async () => {
    "use server";

    const kataKerjaPart1Data = kataKerjaPart1.map((kk) => ({
      romaji: kk.romaji,
      furigana: kk.furigana,
      kanji: kk.kanji,
      meaning: kk.indonesian_translation_options,
      quiz_id: "6a173103-ced1-4a41-a5c1-22f71d9919ac",
    }));

    const existingData = await getAllData("kotoba-questions");

    // if (existingData) {
    const removedDuplicate = removeDuplicates(existingData, kataKerjaPart1Data);

    const response = await supabase
      .from("kotoba-questions")
      .insert(removedDuplicate)
      .select();

    console.log("Upload response:", response);
    // }
  };
  return (
    <div>
      {/* TODO: uncomment this to enable upload page */}
      <ClientPage
        insertNewData={insertNewData}
        editData={editData}
        uploadFunction={uploadFunction}
        getAllData={getAllData}
        deleteData={deleteData}
      />
    </div>
  );
}

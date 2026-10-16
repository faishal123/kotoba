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

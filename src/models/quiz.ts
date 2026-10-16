export type SupabaseQuizType = {
  id: string;
  created_at: string;
  description: string;
  quiz_name: string;
};

export type QuizToUploadType = {
  quiz_name: string;
  description: string;
};

export interface QuizToEditType extends QuizToUploadType {
  quiz_id: string;
}

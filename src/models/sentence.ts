export interface WordComponent {
  kanji: string;
  furigana?: string;
  romaji: string;
  english?: string;
}

export interface SentenceWord {
  romaji: string;
  english: string;
  furigana?: string;
  japanese: string;
  components?: WordComponent[];
}

export type SentenceJSON = SentenceWord[];
export type PartialSentenceJSON = Partial<SentenceWord>[];
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

export interface ThesisTopic {
  title: string;
  description: string;
}

export interface GeminiApiResponse {
  topics: ThesisTopic[];
}
